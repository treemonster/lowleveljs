!function() {
    "use strict";
    function E(t) {
        return (E = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t;
        } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
        })(t);
    }
    function _() {
        _ = function() {
            return a;
        };
        var a = {}, t = Object.prototype, u = t.hasOwnProperty, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", e = r.asyncIterator || "@@asyncIterator", o = r.toStringTag || "@@toStringTag";
        function i(t, r, e) {
            return Object.defineProperty(t, r, {
                value: e,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }), t[r];
        }
        try {
            i({}, "");
        } catch (t) {
            i = function(t, r, e) {
                return t[r] = e;
            };
        }
        function c(t, r, e, n) {
            var o, i, a, c, r = r && r.prototype instanceof s ? r : s, r = Object.create(r.prototype), n = new x(n || []);
            return r._invoke = (o = t, i = e, a = n, c = "suspendedStart", function(t, r) {
                if ("executing" === c) throw new Error("Generator is already running");
                if ("completed" === c) {
                    if ("throw" === t) throw r;
                    return L();
                }
                for (a.method = t, a.arg = r; ;) {
                    var e = a.delegate;
                    if (e) {
                        e = function t(r, e) {
                            var n = r.iterator[e.method];
                            if (void 0 === n) {
                                if (e.delegate = null, "throw" === e.method) {
                                    if (r.iterator.return && (e.method = "return",
                                    e.arg = void 0, t(r, e), "throw" === e.method)) return h;
                                    e.method = "throw", e.arg = new TypeError("The iterator does not provide a 'throw' method");
                                }
                                return h;
                            }
                            n = f(n, r.iterator, e.arg);
                            if ("throw" === n.type) return e.method = "throw", e.arg = n.arg,
                            e.delegate = null, h;
                            n = n.arg;
                            return n ? n.done ? (e[r.resultName] = n.value, e.next = r.nextLoc,
                            "return" !== e.method && (e.method = "next", e.arg = void 0),
                            e.delegate = null, h) : n : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"),
                            e.delegate = null, h);
                        }(e, a);
                        if (e) {
                            if (e === h) continue;
                            return e;
                        }
                    }
                    if ("next" === a.method) a.sent = a._sent = a.arg; else if ("throw" === a.method) {
                        if ("suspendedStart" === c) throw c = "completed", a.arg;
                        a.dispatchException(a.arg);
                    } else "return" === a.method && a.abrupt("return", a.arg);
                    c = "executing";
                    e = f(o, i, a);
                    if ("normal" === e.type) {
                        if (c = a.done ? "completed" : "suspendedYield", e.arg === h) continue;
                        return {
                            value: e.arg,
                            done: a.done
                        };
                    }
                    "throw" === e.type && (c = "completed", a.method = "throw",
                    a.arg = e.arg);
                }
            }), r;
        }
        function f(t, r, e) {
            try {
                return {
                    type: "normal",
                    arg: t.call(r, e)
                };
            } catch (t) {
                return {
                    type: "throw",
                    arg: t
                };
            }
        }
        a.wrap = c;
        var h = {};
        function s() {}
        function l() {}
        function p() {}
        var r = {}, y = (i(r, n, function() {
            return this;
        }), Object.getPrototypeOf), y = y && y(y(b([]))), d = (y && y !== t && u.call(y, n) && (r = y),
        p.prototype = s.prototype = Object.create(r));
        function v(t) {
            [ "next", "throw", "return" ].forEach(function(r) {
                i(t, r, function(t) {
                    return this._invoke(r, t);
                });
            });
        }
        function m(a, c) {
            var r;
            this._invoke = function(e, n) {
                function t() {
                    return new c(function(t, r) {
                        !function r(t, e, n, o) {
                            var i, t = f(a[t], a, e);
                            if ("throw" !== t.type) return (e = (i = t.arg).value) && "object" == E(e) && u.call(e, "__await") ? c.resolve(e.__await).then(function(t) {
                                r("next", t, n, o);
                            }, function(t) {
                                r("throw", t, n, o);
                            }) : c.resolve(e).then(function(t) {
                                i.value = t, n(i);
                            }, function(t) {
                                return r("throw", t, n, o);
                            });
                            o(t.arg);
                        }(e, n, t, r);
                    });
                }
                return r = r ? r.then(t, t) : t();
            };
        }
        function g(t) {
            var r = {
                tryLoc: t[0]
            };
            1 in t && (r.catchLoc = t[1]), 2 in t && (r.finallyLoc = t[2], r.afterLoc = t[3]),
            this.tryEntries.push(r);
        }
        function w(t) {
            var r = t.completion || {};
            r.type = "normal", delete r.arg, t.completion = r;
        }
        function x(t) {
            this.tryEntries = [ {
                tryLoc: "root"
            } ], t.forEach(g, this), this.reset(!0);
        }
        function b(r) {
            if (r) {
                var e, t = r[n];
                if (t) return t.call(r);
                if ("function" == typeof r.next) return r;
                if (!isNaN(r.length)) return e = -1, (t = function t() {
                    for (;++e < r.length; ) if (u.call(r, e)) return t.value = r[e],
                    t.done = !1, t;
                    return t.value = void 0, t.done = !0, t;
                }).next = t;
            }
            return {
                next: L
            };
        }
        function L() {
            return {
                value: void 0,
                done: !0
            };
        }
        return i(d, "constructor", l.prototype = p), i(p, "constructor", l), l.displayName = i(p, o, "GeneratorFunction"),
        a.isGeneratorFunction = function(t) {
            t = "function" == typeof t && t.constructor;
            return !!t && (t === l || "GeneratorFunction" === (t.displayName || t.name));
        }, a.mark = function(t) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(t, p) : (t.__proto__ = p,
            i(t, o, "GeneratorFunction")), t.prototype = Object.create(d), t;
        }, a.awrap = function(t) {
            return {
                __await: t
            };
        }, v(m.prototype), i(m.prototype, e, function() {
            return this;
        }), a.AsyncIterator = m, a.async = function(t, r, e, n, o) {
            void 0 === o && (o = Promise);
            var i = new m(c(t, r, e, n), o);
            return a.isGeneratorFunction(r) ? i : i.next().then(function(t) {
                return t.done ? t.value : i.next();
            });
        }, v(d), i(d, o, "Generator"), i(d, n, function() {
            return this;
        }), i(d, "toString", function() {
            return "[object Generator]";
        }), a.keys = function(e) {
            var t, n = [];
            for (t in e) n.push(t);
            return n.reverse(), function t() {
                for (;n.length; ) {
                    var r = n.pop();
                    if (r in e) return t.value = r, t.done = !1, t;
                }
                return t.done = !0, t;
            };
        }, a.values = b, x.prototype = {
            constructor: x,
            reset: function(t) {
                if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0,
                this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0,
                this.tryEntries.forEach(w), !t) for (var r in this) "t" === r.charAt(0) && u.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = void 0);
            },
            stop: function() {
                this.done = !0;
                var t = this.tryEntries[0].completion;
                if ("throw" === t.type) throw t.arg;
                return this.rval;
            },
            dispatchException: function(e) {
                if (this.done) throw e;
                var n = this;
                function t(t, r) {
                    return i.type = "throw", i.arg = e, n.next = t, r && (n.method = "next",
                    n.arg = void 0), !!r;
                }
                for (var r = this.tryEntries.length - 1; 0 <= r; --r) {
                    var o = this.tryEntries[r], i = o.completion;
                    if ("root" === o.tryLoc) return t("end");
                    if (o.tryLoc <= this.prev) {
                        var a = u.call(o, "catchLoc"), c = u.call(o, "finallyLoc");
                        if (a && c) {
                            if (this.prev < o.catchLoc) return t(o.catchLoc, !0);
                            if (this.prev < o.finallyLoc) return t(o.finallyLoc);
                        } else if (a) {
                            if (this.prev < o.catchLoc) return t(o.catchLoc, !0);
                        } else {
                            if (!c) throw new Error("try statement without catch or finally");
                            if (this.prev < o.finallyLoc) return t(o.finallyLoc);
                        }
                    }
                }
            },
            abrupt: function(t, r) {
                for (var e = this.tryEntries.length - 1; 0 <= e; --e) {
                    var n = this.tryEntries[e];
                    if (n.tryLoc <= this.prev && u.call(n, "finallyLoc") && this.prev < n.finallyLoc) {
                        var o = n;
                        break;
                    }
                }
                var i = (o = o && ("break" === t || "continue" === t) && o.tryLoc <= r && r <= o.finallyLoc ? null : o) ? o.completion : {};
                return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o.finallyLoc,
                h) : this.complete(i);
            },
            complete: function(t, r) {
                if ("throw" === t.type) throw t.arg;
                return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg,
                this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r),
                h;
            },
            finish: function(t) {
                for (var r = this.tryEntries.length - 1; 0 <= r; --r) {
                    var e = this.tryEntries[r];
                    if (e.finallyLoc === t) return this.complete(e.completion, e.afterLoc),
                    w(e), h;
                }
            },
            catch: function(t) {
                for (var r = this.tryEntries.length - 1; 0 <= r; --r) {
                    var e, n, o = this.tryEntries[r];
                    if (o.tryLoc === t) return "throw" === (e = o.completion).type && (n = e.arg,
                    w(o)), n;
                }
                throw new Error("illegal catch attempt");
            },
            delegateYield: function(t, r, e) {
                return this.delegate = {
                    iterator: b(t),
                    resultName: r,
                    nextLoc: e
                }, "next" === this.method && (this.arg = void 0), h;
            }
        }, a;
    }
    function u(t, r, e, n, o, i, a) {
        try {
            var c = t[i](a), u = c.value;
        } catch (t) {
            return void e(t);
        }
        c.done ? r(u) : Promise.resolve(u).then(n, o);
    }
    function t(c) {
        return function() {
            var t = this, a = arguments;
            return new Promise(function(r, e) {
                var n = c.apply(t, a);
                function o(t) {
                    u(n, r, e, o, i, "next", t);
                }
                function i(t) {
                    u(n, r, e, o, i, "throw", t);
                }
                o(void 0);
            });
        };
    }
    function e() {
      console.log(111)
        return (e = t(_().mark(function t(r) {
          console.log(">>", t)
            return _().wrap(function(t) {
                for (;;) switch (t.prev = t.next) {
                  case 0:
                    console.log(">>", r);

                  case 1:
                  case "end":
                    return t.stop();
                }
            }, t);
        })), console.log(444), e).apply(this, arguments);
    }
    var r;
    console.log(222)
    r = t(_().mark(function t(r) {
        return _().wrap(function(t) {
            for (;;) switch (t.prev = t.next) {
              case 0:
                !function() {
                    e.apply(this, arguments);
                }(2);

              case 1:
              case "end":
                return t.stop();
            }
        }, t);
    })),
    console.log(333), function() {
        r.apply(this, arguments);
    }();
}();
