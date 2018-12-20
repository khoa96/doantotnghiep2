$(document).ready(function () {
	$(document).on('click', 'img.zoomable', function(){
		var img = $(this);
		var bigImg = $('<img />').css({
		  'max-width': '100%',
		  'max-height': '100%',
		  'display': 'inline'
		});
		bigImg.attr({
		  src: img.attr('src'),
		  alt: img.attr('alt'),
		  title: img.attr('title')
		});
		var over = $('<div />').text(' ').css({
		  'height': '100%',
		  'width': '100%',
		  'background': 'rgba(0,0,0,.72)',
		  'position': 'fixed',
		  'top': 0,
		  'left': 0,
		  'opacity': 0,
		  'cursor': 'pointer',
		  'z-index': 99999999,
		  'text-align': 'center'
		}).append(bigImg).bind('click', function () {
		  $(this).fadeOut(300, function () {
			$(this).remove();
		  });
		}).insertAfter(this).animate({
		  'opacity': 1
		}, 1000);
		
	})
	
});