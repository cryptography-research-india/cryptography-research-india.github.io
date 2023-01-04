---
permalink: /people/
title: "People"
---

In this space, you can find a list of some of the top cryptography researchers in India, with a focus on those working in academia and industry. We are constantly updating this list, so please let us know if we have missed any notable cryptographers.

Let's meet some of the leading minds in the field of cryptography in India:

<div class="people-container">
    {% for people in site.data.names-people %}
    {% assign person_id = names-people.name %}
    <div id="{{ person_id }}" class="people {% for tag in names-people.tags %} {{tag}} {% endfor %}">
      <div class="row">
          <div class="person_name">{{ people.name }}</div>
          <div class="person_designation">{{ people.designation }}</div>
          <div class="person_affiliation">{{ people.affiliation }}</div>
          <div class="person_webpage">
              <a class="people-webpage" href="{{people.webpage}}" target="_blank">[Webpage]</a>
              {% if conf.rank %}
              <a class="people-webpagelab" href="{{people.webpagelab}}" target="_blank">[Lab]</a>
              {% endif %}
          </div>
          <div class="person_research">Research Interests:{{ people.research }}</div>
      </div>
      <hr>
    </div>
    {% endfor %}
</div>