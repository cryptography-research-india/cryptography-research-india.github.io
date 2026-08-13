---
layout: default
title: Labs
permalink: /labs/
---

<div class="page-hero">
  <div class="page-hero-overlay"></div>
  <div class="container">
    <h1 class="page-hero-title">Research Labs</h1>
    <p class="page-hero-subtitle">Labs and groups our listed researchers are part of, grouped straight from their own profiles.</p>
  </div>
</div>

<section class="page-content-section">
  <div class="container">

    {% assign labbed_people = site.data.names-people | where_exp: "p", "p.lab" %}
    {% assign lab_groups = labbed_people | group_by: "lab" | sort: "name" %}

    {% if lab_groups.size > 0 %}
    <div class="labs-grid">
      {% for group in lab_groups %}
        {% assign members = group.items | sort: "name" %}
        {% assign first = members.first %}
        {% assign all_topics = "" | split: "," %}
        {% for m in members %}
          {% if m.topics %}{% assign all_topics = all_topics | concat: m.topics %}{% endif %}
        {% endfor %}
        {% assign unique_topics = all_topics | uniq %}

        <div class="lab-card glass">
          <div class="lab-card-header">
            <div class="lab-card-heading">
              {% if first.webpagelab %}
                <h3 class="lab-card-name"><a href="{{ first.webpagelab }}" target="_blank" rel="noopener">{{ group.name }}</a></h3>
              {% else %}
                <h3 class="lab-card-name">{{ group.name }}</h3>
              {% endif %}
              <p class="lab-card-inst">{{ first.affiliation }}</p>
            </div>
          </div>

          {% if unique_topics.size > 0 %}
          <div class="lab-card-topics">
            {% for code in unique_topics %}
              {% assign topic = site.data.topics | where: "code", code | first %}
              {% if topic %}<span class="tag tag-sm">{{ topic.label }}</span>{% endif %}
            {% endfor %}
          </div>
          {% endif %}

          <div class="lab-card-members">
            {% for person in members %}
              {% assign pslug = person.name | slugify %}
              <a href="{{ '/people/' | relative_url }}#{{ pslug }}"
                class="lab-member-row person-card"
                data-slug="{{ pslug }}"
                data-person="{{ person | without_key: 'email' | with_relative_photo: site.baseurl | jsonify | escape }}">
                <div class="lab-member-avatar">
                  {% if person.photo %}
                    <img src="{{ person.photo | relative_url }}" alt="{{ person.name }}" class="avatar-photo">
                  {% else %}
                    <span class="avatar-initials">{{ person.name | initials }}</span>
                  {% endif %}
                </div>
                <span class="lab-member-info">
                  <span class="lab-member-name">{{ person.name }}</span>
                  <span class="lab-member-role">{{ person.designation }}</span>
                </span>
              </a>
            {% endfor %}
          </div>
        </div>
      {% endfor %}
    </div>
    {% else %}
    <div class="glass" style="border-radius:var(--radius-lg);padding:2.5rem;text-align:center;">
      <h3 style="font-size:1.15rem;margin-bottom:0.5rem;">No labs listed yet</h3>
      <p style="font-size:0.9rem;max-width:420px;margin:0 auto;">
        Labs show up here automatically once a researcher's profile names one &mdash; add or edit yours from the
        <a href="{{ '/people/' | relative_url }}">People</a> page.
      </p>
    </div>
    {% endif %}

    <div class="prose" style="margin-top:3rem;">
      <h2>How this page works</h2>
      <p>
        This isn't a separate directory &mdash; every card here is generated directly from the Lab / Group Name
        field on individual researcher profiles. Add or update your lab from the People page's
        &ldquo;Add Yourself&rdquo; or &ldquo;Edit My Profile&rdquo; flow, and it'll show up here the next time the
        site rebuilds, grouped with anyone else from the same lab.
      </p>
    </div>

  </div>
</section>

{% include person-modal.html %}
