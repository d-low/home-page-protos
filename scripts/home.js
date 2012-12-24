var Home_Class = function() { 
	this.$introHeader = null;
	this.$navContainer = null;
};

Home_Class.prototype.init = function() { 

	//
	// Get element handles
	//

	this.$introHeader = $("#intro-header");
	this.$navContainer = $("#nav-container");

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
	this.introHeader_scroll(e);
	this.navContainer_scroll(e);
};

/**
 * @description Upon scrolling keep the background position of the intro-header the 
 * same so that the intro-header content scrolls away but the image stays the same.
 */

Home_Class.prototype.introHeader_scroll = function(e) { 

	var yPos = -($(window).scrollTop() / 10);
	var coords = '50% '+ yPos + 'px';

	this.$introHeader.css({"background-position": coords });
};

/**
 * @description When the navigation container is scrolled into view for the first
 * time we need to slide the navigation images into view.
 */

Home_Class.prototype.navContainer_scroll = function(e) { 
	// TODO: Implement behavior...
};
