!function(a, b) {
    var c = {
        append: function(a, c) {
            var d = b.createElement(c || "div");
            return a.appendChild(d);
        },
        addClass: function(a, b) {
            -1 === a.className.indexOf(b) && (a.className += " " + b);
        },
        bind: function(a, b) {
            return function() {
                a.apply(b, [].slice.call(arguments));
            };
        },
        on: function(a, b, c) {
            if (a) for (var d = b.split(" "), e = 0; e < d.length; e++) a.attachEvent ? a.attachEvent("on" + d[e], c) : a.addEventListener(d[e], c, !1);
        },
        extend: function(a, b) {
            for (var c in b) a[c] = b[c];
            return a;
        },
        css: function(a, b) {
            if (a) for (var c in b) if ("undefined" != typeof b[c]) {
                if ("number" == typeof b[c] && "zIndex" != c && "opacity" != c) {
                    if (isNaN(b[c])) continue;
                    b[c] = Math.ceil(b[c]) + "px";
                }
                try {
                    a.style[c] = b[c];
                } catch (d) {}
            }
        },
        getPointer: function(a) {
            var c = a.pageX, d = a.pageY;
            if (a.touches && (c = a.touches[0].pageX, d = a.touches[0].pageY), null == c) {
                var e = b.documentElement, f = b.body;
                c = a.clientX + (e.scrollLeft || f.scrollLeft || 0) - (e.clientLeft || f.clientLeft || 0), 
                d = a.clientY + (e.scrollTop || f.scrollTop || 0) - (e.clientTop || f.clientTop || 0);
            }
            return {
                x: c,
                y: d
            };
        },
        getOffset: function(c) {
            var d = b.documentElement, e = c.getBoundingClientRect(c);
            return {
                top: e.top + (a.pageYOffset || d.scrollTop) - (d.clientTop || 0),
                left: e.left + (a.pageXOffset || d.scrollLeft) - (d.clientLeft || 0)
            };
        },
        round: function(a, b) {
            return b = b || 1, Math.round(a / b) * b;
        },
        clamp: function(a, b, c) {
            return b > a ? b : a > c ? c : a;
        },
        lerp: function(a, b, c) {
            return b + (c - b) * a;
        },
        norm: function(a, b, c) {
            return (a - b) / (c - b);
        },
        map: function(a, b, d, e, f) {
            return c.lerp(c.norm(a, b, d), e, f);
        }
    }, d = a.SkinnySlider = function(a, d) {
        var f = {
            range: [ 0, 100 ],
            start: 0,
            step: 1,
            slide: null
        };
        this.config = c.extend(f, d), this.events = {
            slide: new e()
        }, this.lock = !1, this.value = null, this.min = this.config.range[0], this.max = this.config.range[1], 
        this.el = b.getElementById(a), c.css(this.el, {
            position: "relative"
        }), this.handle = c.append(this.el), c.addClass(this.handle, "handle"), c.css(this.handle, {
            position: "absolute"
        });
        var g = c.bind(this.lockOnMouse, this);
        c.on(this.el, "mousedown touchstart", g), c.on(this.handle, "mousedown touchstart", g), 
        c.on(b, "mouseup touchend", g), c.on(b, "mousemove touchmove", c.bind(this.changeOnMove, this)), 
        this.events.slide.on(c.bind(this.render, this)), this.config.slide && this.events.slide.on(this.config.slide), 
        this.set(this.config.start);
    };
    d.prototype.lockOnMouse = function(b) {
        b = b || a.event, b.stopPropagation && b.stopPropagation(), b.preventDefault && b.preventDefault(), 
        this.lock = /mousedown|touchstart/.test(b.type), this.changeOnMove(b);
    }, d.prototype.changeOnMove = function(b) {
        if (b = b || a.event, this.lock) {
            b.stopPropagation && b.stopPropagation(), b.preventDefault && b.preventDefault();
            var d = c.getPointer(b).x - c.getOffset(this.el).left, e = c.map(d, 0, this.el.clientWidth, this.min, this.max);
            this.set(e);
        }
    }, d.prototype.render = function(a) {
        var b = c.map(a, this.min, this.max, 0, 100);
        c.css(this.handle, {
            left: b + "%"
        });
    }, d.prototype.val = function(a) {
        return void 0 === a ? this.value : void this.set(a);
    }, d.prototype.set = function(a) {
        var b = c.clamp(a, this.min, this.max), d = c.round(b, this.config.step);
        d != this.value && (this.events.slide.trigger(d), this.value = d);
    };
    var e = function() {
        var a = [];
        this.on = function(b, c) {
            return a.push({
                fn: b,
                c: c
            }), this;
        }, this.trigger = function() {
            for (var b = [].slice.call(arguments), c = 0; c < a.length; c++) a[c].fn.apply(a[c].c || this, b);
            return this;
        }, this.off = function(b) {
            if (b) for (var c = 0; c < a.length; c++) a[c] === b && (a.splice(c, 1), c--); else a = [];
            return this;
        };
    };
}(window, document);