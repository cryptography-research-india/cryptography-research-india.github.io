---
layout: default
title: Emerging Researchers
permalink: /emerging-researchers/
---

<div class="page-hero">
  <div class="page-hero-overlay"></div>
  <div class="container">
    <h1 class="page-hero-title">Emerging Researchers</h1>
    <p class="page-hero-subtitle">Graduate students, pre-docs, and postdocs working in cryptography across India.</p>
    <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;margin-top:1.25rem;">
      <a href="https://github.com/cryptography-research-india/cryptography-research-india.github.io/issues/new?template=add-grad-postdoc.yml"
         class="btn btn-primary" target="_blank" rel="noopener">
        ➕ Add Yourself
      </a>
    </div>
    <p style="color:var(--text-muted);font-size:0.85rem;margin-top:1rem;max-width:560px;margin-left:auto;margin-right:auto;">
      Kept intentionally compact since this list can grow large. Looking for faculty and industry researchers instead? See <a href="{{ '/people/' | relative_url }}" style="color:var(--cyan)">People</a>.
    </p>
  </div>
</div>

<section class="page-content-section">
  <div class="container">

    {% assign entries = site.data.grad-postdocs %}
    {% if entries.size > 0 %}
      {% assign entries = entries | sort: "name" %}
    {% endif %}

    <div class="people-filters">
      <span class="filter-label">Filter:</span>
      <div class="filter-group">
        <button class="emerging-filter-btn active" data-filter="ALL">All</button>
        <button class="emerging-filter-btn" data-filter="PhD Student">PhD Student</button>
        <button class="emerging-filter-btn" data-filter="PreDoc">PreDoc</button>
        <button class="emerging-filter-btn" data-filter="Postdoc">Postdoc</button>
      </div>
      <input type="search" id="emerging-search" placeholder="Search by name, institution, or area..." autocomplete="off">
      <span class="people-count" id="emerging-count"></span>
    </div>

    {% if entries.size > 0 %}
    <div class="emerging-table-wrap glass">
      <table class="emerging-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Institution</th>
            <th>Position</th>
            <th>Advisor</th>
            <th>Research Area</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {% for entry in entries %}
          <tr class="emerging-row"
              data-position="{{ entry.position }}"
              data-name="{{ entry.name | downcase }}"
              data-institution="{{ entry.institution | downcase }}"
              data-research="{{ entry.research | downcase }}">
            <td>{{ entry.name }}</td>
            <td>{{ entry.institution }}</td>
            <td><span class="tag tag-sm">{{ entry.position }}</span></td>
            <td>{{ entry.advisor | default: "—" }}</td>
            <td>{{ entry.research }}</td>
            <td>
              {% if entry.link %}
              <a href="{{ entry.link }}" target="_blank" rel="noopener" class="emerging-link" aria-label="Link for {{ entry.name }}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
              {% endif %}
            </td>
          </tr>
          {% endfor %}
        </tbody>
      </table>
    </div>
    {% else %}
    <div class="glass" style="border-radius:var(--radius-lg);padding:2.5rem;text-align:center;">
      <h3 style="font-size:1.15rem;margin-bottom:0.5rem;">No entries yet</h3>
      <p style="font-size:0.9rem;max-width:420px;margin:0 auto;">
        Be the first to add yourself using the button above.
      </p>
    </div>
    {% endif %}

  </div>
</section>
