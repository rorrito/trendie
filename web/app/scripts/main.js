/* globals Modernizr: false, $: false */
'use strict';

/*eslint-disable no-unused-vars*/

	function hacerSlideHome(){
		$('#slider .slides').slick({
			cssEase: 'linear',
			infinite: true,
			arrows: false,
			dots: true
		});
	}

	function menuCategory(){
		if (!Modernizr.touch) {
			// console.log('HEY');
			$('.categories > li').mouseenter(function(){
				$(this).find('.sub-categories').stop().slideDown(800);
			}).mouseleave(function(){
				$(this).find('.sub-categories').stop().slideUp(800);
			});
		} else {
			$('.categories > li').click(function(){
				if ( $(this).hasClass('open') ) {
					$(this).find('.sub-categories').stop().fadeOut(500);
					$(this).removeClass('open');
				} else {
					$('.categories > li.open').removeClass('open').find('.sub-categories').stop().fadeOut(500);
					$(this).find('.sub-categories').stop().fadeIn(500);
					$(this).addClass('open');
				}
				return false;
			});
		}
	}

	function afterLoad() {

		$('.img').each(function(){
			var ih = $(this).find('img').height();
			$(this).height(ih);
			$(this).parent().not('a, article .inner').height(ih);
		});
		$('#main-content').css({ paddingTop: $('#header').outerHeight() });
		$('#container').css({ paddingBottom: $('#footer').outerHeight() });
		$('.img').each(function(){
			var ih = $(this).find('img').height();
			$(this).height(ih);
			$(this).parent().not('a, article .inner').height(ih);
		});

		$('.item-details .actions .share').mouseenter(function(){
		 	$('.item-details .actions .sharebox').addClass('show');
		});
		$('.item-details .actions .sharebox').mouseleave(function(){
			$(this).removeClass('show');
		});

	}

/*eslint-enable no-unused-vars*/

$(document).ready(function(){
	$('.mobile-btn').click(function(){
		if ( $(this).hasClass('slided') ){
			$('#header, #main-content, #mobile-navigation').removeClass('mobile-slided');
			$(this).removeClass('slided');
		} else {
			$('#header, #main-content, #mobile-navigation').addClass('mobile-slided');
			$(this).addClass('slided');
		}
		return false;
	});
});

$(window).resize(function(){
	if ( $(window).width() > 800 ) {
		$('#slider, #slider .slides, #slider .slick-slide').css({ height: $(window).height() - $('#header').outerHeight() });
	}
	$('#main-content').css({ paddingTop: $('#header').outerHeight() });
	$('#container').css({ paddingBottom: $('#footer').outerHeight() });
	$('.img').each(function(){
		var ih = $(this).find('img').height();
		$(this).height(ih);
		$(this).parent().not('a, article .inner').height(ih);
	});
});

$(window).load(function(){
	if ( $(window).width() > 800 ) {
		$('#slider, #slider .slides, #slider .slick-slide').css({ height: $(window).height() - $('#header').outerHeight() });
	}
});
