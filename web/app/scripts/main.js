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
	}
/*eslint-enable no-unused-vars*/

$(document).ready(function(){


	//AS FUNCTION
		// $('#slider .slides').slick({
		// 	cssEase : 'linear',
		// 	infinite : true,
		// 	arrows : false,
		// 	dots : true
		// });


	//AS PONERTHUMB
	// $('.item-gallery .thumb img').click(function() {
	// 	var thmb = this;
	// 	var src = this.src;
	// 	$('.item-gallery .img img').fadeOut(400,function(){
	// 		thmb.src = this.src;
	// 		$(this).fadeIn(400)[0].src = src;
	// 	});
	// });

	$('.search-btn').click(function(){
		$('#header, #search').addClass('search-slide');
		$(this).addClass('disabled');
		return false;
	});

	$('.close-btn').click(function(){
		$('#header, #search').removeClass('search-slide');
		$('.search-btn').removeClass('disabled');
		return false;
	});

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

});

$(window).load(function(){
	//AS PONERTHUMB
	// $('.item-gallery .thumb img').click(function() {
	// 	var thmb = this;
	// 	var src = this.src;
	// 	$('.item-gallery .img img').fadeOut(400,function(){
	// 		thmb.src = this.src;
	// 		$(this).fadeIn(400)[0].src = src;
	// 	});
	// });

	if ( $(window).width() > 800 ) {

		$('#slider, #slider .slides, #slider .slick-slide').css({ height: $(window).height() - $('#header').outerHeight() });

		// $('.categories > li').mouseenter(function(){
		// 	$(this).find('.sub-categories').stop().slideDown(800);
		// }).mouseleave(function(){
		// 	$(this).find('.sub-categories').stop().slideUp(800);
		// });

	} else {
		// $('.categories > li').click(function(){
		// 	if ( $(this).hasClass('open') ) {
		// 		$(this).find('.sub-categories').stop().fadeOut(500);
		// 		$(this).removeClass('open');
		// 	} else {
		// 		$('.categories > li.open').removeClass('open').find('.sub-categories').stop().fadeOut(500);
		// 		$(this).find('.sub-categories').stop().fadeIn(500);
		// 		$(this).addClass('open');
		// 	}
		// 	return false;
		// });
	}

	// $('.img').each(function(){
	// 	var ih = $(this).find('img').height();
	// 	$(this).height(ih);
	// 	$(this).parent().not('a, article .inner').height(ih);
	// });
	// $('#main-content').css({ paddingTop : $('#header').outerHeight() });
	// $('#container').css({ paddingBottom : $('#footer').outerHeight() });

});
