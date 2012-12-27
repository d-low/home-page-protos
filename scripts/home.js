var Home_Class = function() { 
	this.$introHeader = null;
	this.$navContainer = null;
	this.$navImages = null;
};

Home_Class.prototype.init = function() { 

	//
	// Get element handles
	//

	this.$introContainer = $("#intro-container");
	this.$navContainer = $("#nav-container");
	this.$navImages = this.$navContainer.find(".nav-image");

	// 
	// Apply behavior
	//
	
	var that = this;

	$(window).scroll(function(e) { that.window_scroll(e); });

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
 * @description Upon scrolling keep the background position of the intro-container the 
 * same so that the intro-container content scrolls away but the image stays the same.
 */

Home_Class.prototype.introContainer_scroll = function(e) { 

	var yPos = -($(window).scrollTop() / 10);
	var coords = '50% '+ yPos + 'px';

	this.$introContainer.css({"background-position": coords });
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
