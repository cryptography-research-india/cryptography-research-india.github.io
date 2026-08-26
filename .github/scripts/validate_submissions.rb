#!/usr/bin/env ruby
# frozen_string_literal: true

# Validates the data files that the community-submission automation
# (.github/workflows/process-submissions.yml) writes to, so a malformed or
# incomplete auto-generated PR fails CI instead of silently merging broken
# data (e.g. a missing required field, a bad URL, or a duplicate entry).
#
# Checks, per source:
#   _data/names-people.yml   - required keys, tag/topic vocabulary, URL shape, dup names
#   _data/collaborations.yml - required keys, email shape, URL shape, dup (name+topic)
#   _data/grad-postdocs.yml  - required keys, position vocabulary, URL shape, dup names
#   _positions/*.md          - required front matter keys, URL shape, dup (title+org)
#   _posts/*.md               - required front matter keys, dup (title+date), suspicious content
#   _data/recent_papers.yml  - required keys, URL shape, suspicious content (third-party feed content)
#   resource lists            - URL shape, unescaped angle brackets, suspicious content
#
# Exits non-zero (and prints "::error::" annotations) if any check fails.

require "yaml"
require "date"

ROOT = File.expand_path("../..", __dir__)
errors = []

URL_RE = %r{\Ahttps?://[^\s]+\z}
EMAIL_RE = /\A[^@\s]+@[^@\s]+\.[^@\s]+\z/
ORCID_RE = /\A\d{4}-\d{4}-\d{4}-\d{3}[\dX]\z/
VALID_SECTOR_TAGS = %w[ACADEMIA INDUSTRY].freeze
VALID_LOCATION_TAGS = %w[WORKING_IN_INDIA WORKING_ABROAD].freeze
# Best-effort regex check (not a full HTML parser) for content that ends up
# rendered as raw HTML somewhere on the site — catches the common cases
# (script tag, javascript: URI, inline event handler) rather than
# guaranteeing every possible injection is caught.
SUSPICIOUS_RE = /<script|javascript:|data:text\/html|on\w+\s*=/i

topics_path = File.join(ROOT, "_data/topics.yml")
VALID_TOPIC_CODES = if File.exist?(topics_path)
                      (YAML.safe_load_file(topics_path) || []).map { |t| t["code"] }
                    else
                      []
                    end.freeze

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

    %w[webpage webpagelab scholar dblp linkedin].each do |key|
      value = person[key]
      if value && !value.to_s.strip.empty? && value.to_s.strip !~ URL_RE
        error(errors, src, "`#{key}` is not a valid http(s) URL: #{value}")
      end
    end

    # `photo` is either a full http(s) URL (submitted via Edit My Profile) or
    # a site-relative path like /assets/images/people/x.jpg (written by the
    # fetch-researcher-photos.yml bot) — accept either shape.
    photo = person["photo"]
    if photo && !photo.to_s.strip.empty? && photo.to_s.strip !~ URL_RE && !photo.to_s.strip.start_with?("/")
      error(errors, src, "`photo` must be an http(s) URL or a site-relative path starting with /: #{photo}")
    end

    email = person["email"]
    if email && !email.to_s.strip.empty? && email.to_s.strip !~ EMAIL_RE
      error(errors, src, "`email` is not a valid email address: #{email}")
    end

    orcid = person["orcid"]
    if orcid && !orcid.to_s.strip.empty? && orcid.to_s.strip !~ ORCID_RE
      error(errors, src, "`orcid` is not a valid ORCID iD (expected 0000-0000-0000-000X): #{orcid}")
    end

    topics = person["topics"]
    if topics
      unless topics.is_a?(Array)
        error(errors, src, "`topics` must be a list")
      else
        unknown = topics - VALID_TOPIC_CODES
        if unknown.any?
          error(errors, src, "`topics` has unknown code(s) #{unknown.join(', ')} — must be one of #{VALID_TOPIC_CODES.join(', ')}")
        end
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

# ── _data/grad-postdocs.yml ───────────────────────────────────────────────
VALID_POSITIONS = ["PhD Student", "PreDoc", "Postdoc"].freeze
grad_path = File.join(ROOT, "_data/grad-postdocs.yml")
if File.exist?(grad_path)
  grad_postdocs = YAML.safe_load_file(grad_path, permitted_classes: [Date], aliases: true) || []
  seen_grad = {}

  grad_postdocs.each_with_index do |entry, i|
    src = "_data/grad-postdocs.yml entry ##{i + 1} (#{entry['name'] || 'unnamed'})"

    %w[name institution position research].each do |key|
      error(errors, src, "missing required field `#{key}`") if entry[key].to_s.strip.empty?
    end

    position = entry["position"]
    if position && !VALID_POSITIONS.include?(position.to_s.strip)
      error(errors, src, "`position` must be one of #{VALID_POSITIONS.join(' / ')}: #{position}")
    end

    link = entry["link"]
    if link && !link.to_s.strip.empty? && link.to_s.strip !~ URL_RE
      error(errors, src, "`link` is not a valid http(s) URL: #{link}")
    end

    next if entry["name"].to_s.strip.empty?

    key = normalize(entry["name"])
    if seen_grad[key]
      error(errors, src, "duplicate entry (also entry ##{seen_grad[key]})")
    else
      seen_grad[key] = i + 1
    end
  end
else
  puts "SKIP  #{grad_path} not found"
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

# ── _posts/*.md ─────────────────────────────────────────────────────────────
posts_dir = File.join(ROOT, "_posts")
if Dir.exist?(posts_dir)
  seen_posts = {}

  Dir.glob(File.join(posts_dir, "*.md")).sort.each do |path|
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

    # Post `date:` values are typically full timestamps (e.g.
    # `2025-01-01T00:00:00-04:00`), which YAML parses as `Time`, not
    # `Date` — unlike every other date field in this file.
    front = YAML.safe_load(parts[1], permitted_classes: [Date, Time], aliases: true) || {}
    body = parts[2]

    # `author` is deliberately optional here — post.html only shows a
    # byline `{% if page.author %}`, and the site's own maintainer-written
    # posts (predating the Submit Blog Post automation) have none.
    %w[title date].each do |key|
      error(errors, rel, "missing required field `#{key}`") if front[key].to_s.strip.empty?
    end

    if front["title"].to_s =~ SUSPICIOUS_RE || front["author"].to_s =~ SUSPICIOUS_RE
      error(errors, rel, "front matter contains a suspicious pattern (script tag, javascript: URI, or inline event handler) — review carefully before merging")
    end

    if body =~ SUSPICIOUS_RE
      error(errors, rel, "post body contains a suspicious pattern (script tag, javascript: URI, or inline event handler) — review carefully before merging")
    end

    date = front["date"]
    next if front["title"].to_s.strip.empty? || date.to_s.strip.empty?

    key = "#{normalize(front['title'])}::#{date}"
    if seen_posts[key]
      error(errors, rel, "duplicate post (same title + date as #{seen_posts[key]})")
    else
      seen_posts[key] = rel
    end
  end
else
  puts "SKIP  #{posts_dir}/ not found"
end

# ── _data/recent_papers.yml ─────────────────────────────────────────────────
# Written entirely by an unattended weekly fetch from the public IACR
# ePrint RSS feed (fetch_recent_papers.py) and rendered on the homepage —
# title/url/author names are third-party content nobody at CRIYPT chose,
# so this gets the same suspicious-content scan as the resource lists
# rather than being trusted just because it's machine-generated.
papers_path = File.join(ROOT, "_data/recent_papers.yml")
if File.exist?(papers_path)
  papers = YAML.safe_load_file(papers_path, permitted_classes: [Date], aliases: true) || []

  papers.each_with_index do |paper, i|
    src = "_data/recent_papers.yml entry ##{i + 1} (#{paper['title'] || 'untitled'})"

    %w[title url].each do |key|
      error(errors, src, "missing required field `#{key}`") if paper[key].to_s.strip.empty?
    end

    url = paper["url"]
    if url && !url.to_s.strip.empty? && url.to_s.strip !~ URL_RE
      error(errors, src, "`url` is not a valid http(s) URL: #{url}")
    end

    if paper["title"].to_s =~ SUSPICIOUS_RE
      error(errors, src, "title contains a suspicious pattern (script tag, javascript: URI, or inline event handler): #{paper['title'].inspect}")
    end

    (paper["authors"] || []).each do |author|
      name = author.is_a?(Hash) ? author["name"] : nil
      if name.to_s =~ SUSPICIOUS_RE
        error(errors, src, "author name contains a suspicious pattern: #{name.inspect}")
      end
    end
  end
else
  puts "SKIP  #{papers_path} not found"
end

# ── Resource lists (_pages/resources.md, _resources/topics/*.md) ──────────
# These files are rendered as raw HTML by Jekyll (the Add Resource
# automation writes plain <li><a href="...">...</a></li> markup directly),
# so a malformed/malicious entry here is a stored-XSS risk, not just bad
# data.
resource_files = ([File.join(ROOT, "_pages/resources.md")] + Dir.glob(File.join(ROOT, "_resources/topics/*.md"))).select { |p| File.exist?(p) }

resource_files.each do |path|
  rel = path.sub("#{ROOT}/", "")
  content = File.read(path)

  content.scan(/<li><a href="([^"]*)"[^>]*>(.*?)<\/a><\/li>/) do |href, title|
    if href.to_s.strip !~ URL_RE
      error(errors, rel, "resource link is not a valid http(s) URL: #{href.inspect}")
    end
    if title =~ /[<>]/
      error(errors, rel, "resource title contains unescaped `<`/`>` — possible injection: #{title.inspect}")
    end
  end

  if content =~ SUSPICIOUS_RE
    error(errors, rel, "file contains a suspicious pattern (script tag, javascript: URI, or inline event handler) — review carefully before merging")
  end
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
