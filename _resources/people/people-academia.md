---
permalink: /people-academia/
title: "People Academia"
---

In this space, you can find a list of some of the top cryptography researchers in India, with a focus on those working in academia and industry. We are constantly updating this list, so please let us know if we have missed any notable cryptographers.

Let's meet some of the leading minds in the field of cryptography in India:

<div class="row">
      <div class="col-xs-12">
        <!-- <div class="well"> -->
          <form class="form-inline">
            <div class="form-group">
              <!--<span class="mytitle">Category: </span> -->
              {% for type in site.data.types-people %}
              <div class="checkbox">
                <label>
                  <input type="checkbox" id="{{ type.tag }}-checkbox" class=""> {{ type.name }}
                </label>
              </div>
              {% endfor %}
            </div>
          </form>
        <!-- </div> -->
      </div>
</div>

<div class="people-container">
    {% for people in site.data.names-people %}
    {% assign person_id = names-people.name %}
    <div id="{{ person_id }}" class="people {% for tag in names-people.tags %} {{tag}} {% endfor %}">
      <div class="row">
          {{ people.name }}<br>
          {{ people.designation }}<br>
          {{ people.affiliation }}<br>
          <a class="people-webpage" href="{{people.webpage}}" target="_blank">Webpage</a><br>
          {% if conf.rank %}
          <a class="people-webpagelab" href="{{people.webpagelab}}" target="_blank">Research Lab</a><br>
          {% endif %}
          {{ people.research }}<br>
      </div>
      <hr>
    </div>
    {% endfor %}
</div>

<script src="{{ site.baseurl}}/assets/js/main.js" async></script>
<script src="{{ site.baseurl}}/assets/js/store.min.js" async></script>