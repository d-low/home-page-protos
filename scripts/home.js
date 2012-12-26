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
 * @description When the navigation container is scrolled into view slide the
 * navigation images into view.  And when the navigation container is scrolled
 * out of view, slide the navigation images out of view.
 * TODO: Move each row of navigation images in at a time.
 */

Home_Class.prototype.navContainer_scroll = function(e) { 
	
	var scrollTop = $(window).scrollTop();
	var navTopPos = this.$navContainer.position().top;

	if (scrollTop > navTopPos) { 
		this.$navImages.removeClass("off-screen");
	}
	else if (scrollTop < navTopPos) { 
		this.$navImages.addClass("off-screen");
	}
};
