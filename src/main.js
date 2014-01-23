
var C = window.SkinnySlider = function(id, options) {

	var defaults = {
		range: [0, 100],
		start: 0,
		step: 1,
		slide: null
	};

	this.config = _.extend(defaults, options);

	this.events = {
		slide: new Signal()
	};

	this.lock = false;
	this.value = null;

	this.min = this.config.range[0];
	this.max = this.config.range[1];

	this.el = document.getElementById(id);
	_.css(this.el, { position: 'relative' });

	this.handle = _.append(this.el);
	_.addClass(this.handle, 'handle');
	_.css(this.handle, { position: 'absolute' });

	var lock = _.bind(this.lockOnMouse, this);
	_.on(this.el, 'mousedown touchstart', lock);
	_.on(this.handle, 'mousedown touchstart', lock);
	_.on(document, 'mouseup touchend', lock);
	_.on(document, 'mousemove touchmove', _.bind(this.changeOnMove, this));

	this.events.slide.on(_.bind(this.render, this));
	if (this.config.slide) {
		this.events.slide.on(this.config.slide);
	}

	this.set(this.config.start);
};

C.prototype.lockOnMouse = function(e) {
	e = e || window.event;
	if (e.stopPropagation) e.stopPropagation();
	if (e.preventDefault) e.preventDefault();

	this.lock = /mousedown|touchstart/.test(e.type);
	this.changeOnMove(e);
};

C.prototype.changeOnMove = function(e) {
	e = e || window.event;
	if (this.lock) {
		if (e.stopPropagation) e.stopPropagation();
		if (e.preventDefault) e.preventDefault();

		var x = _.getPointer(e).x - _.getOffset(this.el).left;
		var mapped = _.map(x, 0, this.el.clientWidth, this.min, this.max);
		
		this.set(mapped);
	}
};

C.prototype.render = function(val) {
	var per = _.map(val, this.min, this.max, 0, 100);
	_.css(this.handle, { left: per + '%' });
};

C.prototype.val = function(val) {
	if (val === undefined) return this.value;
	this.set(val);
};

C.prototype.set = function(mapped) {

	var clamped = _.clamp(mapped, this.min, this.max);
	var rounded = _.round(clamped, this.config.step);

	if (rounded != this.value) {
		this.events.slide.trigger(rounded);
		this.value = rounded;
	}
};
