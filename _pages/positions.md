---
layout: default
title: Positions
permalink: /positions/
---

<div class="page-hero">
  <div class="page-hero-overlay"></div>
  <div class="container">
    <h1 class="page-hero-title">Open Positions</h1>
    <p class="page-hero-subtitle">Cryptography research positions in India and at Indian-origin institutions worldwide.</p>
    <a href="https://github.com/cryptography-research-india/cryptography-research-india.github.io/issues/new?template=add-position.yml"
       class="btn btn-primary" target="_blank" rel="noopener" style="margin-top:1.25rem;">
      📢 Post a Position
    </a>
  </div>
</div>

<section class="page-content-section">
  <div class="container">

    <div class="positions-cta glass">
      <h2>Post an Opening</h2>
      <p>Are you hiring cryptography researchers? Share your position with the community by submitting it via a GitHub issue. We will add it to this page promptly.</p>
      <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;">
        <a href="https://github.com/cryptography-research-india/cryptography-research-india.github.io/issues/new?template=add-position.yml"
           target="_blank" rel="noopener" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Submit a Position
        </a>
        <a href="mailto:cryptography.research.india@gmail.com?subject=Position Opening Submission" class="btn btn-ghost">Email Us Instead</a>
      </div>
    </div>

    {% assign today_ts = 'now' | date: '%s' %}
    {% assign open_dated = "" | split: "," %}
    {% assign open_undated = "" | split: "," %}
    {% assign closed_positions = "" | split: "," %}

    {% for pos in site.positions %}
      {% if pos.deadline %}
        {% assign deadline_ts = pos.deadline | date: '%s' %}
        {% if deadline_ts >= today_ts %}
          {% assign open_dated = open_dated | push: pos %}
        {% else %}
          {% assign closed_positions = closed_positions | push: pos %}
        {% endif %}
      {% else %}
        {% assign open_undated = open_undated | push: pos %}
      {% endif %}
    {% endfor %}

    {% assign open_dated = open_dated | sort: "deadline" %}
    {% assign closed_positions = closed_positions | sort: "deadline" | reverse %}
    {% assign open_positions = open_dated | concat: open_undated %}

    {% if open_positions.size > 0 %}
    <div class="position-grid">
      {% for pos in open_positions %}
        {% include position-card.html position=pos closed=false %}
      {% endfor %}
    </div>
    {% else %}
    <div class="glass" style="border-radius:var(--radius-lg);padding:2.5rem;text-align:center;">
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" style="opacity:0.35;margin:0 auto 1rem;display:block;color:var(--text-muted)">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
      <h3 style="font-size:1.15rem;margin-bottom:0.5rem;">No open positions listed yet</h3>
      <p style="font-size:0.9rem;max-width:400px;margin:0 auto;">
        Check back soon, or subscribe to our community channels to be notified of new openings.
        You can also submit a position using the button above.
      </p>
    </div>
    {% endif %}

    {% if closed_positions.size > 0 %}
    <details class="positions-closed-details">
      <summary>{{ closed_positions.size }} closed position{% if closed_positions.size != 1 %}s{% endif %} &mdash; past deadline</summary>
      <div class="position-grid position-grid-closed">
        {% for pos in closed_positions %}
          {% include position-card.html position=pos closed=true %}
        {% endfor %}
      </div>
    </details>
    {% endif %}

    <div class="prose" style="margin-top:3rem;">
      <h2>What kind of positions are listed here?</h2>
      <p>We list openings relevant to cryptography research, including:</p>
      <ul>
        <li>PhD studentships and postdoctoral positions at Indian institutions</li>
        <li>Research scientist and engineer roles at industry labs (Microsoft Research India, IBM Research India, TII, Supra Research, etc.)</li>
        <li>Faculty positions in cryptography or security at Indian universities</li>
        <li>Internship opportunities for students interested in cryptography</li>
        <li>Positions at global institutions that are particularly welcoming of Indian researchers</li>
      </ul>

      <h2>How to submit</h2>
      <p>Click the "Submit a Position" button above to open a pre-filled GitHub issue. Include the following details:</p>
      <ul>
        <li><strong>Position title</strong> (e.g., Postdoc in MPC, PhD in ZK Proofs)</li>
        <li><strong>Institution / Company</strong></li>
        <li><strong>Position type</strong> (PhD, Postdoc, Faculty, Research Scientist, Internship, or Other)</li>
        <li><strong>Location</strong></li>
        <li><strong>Application deadline</strong></li>
        <li><strong>Application / details URL</strong></li>
        <li><strong>Brief description</strong> of the position and requirements</li>
        <li><strong>Contact email</strong> (optional)</li>
      </ul>
    </div>

  </div>
</section>
