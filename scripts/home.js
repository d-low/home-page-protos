/**
 * @description This class provides the client side behavior/effects for the home 
 * page of www.d-low.com.
 */

var Home_Class = function() { 
	this.$introContainer = null;
	this.$introHeader = null;
	this.$navContainer = null;
	this.$navImages = null;

	this.introHeaderHeight = 0;
	this.navContainerTop = 0;
};

Home_Class.prototype.init = function() { 

	//
	// Get element handles
	//

	this.$introContainer = $("#intro-container");
	this.$introHeader = $("#intro-header");
	this.$navContainer = $("#nav-container");
	this.$navImages = this.$navContainer.find(".nav-image");

	//
	// Data members
	//
	
	this.introHeaderHeight = this.$introHeader.height();
	this.navContainerTop = parseInt(this.$navContainer.position().top);

	// 
	// Apply behavior
	//
	
	$(window).scroll($.proxy(this.window_scroll, this));

	//
	// Add a custom jQuery wait() method for more expressive setTimeout() code.
	// See: http://www.intridea.com/blog/2011/2/8/fun-with-jquery-deferred#
	//

	$.wait = function(time) {
		return $.Deferred(function(dfd) {
			setTimeout(dfd.resolve, time);
		});
	};
};

/**
 * @description Handle the onscroll events to liven up the home page.
 */

Home_Class.prototype.window_scroll = function(e) { 
	this.introContainer_scroll(e);
	this.navContainer_scroll(e);
};

/**
 * @description Upon scrolling update the background position of the intro-container so
 * that its contents scroll away faster than the background image.
 */

Home_Class.prototype.introContainer_scroll = function(e) { 

	var windowHeight = $(window).height();
	var scrollTop = $(window).scrollTop();
	var introContainerHeight = this.$introContainer.height();

	//
	// Just return if we've scrolled past the intro container
	//

	if (scrollTop > introContainerHeight) { 
		return;
	}

	//
	// Update the position of the the intro container background image.
	//

	var yPos = -(scrollTop / 10);
	var coords = '50% '+ yPos + 'px';

	this.$introContainer.css({"background-position": coords });

	//
	// Change the rgb color of the intro header element depending on how far we've
	// scrolled up in the page.  We toggle it from rgb(10,10,10) to rgb(128, 128, 128).
	// Note that we chose to change te color manually rather than use CSS3 transitions
	// to do so because we want specific control of what color is displayed.
	//

	var elHeight = windowHeight > introContainerHeight ? windowHeight : introContainerHeight;
	var color = parseInt(10 + (118 * scrollTop / elHeight));
	color = color > 128 ? 128 : color;

	this.$introHeader.css("color", "rgb(" + color + ", " + color + ", " + color + ")");

	//
	// If the intro header will no longer fit in the intro container because too 
	// much of it has been scrolled away then fade it out.  Otherwise fade it in.
	// TODO: This isn't perfect.  The intro header fades in and out unexpectedly.
	//

	var introHeaderTop = parseInt(this.$introHeader.position().top);

	if (introHeaderTop + this.introHeaderHeight > this.navContainerTop) { 
		if (this.$introHeader.is(":visible") == true) { 
			this.$introHeader.fadeOut();
		}
	}
	else {
		if (this.$introHeader.is(":visible") == false) { 
			this.$introHeader.fadeIn();
		}
	}
	
};

/**
 * @description Once the first 200px of the navigation container is scrolled into
 * view then slide the navigation images into view.  And when scrolling in the 
 * opposite direction once 200px or less of the navigation container is visible
 * then slide the navigation images out of view.
 */

Home_Class.prototype.navContainer_scroll = function(e) { 

	var windowHeight = $(window).height();
	var scrollTop = $(window).scrollTop();
	var navTopPos = this.$navContainer.position().top;
	var pxShowing = windowHeight + scrollTop - navTopPos;

	//
	// Function to invoke on each navigation image from the each() method.  For the
	// specified navigation image and delay we'll either show or hide it by removing
	// or adding the off-screen class.
	//

	var fEach = function($navImage, delay, show) {
		$.wait(delay)
			.then(function() { 
				if (show) { 
					$navImage.removeClass("off-screen");
				}
				else {
					$navImage.addClass("off-screen");
				}
			});
	};

	if (this.$navImages.hasClass("off-screen") == true && pxShowing > 200) {
		this.$navImages.each(function(index) {
			fEach($(this), 500 * (index + 1), true);
		});
	}
	else if (this.$navImages.hasClass("off-screen") == false && pxShowing < 200) {
		this.$navImages.each(function(index) {
			fEach($(this), 100 * (index + 1), false);
		});
	}
};
