---
permalink: /_resources/people/people-academia/
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