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
    <a href="https://github.com/cryptography-research-india/cryptography-research-india.github.io/issues/new?template=add-researcher.yml"
       class="btn btn-primary" target="_blank" rel="noopener" style="margin-top:1.25rem;">
      ➕ Add Yourself
    </a>
  </div>
</div>

<section class="page-content-section">
  <div class="container">

    <p style="color:var(--text-muted);margin-bottom:1.5rem;font-size:0.9rem;">
      This list is continuously updated. If we have missed someone, please
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

    <!-- People Grid -->
    <div class="people-grid" id="people-grid">
      {% for person in site.data.names-people %}
        {% include person-card.html person=person %}
      {% endfor %}
    </div>

  </div>
</section>
