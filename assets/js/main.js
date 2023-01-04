---
---
$(function() {
 
  var peoples = $('.people').detach();
  $('.people-container').append(peoples);
  
  // Set checkboxes
  var people_type_data = {{ site.data.types-people | jsonify }};
  var all_tags = [];
  var toggle_status = {};
  for (var i = 0; i < people_type_data.length; i++) {
    all_tags[i] = people_type_data[i]['tag'];
    toggle_status[all_tags[i]] = false;
  }
  var tags = store.get('{{ site.baseurl }}');
  if (tags === undefined) {
    tags = all_tags;
  }
  for (var i = 0; i < tags.length; i++) {
    $('#' + tags[i] + '-checkbox').prop('checked', true);
    toggle_status[tags[i]] = true;
  }
  store.set('{{ site.baseurl }}', tags);

  function update_people_list() {
    peoples.each(function(i, people) {
      var people = $(people);
      var show = false;
      for (var i = 0; i < all_tags.length; i++) {
        if(people.hasClass(all_tags[i])) {
          show = show | toggle_status[all_tags[i]];
        }
      }
      if (show) {
        people.show();
      } else {
        people.hide()
      }
    });
  }
  update_people_list();

  // Event handler on checkbox change
  $('form :checkbox').change(function(e) {
    var checked = $(this).is(':checked');
    var tag = $(this).prop('id').slice(0, -9);
    toggle_status[tag] = checked;

    if (checked == true) {
      if (tags.indexOf(tag) < 0)
        tags.push(tag);
    }
    else {
      var idx = tags.indexOf(tag);
      if (idx >= 0)
        tags.splice(idx, 1);
    }
    store.set('{{ site.domain }}', tags);
    update_people_list();
  });
});
