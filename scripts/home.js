/**
 * @description This class provides the client side behavior/effects for the home 
 * page of www.d-low.com.
 */

var Home_Class = function() { 

	this.$introContainer = null;
	this.$introHeader = null;
	this.$navContainer = null;
	this.$navImages = null;

	this.navContainerPxShowing = 200;

	this.timeouts = {
		resize: null
	};

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
	// Update sizing and positioning
	//

	this.updateIntroContainerHeight();
	this.updateNavigation();
	
	// 
	// Event handlers
	//
	
	$(window).resize($.proxy(this.window_resize, this));
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


// ****************************************************************************
// Event Handlers
// ****************************************************************************

/**
 * @description Upon the last window resize event firing we'll update our 
 * section container heights and then the navigation positioning.
 */

Home_Class.prototype.window_resize = function(e) { 
	var self = this;

	var fResize = function() { 
		self.updateIntroContainerHeight();
		self.updateNavigation();
	};	

	window.clearTimeout(this.timeouts.resize);
	this.timeouts.resize = window.setTimeout(fResize, 100);
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
	
		if (pxShowing >= this.navContainerPxShowing && areNavImagesVisible == false) { 
			this.toggleNavImages(true);
		}
		else if (pxShowing < this.navContainerPxShowing && areNavImagesVisible == true) {
			this.toggleNavImages(false);
		}
	}
};


// ****************************************************************************
// Positioning Methods
// ****************************************************************************

/**
 * @description Set the height of the intro container elements to be the height 
 * of the view port so that the background image on the intro container, and perhaps
 * others, covers the viewport properly.  This method will be called after the 
 * last window resize event.
 */

Home_Class.prototype.updateIntroContainerHeight = function() { 
	var height = $(window).height();
	this.$introContainer.css("height", height + "px");
};

/**
 * @description Programmatically posiiton the navigation images based on the
 * screen resolution width.  This method will be called after the last window
 * resize event.
 */

Home_Class.prototype.updateNavigation = function() { 

	var screenWidth = $(window).width();
	var navImageWidth = this.$navImages.outerWidth();
	var navImageHeight = this.$navImages.outerHeight();
	var rowOffSet = 50;
	var paddingBetween = 30;
	var pxShowing = this.pixelsOfNavContainerShowing();

	//
	// Calculate the minimum row width for 3, 2 and 1 image(s).
	// 
	
	var minRowWidthFor3 = 3 * navImageWidth + 2 * paddingBetween;
	var minRowWidthFor2 = 2 * navImageWidth + paddingBetween;
	var minRowWidthFor1 = navImageWidth;

	//
	// Determine the number of images per row and the minimum row width
	// based on the screen width.
	//
	
	var numPerRow, minRowWidth;

	if (screenWidth >= minRowWidthFor3) {
		numPerRow = 3;
		minRowWidth = minRowWidthFor3;
	}
	else if (screenWidth >= minRowWidthFor2) {
		numPerRow = 2;
		minRowWidth = minRowWidthFor2;
	}
	else {
		numPerRow = 1;
		minRowWidth = minRowWidthFor1;
	}
	
	//
	// Position the images.
	//
		
	var rowLeftPos = (screenWidth - minRowWidth) / 2;
	var numRenderedPerRow = 0;
	var numRows, rowNum = 1;

	for (var i = 0; i < this.$navImages.length; i++) { 	
		var $navImage = $(this.$navImages[i]);

		// Once we're rendered the number per row we start rendering the 
		// next image on a new row.
		
		if (numRenderedPerRow == numPerRow) {
			numRenderedPerRow = 0;
			rowNum++;
			numRows = rowNum;

			// If the number of images we have left to display is less than 
			// the number we're displaying per row then we need to update 
			// the number per row and minimum row width.
		
			var numImagesLeft = this.$navImages.length - i;
	
			if (numImagesLeft <= numPerRow) {
				if (numImagesLeft == 2) { 
					numPerRow = 2;
					minRowWidth = minRowWidthFor2;
				}
				else {
					numPerRow = 1;
					minRowWidth = minRowWidthFor1;
				}
				rowLeftPos = (screenWidth - minRowWidth) / 2;
			}
		}
		
		var left = rowLeftPos + (numRenderedPerRow * (navImageWidth + paddingBetween));
		var top = rowOffSet * rowNum + ((rowNum - 1) * navImageHeight);

		if (rowNum % 2) {
			$navImage.css("left", left + "px");
		}
		else {
			$navImage.css("right", (screenWidth - left - navImageWidth) + "px");
		}

		$navImage.css("top", top + "px");
			
		if (rowNum % 2) {
			if (pxShowing < this.navContainerPxShowing) {
				$navImage.addClass("off-screen off-screen-left");
			}

			$navImage.data("offscreenclass", "off-screen off-screen-left");
		}
		else {
			if (pxShowing < this.navContainerPxShowing) {
				$navImage.addClass("off-screen off-screen-right");
			}

			$navImage.data("offscreenclass", "off-screen off-screen-right");
		}

		numRenderedPerRow++;
	}	

	//
	// After positioning the navigation images we may need to reset the
	// height of the navigation container if height of the number of 
	// rows of images we've rendered exceeds the original height of 
	// the navigation container.
	//

	var heightOfRows = (rowOffSet * numRows) + (navImageHeight * numRows);

	if (heightOfRows >= this.heights.navContainer - 100) { // -100px breathing room
		var newHeight = heightOfRows + 100;
		this.$navContainer.css("height", newHeight + "px");
		this.heights.navContainer = newHeight;
	}

}; // end Home_Class.updateNavigation()

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

}; // end Home_Class.toggleNavImages()
