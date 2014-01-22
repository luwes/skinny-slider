
window.SkinnySlider = function(id, options) {

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
	this.oldValue = null;

	this.el = document.getElementById(id);
	_.css(this.el, { position: 'relative' });

	this.handle = _.append(this.el);
	_.addClass(this.handle, 'handle');
	_.css(this.handle, { position: 'absolute' });

	var lock = _.bind(this.lockOnMouse, this);
	_.on(this.el, 'mousedown', lock);
	_.on(this.handle, 'mousedown', lock);
	_.on(document, 'mouseup', lock);
	_.on(document, 'mousemove', _.bind(this.changeOnMove, this));

	this.events.slide.on(_.bind(this.render, this));
	if (this.config.slide) {
		this.events.slide.on(this.config.slide);
	}
};

SkinnySlider.prototype.lockOnMouse = function(e) {
	this.lock = e.type === 'mousedown';
	this.changeOnMove(e);
};

SkinnySlider.prototype.changeOnMove = function(e) {
	if (this.lock) {
		if (e.preventDefault) e.preventDefault();

		var x = e.pageX - _.getOffset(this.el).left;
		var ratio = x / this.el.clientWidth;
		var clamp = Math.max(0, Math.min(ratio, 1));

		var div = (this.config.range[1] - this.config.range[0]) / this.config.step;
		
		var value = Math.round(clamp * div) * this.config.step + this.config.range[0];
		var percent = Math.round(clamp * div) * 100 / div;

		if (value != this.oldValue) {
			this.events.slide.trigger(value, percent);
			this.oldValue = value;
		}
	}
};

SkinnySlider.prototype.render = function(val, per) {
	_.css(this.handle, { left: per + '%' });
};
