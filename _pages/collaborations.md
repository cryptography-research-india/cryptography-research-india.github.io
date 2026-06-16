---
layout: default
title: Collaborations
permalink: /collaborations/
---

<div class="page-hero collab-hero">
  <div class="page-hero-overlay"></div>
  <div class="container">
    <div class="collab-hero-badge">
      <span class="hero-badge-dot"></span>
      <span>Open to the community</span>
    </div>
    <h1 class="page-hero-title">Find Your Next Collaborator</h1>
    <p class="page-hero-subtitle collab-hero-sub">
      Great cryptography is rarely built alone. This space is where researchers share what they're
      working on, signal what kind of collaboration they're looking for, and spark connections that
      lead to real breakthroughs — across institutions, across borders, across disciplines.
    </p>
    <div class="collab-hero-actions">
      <a href="https://github.com/cryptography-research-india/cryptography-research-india.github.io/issues/new?template=collaboration-request.yml"
         class="btn btn-primary" target="_blank" rel="noopener">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        Post a Collaboration
      </a>
      <a href="#how-it-works" class="btn btn-ghost">How it works</a>
    </div>
  </div>
</div>

<section class="page-content-section">
  <div class="container">

    <!-- Welcome message -->
    <div class="collab-welcome glass">
      <div class="collab-welcome-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <div class="collab-welcome-body">
        <h2>Where ideas meet collaborators</h2>
        <p>
          Whether you're looking for a co-author to strengthen a proof, an implementation partner to
          bring a protocol to life, a student eager to contribute, or an industry connection to ground
          theory in practice — post here and let the community find you. No formality, no gatekeeping.
          Just researchers helping each other do better science.
        </p>
        <div class="collab-welcome-stats">
          {% assign collab_count = site.data.collaborations | size %}
          <div class="collab-stat">
            <span class="collab-stat-num">{{ collab_count }}</span>
            <span class="collab-stat-label">Active posts</span>
          </div>
          <div class="collab-stat-divider"></div>
          <div class="collab-stat">
            <span class="collab-stat-num">∞</span>
            <span class="collab-stat-label">Possibilities</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Collaboration cards -->
    {% if site.data.collaborations.size > 0 %}
    <div class="collab-grid" id="collab-grid">
      {% for collab in site.data.collaborations %}
      <div class="collab-card glass">
        <div class="collab-card-header">
          <div class="collab-card-meta">
            <span class="collab-card-name">{{ collab.name }}</span>
            {% if collab.affiliation %}
            <span class="collab-card-affil">{{ collab.affiliation }}</span>
            {% endif %}
          </div>
          <span class="collab-card-date">{{ collab.date | date: "%b %Y" }}</span>
        </div>

        <h3 class="collab-card-topic">{{ collab.topic }}</h3>
        <p class="collab-card-desc">{{ collab.description }}</p>

        <div class="collab-card-areas">
          {% for area in collab.areas %}
          <span class="collab-area-tag">{{ area }}</span>
          {% endfor %}
        </div>

        <div class="collab-card-footer">
          <div class="collab-seeking">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>Seeking: <strong>{{ collab.seeking }}</strong></span>
          </div>
          <div class="collab-card-actions">
            {% if collab.webpage %}
            <a href="{{ collab.webpage }}" class="btn btn-sm btn-ghost" target="_blank" rel="noopener">Profile</a>
            {% endif %}
            <a href="mailto:{{ collab.contact }}" class="btn btn-sm btn-primary">Get in touch</a>
          </div>
        </div>
      </div>
      {% endfor %}
    </div>
    {% else %}
    <div class="collab-empty glass">
      <div class="collab-empty-icon">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="opacity:0.3;">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <h3>Be the first to post</h3>
      <p>
        No collaboration posts yet — but every thriving community starts somewhere.
        Share what you're working on and invite others to join the journey.
      </p>
      <a href="https://github.com/cryptography-research-india/cryptography-research-india.github.io/issues/new?template=collaboration-request.yml"
         class="btn btn-primary" target="_blank" rel="noopener" style="margin-top:1rem;">
        Post the first collaboration
      </a>
    </div>
    {% endif %}

    <!-- How it works -->
    <div class="collab-howto" id="how-it-works">
      <div class="section-header" style="margin-bottom:2rem;">
        <div class="section-label">Process</div>
        <h2 class="section-title" style="font-size:1.75rem;">How it works</h2>
      </div>
      <div class="collab-steps">
        <div class="collab-step glass">
          <div class="collab-step-num">01</div>
          <div class="collab-step-body">
            <h4>Post your idea</h4>
            <p>Open a GitHub issue using the Collaboration Request template. Describe what you're working on, what you need, and how to reach you. Takes two minutes.</p>
          </div>
        </div>
        <div class="collab-step-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </div>
        <div class="collab-step glass">
          <div class="collab-step-num">02</div>
          <div class="collab-step-body">
            <h4>We review &amp; publish</h4>
            <p>A maintainer reviews your post for relevance and accuracy, then merges it. Your collaboration post goes live within a day or two.</p>
          </div>
        </div>
        <div class="collab-step-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </div>
        <div class="collab-step glass">
          <div class="collab-step-num">03</div>
          <div class="collab-step-body">
            <h4>Connect &amp; collaborate</h4>
            <p>Interested researchers reach out to you directly. You take it from there — co-author, co-build, co-advise, or simply exchange ideas.</p>
          </div>
        </div>
      </div>
      <div style="text-align:center;margin-top:2.5rem;">
        <a href="https://github.com/cryptography-research-india/cryptography-research-india.github.io/issues/new?template=collaboration-request.yml"
           class="btn btn-primary" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Post a Collaboration Request
        </a>
      </div>
    </div>

    <!-- What to post -->
    <div class="prose collab-prose">
      <h2>What can you post here?</h2>
      <p>Any research collaboration that touches cryptography, security, or privacy is welcome. Some examples:</p>
      <ul>
        <li><strong>Active research looking for co-authors</strong> — you have a paper in progress and want a collaborator with complementary expertise</li>
        <li><strong>Implementation projects</strong> — you have a protocol and need someone to build or benchmark it</li>
        <li><strong>Seeking students or interns</strong> — you have a research direction and want to find motivated students</li>
        <li><strong>Looking for industry partners</strong> — you have theoretical results and want to explore applied deployment</li>
        <li><strong>Open problems</strong> — you have a problem you're stuck on and want to think about it together with others</li>
        <li><strong>Reading groups or study circles</strong> — you want to form a group around a specific topic or paper series</li>
      </ul>
      <p>If in doubt — post it. The worst outcome is a productive conversation.</p>
    </div>

  </div>
</section>
