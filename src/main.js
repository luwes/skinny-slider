
var C = window.SkinnySlider = function(id, options) {

	var defaults = {
		range: [0, 100],
		start: 0,
		step: 1,
		slide: null
	};

	this.config = _.extend(defaults, options);

	this.events = {
		set: new Signal(),
		slide: new Signal()
	};

	this.dragging = false;
	this.value = null;

	this.min = this.config.range[0];
	this.max = this.config.range[1];

	this.el = document.getElementById(id) || id;
	_.css(this.el, { position: 'relative' });

	this.handle = _.append(this.el);
	_.addClass(this.handle, 'handle');
	_.css(this.handle, { position: 'absolute' });

	this.lock = _.bind(this.lockFn, this);
	this.drag = _.bind(this.dragFn, this);
	_.on(this.el, 'mousedown touchstart', this.lock);
	_.on(this.handle, 'mousedown touchstart', this.lock);

	this.events.set.on(_.bind(this.render, this));
	this.set(this.config.start);

	if (this.config.slide) {
		this.events.slide.on(this.config.slide);
	}
};

C.prototype.lockFn = function(e) {
	e = e || window.event;

	this.dragging = /mousedown|touchstart/.test(e.type);
	this.drag(e);

	var fn = this.dragging ? 'on' : 'off';
	_[fn](document, 'mouseup touchend', this.lock);
	_[fn](document, 'mousemove touchmove', this.drag);
	_[fn](document, 'selectstart', this.stopSelect);
};

C.prototype.dragFn = function(e) {
	e = e || window.event;
	
	if (this.dragging) {

		if (e.stopPropagation) e.stopPropagation();
		if (e.preventDefault) e.preventDefault();

		var x = _.getPointer(e).x - _.getOffset(this.el).left;
		var mapped = _.map(x, 0, this.el.clientWidth, this.min, this.max);
		
		var old = this.value;
		this.set(mapped);
		if (old != this.value) {
			this.events.slide.trigger(this.value);
		}
	}
};

C.prototype.stopSelect = function() {
	return false;
};

C.prototype.render = function(val) {
	var per = _.map(val, this.min, this.max, 0, 100);
	_.css(this.handle, { left: per + '%' });
};

C.prototype.set = function(mapped) {
	var clamped = _.clamp(mapped, this.min, this.max);
	var rounded = _.round(clamped, this.config.step);
	if (rounded != this.value) {
		this.value = rounded;
		this.events.set.trigger(this.value);
	}
};

C.prototype.val = function(val) {
	if (val === undefined) return this.value;
	this.set(val);
};
