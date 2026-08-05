# frozen_string_literal: true

require "base64"

module Jekyll
  module PersonFilters
    # Drops a key from a hash before it's serialized into page HTML — used to
    # keep `email` out of the `data-person` JSON blob that person-card.html
    # embeds on every page load. Every other field on a person (webpage,
    # scholar, dblp, ...) is already public elsewhere by the researcher's own
    # choice to list it; email is the one field worth not shipping in plain,
    # always-present, unauthenticated HTML.
    def without_key(hash, key)
      return hash unless hash.is_a?(Hash)
      hash.reject { |k, _| k.to_s == key.to_s }
    end

    # Base64-encodes a string so it never appears in shipped HTML in a shape
    # a naive `\S+@\S+` regex harvester would recognize as an email. This is
    # a speed bump against dumb scrapers, not real security — anything that
    # executes JS can still decode it client-side (see assets/js/main.js,
    # which only does so at the moment a person's modal is opened).
    def obfuscate_email(input)
      return "" if input.nil? || input.to_s.strip.empty?

      Base64.strict_encode64(input.to_s.strip)
    end
  end
end

Liquid::Template.register_filter(Jekyll::PersonFilters)
