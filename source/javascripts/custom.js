(function($){
$(function(){
// $('.quizz td.q').click (evt) ->
// 	$(evt.target).addClass('clicked')
// 	.parent().addClass('reveal')
$('.quizz td.q').click(function(evt) {
  return $(evt.target).addClass('clicked').parent().addClass('reveal');
});


// generate_id = ($elem) ->
//   id = $elem.html()
//        .toLowerCase()
//        .replace(/\s/g, '_')
//        .replace(/\W/g, '')
//   $elem.attr('id', id)

// generate_id($(header)) for header in $('h1,h2,h3,h4').not('[id]')

var generate_id, header, _i, _len, _ref;

generate_id = function($elem) {
  var id;
  id = $elem.html().toLowerCase().replace(/\s/g, '_').replace(/\W/g, '');
  return $elem.attr('id', id);
};

_ref = $('h1,h2,h3,h4').not('[id]');
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  header = _ref[_i];
  generate_id($(header));
}


//
var s = document.createElement('script'), t = document.getElementsByTagName('script')[0];
s.type = 'text/javascript';
s.async = true;
s.src = 'http://api.flattr.com/js/0.6/load.js?mode=auto';
t.parentNode.insertBefore(s, t);

});
})(jQuery);
