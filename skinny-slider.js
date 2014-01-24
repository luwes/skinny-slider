!function(window, document) {
    var _ = {
        append: function(parent, type) {
            var el = document.createElement(type || "div");
            return parent.appendChild(el);
        },
        addClass: function(el, classname) {
            -1 === el.className.indexOf(classname) && (el.className += " " + classname);
        },
        bind: function(fn, context) {
            return function() {
                fn.apply(context, [].slice.call(arguments));
            };
        },
        on: function(el, type, fn) {
            if (el) for (var arr = type.split(" "), i = 0; i < arr.length; i++) el.attachEvent ? el.attachEvent("on" + arr[i], fn) : el.addEventListener(arr[i], fn, !1);
        },
        off: function(el, type, fn) {
            if (el) for (var arr = type.split(" "), i = 0; i < arr.length; i++) el.detachEvent ? el.detachEvent("on" + arr[i], fn) : el.removeEventListener(arr[i], fn, !1);
        },
        extend: function(src, dest) {
            for (var key in dest) src[key] = dest[key];
            return src;
        },
        css: function(el, props) {
            if (el) for (var key in props) if ("undefined" != typeof props[key]) {
                if ("number" == typeof props[key] && "zIndex" != key && "opacity" != key) {
                    if (isNaN(props[key])) continue;
                    props[key] = Math.ceil(props[key]) + "px";
                }
                try {
                    el.style[key] = props[key];
                } catch (e) {}
            }
        },
        getPointer: function(e) {
            var x = e.pageX, y = e.pageY;
            if (e.touches && (x = e.touches[0].pageX, y = e.touches[0].pageY), null == x) {
                var doc = document.documentElement, body = document.body;
                x = e.clientX + (doc.scrollLeft || body.scrollLeft || 0) - (doc.clientLeft || body.clientLeft || 0), 
                y = e.clientY + (doc.scrollTop || body.scrollTop || 0) - (doc.clientTop || body.clientTop || 0);
            }
            return {
                x: x,
                y: y
            };
        },
        getOffset: function(el) {
            var docElem = document.documentElement, box = el.getBoundingClientRect(el);
            return {
                top: box.top + (window.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
                left: box.left + (window.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
            };
        },
        round: function(value, radix) {
            return radix = radix || 1, Math.round(value / radix) * radix;
        },
        clamp: function(val, min, max) {
            return min > val ? min : val > max ? max : val;
        },
        lerp: function(ratio, start, end) {
            return start + (end - start) * ratio;
        },
        norm: function(val, min, max) {
            return (val - min) / (max - min);
        },
        map: function(val, min1, max1, min2, max2) {
            return _.lerp(_.norm(val, min1, max1), min2, max2);
        }
    }, C = window.SkinnySlider = function(id, options) {
        var defaults = {
            range: [ 0, 100 ],
            start: 0,
            step: 1,
            slide: null
        };
        this.config = _.extend(defaults, options), this.events = {
            set: new Signal(),
            slide: new Signal()
        }, this.min = this.config.range[0], this.max = this.config.range[1];
        var original = document.getElementById(id) || id;
        this.el = original.cloneNode(), original.parentNode.replaceChild(this.el, original), 
        _.css(this.el, {
            position: "relative"
        }), this.handle = _.append(this.el), _.addClass(this.handle, "handle"), _.css(this.handle, {
            position: "absolute"
        }), this.toggleLock = _.bind(this.toggleLockFn, this), this.changeOnMove = _.bind(this.changeOnMoveFn, this), 
        _.on(this.el, "mousedown touchstart", this.toggleLock), _.on(this.handle, "mousedown touchstart", this.toggleLock), 
        this.events.set.on(_.bind(this.render, this)), this.set(this.config.start), this.config.slide && this.events.slide.on(this.config.slide);
    };
    C.prototype.stopSelect = function() {
        return !1;
    }, C.prototype.toggleLockFn = function(e) {
        e = e || window.event, this.changeOnMove(e);
        var fn = /mousedown|touchstart/.test(e.type) ? "on" : "off";
        _[fn](document, "mouseup touchend", this.toggleLock), _[fn](document, "mousemove touchmove", this.changeOnMove), 
        _[fn](document, "selectstart", this.stopSelect);
    }, C.prototype.changeOnMoveFn = function(e) {
        e = e || window.event, e.stopPropagation && e.stopPropagation(), e.preventDefault && e.preventDefault();
        var x = _.getPointer(e).x - _.getOffset(this.el).left, mapped = _.map(x, 0, this.el.clientWidth, this.min, this.max), old = this.value;
        this.set(mapped), old != this.value && this.events.slide.trigger(this.value);
    }, C.prototype.render = function(val) {
        var per = _.map(val, this.min, this.max, 0, 100);
        _.css(this.handle, {
            left: per + "%"
        });
    }, C.prototype.val = function(val) {
        return void 0 === val ? this.value : void this.set(val);
    }, C.prototype.set = function(mapped) {
        var clamped = _.clamp(mapped, this.min, this.max), rounded = _.round(clamped, this.config.step);
        rounded != this.value && (this.value = rounded, this.events.set.trigger(this.value));
    };
    var Signal = function() {
        var callbacks = [];
        this.on = function(fn, c) {
            return callbacks.push({
                fn: fn,
                c: c
            }), this;
        }, this.trigger = function() {
            for (var args = [].slice.call(arguments), i = 0; i < callbacks.length; i++) callbacks[i].fn.apply(callbacks[i].c || this, args);
            return this;
        }, this.off = function(fn) {
            if (fn) for (var i = 0; i < callbacks.length; i++) callbacks[i] === fn && (callbacks.splice(i, 1), 
            i--); else callbacks = [];
            return this;
        };
    };
}(window, document);