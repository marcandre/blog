// $('.quizz td.q').click (evt) ->
// 	$(evt.target).addClass('clicked')
// 	.parent().addClass('reveal')
$('.quizz td.q').click(function(evt) {
  return $(evt.target).addClass('clicked').parent().addClass('reveal');
});
