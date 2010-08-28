/*
Script: Drag.Dock
Author: Sean McArthur [mcarthurgfx.com]
*/
Drag.Dock = new Class({
	Extends: Drag.Move,
	options: {
		proximity: 20
	},
	initialize: function(element, options, location) {
		$(element).setStyle('position','fixed');
		this.setOptions(options);
		this.parent(element, this.options);
		this.dock(location || 'top');
	},
	drag: function(event) {
		this.parent(event);
		var windowHeight = window.innerHeight || document.documentElement.clientHeight;
		var windowWidth = window.innerWidth || document.documentElement.clientWidth;
		if(this.element.offsetTop < this.options.proximity) {
			this.dock('top');
		}
		if(this.element.offsetTop + this.element.offsetHeight > windowHeight - this.options.proximity) {
			this.dock('bottom');
		}
		if(this.element.offsetLeft < this.options.proximity) {
			this.dock('left');
		}
		if(this.element.offsetLeft + this.element.offsetWidth > windowWidth - this.options.proximity) {
			this.dock('right');
		}
	},
	dock: function(location) {
		var windowHeight = window.innerHeight || document.documentElement.clientHeight;
		var windowWidth = window.innerWidth || document.documentElement.clientWidth;
		switch(location) {
			case 'top':
				this.element.setStyle('top',0);
				break;
			case 'bottom':
				this.element.setStyle('top',windowHeight - this.element.offsetHeight);
				break;
			case 'left':
				this.element.setStyle('left',0);
				break;
			case 'right':
				this.element.setStyle('left',windowWidth - this.element.offsetWidth)
				break;
			default:
				break;
		}
	}
});
Element.implement({
	makeDockable: function(options,location) {
		return new Drag.Dock(this,options,location);
	}
});
