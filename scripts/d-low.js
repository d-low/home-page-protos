var DLow_Class = function() { 
	this.introHeader = null;
	this.introImage = null;
};

DLow_Class.prototype.init = function() { 

	//
	// Get element handles
	//

	this.$introHeader = $("#intro-header");
	this.$introImage = $("#intro-image");

	// 
	// Apply behavior
	//
	
	var that = this;

	// $(window).scroll(function(e) { that.introImage_scroll(e); });
	$(window).scroll(function(e) { that.introHeader_scroll(e); });
};

DLow_Class.prototype.introImage_scroll = function(e) { 
	// TODO: Stop handling this event when the intro image is out of view...
	var yPos = -($(window).scrollTop() / 10);
	this.$introImage.css("margin-top", yPos + "px");
};

DLow_Class.prototype.introHeader_scroll = function(e) { 
	this.$introHeader.css("top", $(window).scrollTop() + 100 + "px");
	// TODO: Stop handling this event when the intro container is out of view...
};
