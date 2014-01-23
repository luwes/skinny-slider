
var _ = {

	append: function(parent, type) {
		var el = document.createElement(type || 'div');
		return parent.appendChild(el);
	},

	addClass: function(el, classname) {
		if (el.className.indexOf(classname) === -1) {
			el.className += ' ' + classname;
		}
	},

	bind: function(fn, context) {
		return function() { fn.apply(context, [].slice.call(arguments)); };
	},

	on: function(el, type, fn) {
		if (!el) return;
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (el.attachEvent) {
				el.attachEvent('on' + arr[i], fn);
			} else {
				el.addEventListener(arr[i], fn, false);
			}
		}
	},

	extend: function(src, dest) {
		for (var key in dest) {
			src[key] = dest[key];
		}
		return src;
	},

	css: function(el, props) {
		if (el) {
			for (var key in props) {
				if (typeof props[key] === 'undefined') {
					continue;
				} else if (typeof props[key] == 'number' && !(key == 'zIndex' || key == 'opacity')) {
					if (isNaN(props[key])) {
						continue;
					}
					props[key] = Math.ceil(props[key]) + 'px';
				}
				try {
					el.style[key] = props[key];
				} catch (e) {}
			}
		}
	},

	getOffset: function(el) {
		var docElem = document.documentElement;
		var box = el.getBoundingClientRect(el);
		return {
			top: box.top + (window.pageYOffset || docElem.scrollTop)  - (docElem.clientTop || 0),
			left: box.left + (window.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
		};
	},

	/**
    * Round number to a specific radix
    */
	round: function(value, radix) {
		radix = radix || 1; // default round 1
		return Math.round(value / radix) * radix;
	},

	/**
     * Clamps value inside range.
     */
	clamp: function(val, min, max) {
		return val < min? min : (val > max? max : val);
	},

	/**
    * Linear interpolation.
    * IMPORTANT:will return `Infinity` if numbers overflow Number.MAX_VALUE
    */
	lerp: function(ratio, start, end) {
		return start + (end - start) * ratio;
	},

	/**
    * Gets normalized ratio of value inside range.
    */
	norm: function(val, min, max) {
		return (val - min) / (max - min);
	},

	/**
    * Maps a number from one scale to another.
    * @example map(3, 0, 4, -1, 1) -> 0.5
    */
	map: function(val, min1, max1, min2, max2) {
		return _.lerp( _.norm(val, min1, max1), min2, max2 );
	}
};
