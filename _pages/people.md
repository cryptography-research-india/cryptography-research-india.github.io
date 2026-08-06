---
layout: default
title: Researchers
permalink: /people/
---

<div class="page-hero">
  <div class="page-hero-overlay"></div>
  <div class="container">
    <h1 class="page-hero-title">Researchers</h1>
    <p class="page-hero-subtitle">India's cryptography community — spanning academia, industry, and across the globe.</p>
    <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;margin-top:1.25rem;">
      <a href="https://github.com/cryptography-research-india/cryptography-research-india.github.io/issues/new?template=add-researcher.yml"
         class="btn btn-primary" target="_blank" rel="noopener">
        ➕ Add Yourself
      </a>
      <a href="https://github.com/cryptography-research-india/cryptography-research-india.github.io/issues/new?template=edit-researcher.yml"
         class="btn btn-ghost" target="_blank" rel="noopener">
        ✏️ Edit My Profile
      </a>
    </div>
    <p style="color:var(--text-muted);font-size:0.85rem;margin-top:1rem;max-width:560px;margin-left:auto;margin-right:auto;">
      This directory focuses on faculty and industry researchers actively leading work in the field. We don't yet track graduate students and postdocs individually given how many are doing excellent work across India — but if you're a student or postdoc, check out
      <a href="{{ '/collaborations/' | relative_url }}" style="color:var(--cyan)">Collaborations</a> to connect with people working in your area, or
      <a href="{{ '/positions/' | relative_url }}" style="color:var(--cyan)">Positions</a> if you're looking for one.
    </p>
  </div>
</div>

<section class="page-content-section">
  <div class="container">

    <p style="color:var(--text-muted);margin-bottom:1.5rem;font-size:0.9rem;">
      This list is continuously updated. Missing yourself? Use the ➕ Add Yourself button above — it only takes a minute. Spotted an error, or missing a colleague? Please
      <a href="https://github.com/cryptography-research-india/cryptography-research-india.github.io/pulls" target="_blank" style="color:var(--cyan)">submit a pull request</a>
      or email us at
      <a href="mailto:cryptography.research.india@gmail.com" style="color:var(--cyan)">cryptography.research.india@gmail.com</a>.
    </p>

    <!-- Filters -->
    <div class="people-filters">
      <span class="filter-label">Filter:</span>
      <div class="filter-group">
        <button class="filter-btn active" data-filter="ALL">All</button>
        <button class="filter-btn" data-filter="ACADEMIA">Academia</button>
        <button class="filter-btn" data-filter="INDUSTRY">Industry</button>
      </div>
      <div class="filter-group">
        <button class="filter-btn" data-filter="WORKING_IN_INDIA">In India</button>
        <button class="filter-btn" data-filter="WORKING_ABROAD">Abroad</button>
      </div>
      <input type="search" id="search-people" placeholder="Search by name or area..." autocomplete="off">
      <span class="people-count" id="people-count"></span>
    </div>

    {% if site.data.topics.size > 0 %}
    <details class="topic-filter-details">
      <summary>Filter by topic</summary>
      <div class="topic-filter-pills">
        {% for topic in site.data.topics %}
          <button class="filter-btn" data-filter="{{ topic.code }}">{{ topic.label }}</button>
        {% endfor %}
      </div>
    </details>
    {% endif %}

    <!-- People Grid -->
    <div class="people-grid" id="people-grid">
      {% for person in site.data.names-people %}
        {% include person-card.html person=person %}
      {% endfor %}
    </div>

  </div>
</section>

<!-- Researcher Detail Modal -->
<div class="modal-overlay" id="person-modal-overlay">
  <div class="person-modal glass-strong" role="dialog" aria-modal="true" aria-labelledby="person-modal-name">
    <button type="button" class="modal-close" id="person-modal-close" aria-label="Close">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="person-modal-header">
      <div class="person-avatar person-modal-avatar" id="person-modal-avatar"></div>
      <div class="person-meta">
        <h3 class="person-name" id="person-modal-name"></h3>
        <p class="person-designation" id="person-modal-designation"></p>
        <p class="person-affiliation" id="person-modal-affiliation"></p>
      </div>
    </div>
    <div class="person-tags-row" id="person-modal-tags"></div>
    <div class="person-research" id="person-modal-research"></div>
    <div class="person-card-footer person-modal-links" id="person-modal-footer"></div>
  </div>
</div>
