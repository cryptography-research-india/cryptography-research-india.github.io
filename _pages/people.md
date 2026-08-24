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
    </div>
    <p style="color:var(--text-muted);font-size:0.85rem;margin-top:1rem;max-width:560px;margin-left:auto;margin-right:auto;">
      This directory focuses on faculty and industry researchers actively leading work in the field. If you're a graduate student, pre-doc, or postdoc, you're listed separately on
      <a href="{{ '/emerging-researchers/' | relative_url }}" style="color:var(--cyan)">Emerging Researchers</a> — or check out
      <a href="{{ '/collaborations/' | relative_url }}" style="color:var(--cyan)">Collaborations</a> to connect with people working in your area, or
      <a href="{{ '/positions/' | relative_url }}" style="color:var(--cyan)">Positions</a> if you're looking for one. Prefer to browse by group instead?
      <a href="{{ '/labs/' | relative_url }}" style="color:var(--cyan)">See researchers by Lab</a>.
    </p>
  </div>
</div>

<section class="page-content-section">
  <div class="container">

    <p style="color:var(--text-muted);margin-bottom:1.5rem;font-size:0.9rem;">
      This list is continuously updated. Missing yourself? Use the ➕ Add Yourself button above — it only takes a minute. Spotted an error? Use the ⚙️ Edit button on the person's card. Missing a colleague? Please
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
    {% assign sorted_people = site.data.names-people | sort: "name" %}
    <div class="people-grid" id="people-grid">
      {% for person in sorted_people %}
        {% include person-card.html person=person %}
      {% endfor %}
    </div>

  </div>
</section>

{% include person-modal.html %}
