
var idCounter = 0;

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

	uniqueId: function(prefix) {
		var id = idCounter++;
		return prefix ? prefix + id : id;
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

	off: function(el, type, fn) {
		if (!el) return;
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (el.detachEvent) {
				el.detachEvent('on' + arr[i], fn);
			} else {
				el.removeEventListener(arr[i], fn, false);
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
		var x = 0, y = 0;
		do {
			x += el.offsetLeft - el.scrollLeft;
			y += el.offsetTop - el.scrollTop;
		}
		while ((el = el.offsetParent));
		return { 'left': x, 'top': y };
	}
};
