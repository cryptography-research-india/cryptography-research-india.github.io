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
              <span class="reveal_detail"><i class="fa fa-angle-double-down"></i></span>
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


<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
<script>
$(document).ready(function(){
$('.reveal_detail').click(function() {
    var parentDiv = $(this).closest('.row');
    var thisDetailDiv = parentDiv.find('#person_details');
    if(thisDetailDiv.is(":visible"))
        thisDetailDiv.hide();
    else
        thisDetailDiv.show();        
  });
});
</script>