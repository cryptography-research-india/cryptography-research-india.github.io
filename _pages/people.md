---
permalink: /people/
title: "People"
---

In this space, you can find a list of some of the leading minds in the field of cryptography in India. 

(We are constantly updating this list, so please let us know if we have missed any notable cryptographers.)

<div class="people-container">
    {% for people in site.data.names-people %}
    {% assign person_id = names-people.name %}
    <div id="{{ person_id }}" class="people {% for tag in names-people.tags %} {{tag}} {% endfor %}">
      <div class="row">
          <div class="person_name">
              {{ people.name }}
              <button class="dropbtn" onclick="showDetails()" for="#updown_up">
                  <i class="arrow updown" id="updown_up"></i>
              </button>
          </div>
          <div id="person_details">
              <div class="person_designation">{{ people.designation }}</div>
              <div class="person_affiliation">{{ people.affiliation }}</div>
              <div class="person_research">
                  <span class="person_areas">Area(s):</span> {{ people.research }}
              </div>
              <div class="person_webpage">
                  <a class="people-webpage" href="{{people.webpage}}" target="_blank">[Webpage]</a>
                  {% if people.webpagelab %}
                  <a class="people-webpagelab" href="{{people.webpagelab}}" target="_blank">[Lab]</a>
                  {% endif %}
              </div>
          </div>
      </div>
      <hr>
    </div>
    {% endfor %}
</div>


<script>
function showDetails() {
  var x = document.getElementById("person_details");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
</script>