
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

	this.min = this.config.range[0];
	this.max = this.config.range[1];

	var original = document.getElementById(id) || id;
	this.el = original.cloneNode(); //remove old events
	original.parentNode.replaceChild(this.el, original);
	_.css(this.el, { position: 'relative' });

	this.handle = _.append(this.el);
	_.addClass(this.handle, 'handle');
	_.css(this.handle, { position: 'absolute' });

	this.toggleLock = _.bind(this.toggleLockFn, this);
	this.changeOnMove = _.bind(this.changeOnMoveFn, this);
	_.on(this.el, 'mousedown touchstart', this.toggleLock);
	_.on(this.handle, 'mousedown touchstart', this.toggleLock);

	this.events.set.on(_.bind(this.render, this));
	this.set(this.config.start);

	if (this.config.slide) {
		this.events.slide.on(this.config.slide);
	}
};

C.prototype.stopSelect = function() {
	return false;
};

C.prototype.toggleLockFn = function(e) {
	e = e || window.event;

	this.changeOnMove(e);

	var fn = /mousedown|touchstart/.test(e.type) ? 'on' : 'off';
	_[fn](document, 'mouseup touchend', this.toggleLock);
	_[fn](document, 'mousemove touchmove', this.changeOnMove);
	_[fn](document, 'selectstart', this.stopSelect);
};

C.prototype.changeOnMoveFn = function(e) {
	e = e || window.event;

	if (e.stopPropagation) e.stopPropagation();
	if (e.preventDefault) e.preventDefault();

	var x = _.getPointer(e).x - _.getOffset(this.el).left;
	var mapped = _.map(x, 0, this.el.clientWidth, this.min, this.max);
	
	var old = this.value;
	this.set(mapped);
	if (old != this.value) {
		this.events.slide.trigger(this.value);
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
		this.value = rounded;
		this.events.set.trigger(this.value);
	}
};
