---
permalink: /people/
title: "People"
---

In this section, you'll find a list of cryptographers from India.

We are continuously updating this list, so if you believe we've missed any notable cryptographers, please feel free to contribute. 
You can either <a href="https://github.com/cryptography-research-india/cryptography-research-india.github.io/pulls" target=blank>submit a pull request</a> or email us at <a href="mailto:cryptography.research.india@gmail.com">cryptography.research.india@gmail.com</a>.

<div class="filter-container">
  <div class="filter-group">
    <strong>Affiliation:</strong>
    <label><input type="checkbox" id="academia-filter" checked> Academia</label>
    <label><input type="checkbox" id="industry-filter" checked> Industry</label>
  </div>
  <div class="filter-group">
    <strong>Location:</strong>
    <label><input type="checkbox" id="working-in-india-filter" checked> Working In India</label>  
    <label><input type="checkbox" id="working-abroad-filter" checked> Working Abroad</label>
  </div>
</div>

<div class="people-container">
    <div class="people-grid">
        {% for people in site.data.names-people %}
        {% assign person_id = people.name %}
        <div id="{{ person_id }}" class="people {% for tag in people.tags %} {{tag}} {% endfor %}">
            <div class="row">
                <div class="person_name" data-person-id="{{ person_id }}">
                    {{ people.name }}
                    <span class="reveal_detail"><i class="fa fa-angle-double-down"></i></span>
                </div>
                <div id="person_details_{{ person_id }}" class="person_details">
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
</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
<script>
$(document).ready(function(){
    // Shuffle the people list on page load
    shufflePeople();
    
    // Initially filter based on checked checkboxes
    filterPeople();

    // Handle change events for filter checkboxes
    $('#academia-filter, #industry-filter, #working-abroad-filter, #working-in-india-filter').change(function() {
        filterPeople();
    });

    // Function to shuffle the people list
    function shufflePeople() {
        var grid = $('.people-grid');
        var peopleItems = grid.children('.people').get();
        // Randomize the order of the people elements
        peopleItems.sort(function() { return 0.5 - Math.random(); });
        // Append the shuffled items back to the grid
        $.each(peopleItems, function(index, item) {
            grid.append(item);
        });
    }

    // Function to filter people based on the selected tags
    function filterPeople() {
        // Get the selected filters for both groups
        var showAcademia = $('#academia-filter').prop('checked');
        var showIndustry = $('#industry-filter').prop('checked');
        var showWorkingAbroad = $('#working-abroad-filter').prop('checked');
        var showWorkingInIndia = $('#working-in-india-filter').prop('checked');

        // Filter people based on the selected filters
        $('.people').each(function() {
            var hasAcademia = $(this).hasClass('ACADEMIA');
            var hasIndustry = $(this).hasClass('INDUSTRY');
            var hasWorkingAbroad = $(this).hasClass('WORKING_ABROAD');
            var hasWorkingInIndia = $(this).hasClass('WORKING_IN_INDIA');

            // Check for the intersection of selected filters
            var isAcademiaSelected = (showAcademia && hasAcademia) || (showIndustry && hasIndustry);
            var isLocationSelected = (showWorkingAbroad && hasWorkingAbroad) || (showWorkingInIndia && hasWorkingInIndia);

            // Show or hide based on the filter conditions
            if (isAcademiaSelected && isLocationSelected) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    // Handle the toggle of the details section when clicking on the person's name
    $('.person_name').click(function() {
        var personDetails = $(this).next('.person_details');
        personDetails.slideToggle(); // Smooth toggle
    });


    // Handle the toggle of the details section when clicking on the reveal button
    $('.reveal_detail').click(function(e) {
        e.stopPropagation(); // Prevent triggering the name click event
        var parentDiv = $(this).closest('.row');
        var thisDetailDiv = parentDiv.next('.person_details');
        thisDetailDiv.slideToggle(); // Smooth toggle
    });
});
</script>
