/**
 * @description This class provides the client side behavior/effects for the home 
 * page of www.d-low.com.
 */

var Home_Class = function() { 
	this.$introContainer = null;
	this.$introHeader = null;
	this.$navContainer = null;
	this.$navImages = null;

	this.heights = {
		introContainer: 0,
		introHeader: 0,
		navContainer: 0
	};

	this.positions = {
		introHeaderTop: 0,
		navContainerTop: 0
	};

	// Set to true when toggling nav images and to false when done so that
	// we don't toggle them in or out when already doing so!
	this.togglingNavImages = false;
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
	
	this.heights.introContainer = this.$introContainer.height();
	this.heights.introHeader = this.$introHeader.height();
	this.heights.navContainer = this.$navContainer.height();

	this.positions.introHeaderTop = parseInt(this.$introHeader.css("top"));
	this.positions.navContainerTop = parseInt(this.$navContainer.position().top);

	//
	// Position navigation images based on screen resolution.
	//

	this.positionNavImages();
	
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

	var windowScrollTop = $(window).scrollTop();

	if (this.isIntroContainerVisible() == true) {
		this.updateIntroContainerBackground();
		this.updateIntroHeaderOpacity();
	}

	if (this.isNavContainerVisible() == true) { 
		var pxShowing = this.pixelsOfNavContainerShowing();
		var areNavImagesVisible = this.areNavImagesVisible();
	
		if (pxShowing >= 200 && areNavImagesVisible == false) { 
			this.toggleNavImages(true);
		}
		else if (pxShowing < 200 && areNavImagesVisible == true) {
			this.toggleNavImages(false);
		}
	}
};


// ****************************************************************************
// Positioning Methods
// ****************************************************************************

/**
 * @description Programmatically posiiton the navigation images based on the
 * screen resolution width.
 */

Home_Class.prototype.positionNavImages = function() { 

	var screenWidth = $(window).width();
	var navImageWidth = this.$navImages.outerWidth();
	var navImageHeight = this.$navImages.outerHeight();
	var paddingBetween = 30;
	var paddingBelow = 100;

	var minRowWidthFor3 = 3 * navImageWidth + 2 * paddingBetween;

	//
	// TODO: Refactor the logic below to be based off a numPerRow which 
	// will be calculated based on the screen width.  We're close...
	//
	
	if (screenWidth > minRowWidthFor3) {

		//
		// If we can fit three images per row for the current screen width
		// then dynamically position groups of three on each row.  
		// Note that we do not yet gracefully handle having less than three
		// on a row.  
		//
		
		var rowLeftPos = (screenWidth - minRowWidthFor3) / 2;
		var numRenderedPerRow = 0;
		var rowNum = 1;

		for (var i = 0; i < this.$navImages.length; i++) { 	
			var $navImage = $(this.$navImages[i]);

			if (numRenderedPerRow == 3) {
				numRenderedPerRow = 0;
				rowNum++;
			}
		
			var left = rowLeftPos + (numRenderedPerRow * (navImageWidth + paddingBetween));
			var top = 50 * rowNum + ((rowNum - 1) * navImageHeight);

			if (rowNum % 2) {
				$navImage.css("left", left + "px");
			}
			else {
				$navImage.css("right", (screenWidth - left - navImageWidth) + "px");
			}

			$navImage.css("top", top + "px");
			
			if (rowNum % 2) {
				$navImage.addClass("off-screen off-screen-left");
				$navImage.data("offscreenclass", "off-screen off-screen-left");
			}
			else {
				$navImage.addClass("off-screen off-screen-right");
				$navImage.data("offscreenclass", "off-screen off-screen-right");
			}

			numRenderedPerRow++;
		}
	}	

	return;
};


/**
 * @description The intro container is visible when the window's scroll top
 * is greater or equal to the height of the intro container.
 *
 */

Home_Class.prototype.isIntroContainerVisible = function() { 
	var isVisible = true;
	
	if ($(window).scrollTop() >= this.heights.introContainer) {
		isVisible = false;
	}

	return isVisible;
};


/**
 * @description The intro header cannot be shown if the intro container is
 * not visible or if the height showing of the intro container is smaller 
 * than the height of the intro header.
 */

Home_Class.prototype.canIntroHeaderBeShown = function() { 
	var canBeShown = true;

	if (this.isIntroContainerVisible() == false) {
		canBeShown = false;
	}
	else {
		if ($(window).scrollTop() >= this.heights.introContainer - this.heights.introHeader - this.positions.introHeaderTop) { 
			canBeShown = false;
		}
	}

	return canBeShown;
};


/**
 * @description The nav container is visible when the window height plus the scroll
 * top is greater than or equal to the nav container's top position and less than
 * or equal to the top position of the nav container plus its height.
 */

Home_Class.prototype.isNavContainerVisible = function() { 
	var windowHeight = $(window).height();
	var windowScrollTop = $(window).scrollTop();
	var isVisible = false;

	if (windowHeight + windowScrollTop >= this.positions.navContainerTop &&
		windowHeight + windowScrollTop <= this.positions.navContainerTop + this.heights.navContainer)
	{
		isVisible = true;
	}
		
	return isVisible;
};


/**
 * @description Calculate the number of pixels of the nav container that are showing.  
 */

Home_Class.prototype.pixelsOfNavContainerShowing = function() { 
	var windowHeight = $(window).height();
	var scrollTop = $(window).scrollTop();
	var navTopPos = this.$navContainer.position().top;
	var pxShowing = windowHeight + scrollTop - navTopPos;

	return (pxShowing < 0 ? 0 : pxShowing);
};


/**
 * @description If none of the nav images has the off screen class then
 * return true because they're all visible.
 */

Home_Class.prototype.areNavImagesVisible = function() { 
	return (this.$navImages.hasClass("off-screen") == true ? false : true);
};



// ****************************************************************************
// Effects Methods
// ****************************************************************************

/**
 * @description Update the background position of the intro-container so that
 * its contents scroll away faster than the background image.  This is a simple
 * parallax scrolling technique.
 */

Home_Class.prototype.updateIntroContainerBackground = function() { 
	var scrollTop = $(window).scrollTop();
	var yPos = -(scrollTop / 10);
	var coords = '50% '+ yPos + 'px';

	this.$introContainer.css({"background-position": coords });
};


/**
 * @description Update the opacity of the intro header as we scroll down the page so 
 * that it fades away as the intro container is scrolled out of view.
 */

Home_Class.prototype.updateIntroHeaderOpacity = function() { 

	var scrollTop = $(window).scrollTop();
	var scrollRange = this.heights.introContainer - this.positions.introHeaderTop;
	var opacity = Number((100 - (scrollTop / scrollRange * 100)) / 100).toFixed(2);
	opacity = opacity < 0 ? 0 : opacity;

	this.$introHeader.css("opacity", opacity);
};


/**
 * @description Slide the navigation images into or out of view.
 */

Home_Class.prototype.toggleNavImages = function(show) {

	// Just return if we're already toggling the nav images.
	if (this.togglingNavImages) { 
		return;
	}

	this.togglingNavImages = true;

	var that = this;

	var fEach = function($navImage, delay, index) {
		$.wait(delay)
			.then(function() { 
				if (show) { 
					$navImage.removeClass("off-screen off-screen-left");
					$navImage.removeClass("off-screen off-screen-right");
				}
				else {
					var offScreenClassName = $navImage.data("offscreenclass");
					$navImage.addClass(offScreenClassName);
				}
			
				// Reset our mutex once we've toggled the last nav image.
				if (index == that.$navImages.length - 1) {
					that.togglingNavImages = false;
				}
			});
	};

	var delay = (show == true ? 500 : 100);

	this.$navImages.each(function(index) {
		fEach($(this), delay * (index + 1), index);
	});
}; 
