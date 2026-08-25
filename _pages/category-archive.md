---
layout: default
title: "Posts by Category"
permalink: /categories/
---

<div class="page-hero">
  <div class="page-hero-overlay"></div>
  <div class="container">
    <h1 class="page-hero-title">Posts by Category</h1>
    <p class="page-hero-subtitle">Browse CRIYPT community posts grouped by category.</p>
  </div>
</div>

<section class="page-content-section">
  <div class="container">

    {% if site.categories.size > 0 %}
    <div class="topic-pills">
      <span class="filter-label">Jump to:</span>
      {% for category in site.categories %}
        <a href="#{{ category[0] | slugify }}" class="filter-btn topic-pill">{{ category[0] | escape }} <span class="tag tag-sm">{{ category[1].size }}</span></a>
      {% endfor %}
    </div>

    {% for category in site.categories %}
      {% assign posts_sorted = category[1] | sort: "date" | reverse %}
      <div class="archive-group" id="{{ category[0] | slugify }}">
        <div class="section-header archive-group-header">
          <h2 class="section-title archive-group-title">{{ category[0] | escape }}</h2>
        </div>
        <div class="posts-grid posts-grid-full">
          {% for post in posts_sorted %}
            {% include post-card.html post=post %}
          {% endfor %}
        </div>
      </div>
    {% endfor %}
    {% else %}
    <div class="empty-state glass">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      <h3>No categories yet</h3>
      <p>Check back once the community starts publishing posts.</p>
    </div>
    {% endif %}

  </div>
</section>
