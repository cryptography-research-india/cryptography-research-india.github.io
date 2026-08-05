#!/usr/bin/env ruby
# frozen_string_literal: true

# Validates the data files that the community-submission automation
# (.github/workflows/process-submissions.yml) writes to, so a malformed or
# incomplete auto-generated PR fails CI instead of silently merging broken
# data (e.g. a missing required field, a bad URL, or a duplicate entry).
#
# Checks, per source:
#   _data/names-people.yml   - required keys, tag vocabulary, URL shape, dup names
#   _data/collaborations.yml - required keys, email shape, URL shape, dup (name+topic)
#   _positions/*.md          - required front matter keys, URL shape, dup (title+org)
#
# Exits non-zero (and prints "::error::" annotations) if any check fails.

require "yaml"
require "date"

ROOT = File.expand_path("../..", __dir__)
errors = []

URL_RE = %r{\Ahttps?://[^\s]+\z}
EMAIL_RE = /\A[^@\s]+@[^@\s]+\.[^@\s]+\z/
VALID_SECTOR_TAGS = %w[ACADEMIA INDUSTRY].freeze
VALID_LOCATION_TAGS = %w[WORKING_IN_INDIA WORKING_ABROAD].freeze

def error(errors, source, message)
  errors << "#{source}: #{message}"
  puts "::error::#{source}: #{message}"
end

def normalize(str)
  str.to_s.strip.downcase.gsub(/\s+/, " ")
end

# ── _data/names-people.yml ────────────────────────────────────────────────
people_path = File.join(ROOT, "_data/names-people.yml")
if File.exist?(people_path)
  people = YAML.safe_load_file(people_path, permitted_classes: [Date], aliases: true) || []
  seen_names = {}

  people.each_with_index do |person, i|
    src = "_data/names-people.yml entry ##{i + 1} (#{person['name'] || 'unnamed'})"

    %w[name designation affiliation].each do |key|
      error(errors, src, "missing required field `#{key}`") if person[key].to_s.strip.empty?
    end

    if person["research"].to_s.strip.empty?
      error(errors, src, "missing required field `research`")
    end

    tags = person["tags"] || []
    unless tags.is_a?(Array) && (tags & VALID_SECTOR_TAGS).any?
      error(errors, src, "`tags` must include one of #{VALID_SECTOR_TAGS.join(' / ')}")
    end
    unless tags.is_a?(Array) && (tags & VALID_LOCATION_TAGS).any?
      error(errors, src, "`tags` must include one of #{VALID_LOCATION_TAGS.join(' / ')}")
    end

    %w[webpage webpagelab].each do |key|
      value = person[key]
      if value && !value.to_s.strip.empty? && value.to_s.strip !~ URL_RE
        error(errors, src, "`#{key}` is not a valid http(s) URL: #{value}")
      end
    end

    next if person["name"].to_s.strip.empty?

    key = normalize(person["name"])
    if seen_names[key]
      error(errors, src, "duplicate researcher name (also entry ##{seen_names[key]})")
    else
      seen_names[key] = i + 1
    end
  end
else
  puts "SKIP  #{people_path} not found"
end

# ── _data/collaborations.yml ──────────────────────────────────────────────
collab_path = File.join(ROOT, "_data/collaborations.yml")
if File.exist?(collab_path)
  collaborations = YAML.safe_load_file(collab_path, permitted_classes: [Date], aliases: true) || []
  seen_collabs = {}

  collaborations.each_with_index do |collab, i|
    src = "_data/collaborations.yml entry ##{i + 1} (#{collab['name'] || 'unnamed'})"

    %w[name topic seeking description contact].each do |key|
      error(errors, src, "missing required field `#{key}`") if collab[key].to_s.strip.empty?
    end

    contact = collab["contact"]
    if contact && !contact.to_s.strip.empty? && contact.to_s.strip !~ EMAIL_RE
      error(errors, src, "`contact` is not a valid email address: #{contact}")
    end

    webpage = collab["webpage"]
    if webpage && !webpage.to_s.strip.empty? && webpage.to_s.strip !~ URL_RE
      error(errors, src, "`webpage` is not a valid http(s) URL: #{webpage}")
    end

    next if collab["name"].to_s.strip.empty? || collab["topic"].to_s.strip.empty?

    key = "#{normalize(collab['name'])}::#{normalize(collab['topic'])}"
    if seen_collabs[key]
      error(errors, src, "duplicate collaboration post (same name + topic as entry ##{seen_collabs[key]})")
    else
      seen_collabs[key] = i + 1
    end
  end
else
  puts "SKIP  #{collab_path} not found"
end

# ── _positions/*.md ────────────────────────────────────────────────────────
positions_dir = File.join(ROOT, "_positions")
if Dir.exist?(positions_dir)
  seen_positions = {}

  Dir.glob(File.join(positions_dir, "*.md")).sort.each do |path|
    rel = path.sub("#{ROOT}/", "")
    raw = File.read(path)

    unless raw.start_with?("---")
      error(errors, rel, "missing YAML front matter")
      next
    end

    parts = raw.split(/^---\s*$/, 3)
    if parts.length < 3
      error(errors, rel, "malformed front matter (no closing `---`)")
      next
    end

    front = YAML.safe_load(parts[1], permitted_classes: [Date], aliases: true) || {}

    %w[title organization link].each do |key|
      error(errors, rel, "missing required field `#{key}`") if front[key].to_s.strip.empty?
    end

    link = front["link"]
    if link && !link.to_s.strip.empty? && link.to_s.strip !~ URL_RE
      error(errors, rel, "`link` is not a valid http(s) URL: #{link}")
    end

    deadline = front["deadline"]
    if deadline && !(deadline.is_a?(Date) || deadline.to_s.strip =~ /\A\d{4}-\d{2}-\d{2}\z/)
      error(errors, rel, "`deadline` must be an ISO date (YYYY-MM-DD): #{deadline}")
    end

    next if front["title"].to_s.strip.empty? || front["organization"].to_s.strip.empty?

    key = "#{normalize(front['title'])}::#{normalize(front['organization'])}"
    if seen_positions[key]
      error(errors, rel, "duplicate position (same title + organization as #{seen_positions[key]})")
    else
      seen_positions[key] = rel
    end
  end
else
  puts "SKIP  #{positions_dir}/ not found"
end

# ── Summary ────────────────────────────────────────────────────────────────
if errors.empty?
  puts "✅ All submission data passed validation."
  exit 0
else
  puts "\n❌ #{errors.size} validation error(s) found:"
  errors.each { |e| puts "  - #{e}" }
  exit 1
end
