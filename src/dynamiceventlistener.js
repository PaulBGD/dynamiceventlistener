(function (global, document) {
    function listen(selector, event, listener) {
        check(Object.prototype.toString.call(listener) === '[object Function]', 'Listener must be a function');
        check(typeof event === 'string', 'Event must be a string');
        check(typeof selector === 'string', 'Selector must be a string');

        var select = fastestSelector(selector);
        var last = [];
        setInterval(function updateListeners() {
            var elements = select();
            var lastLength = last.length;
            var difference = lastLength != elements.length;
            if (!difference) {
                for (var i = 0; i < lastLength; i++) {
                    if (elements[i] != last[i]) {
                        difference = true;
                        break;
                    }
                }
            }
            if (difference) {
                forEach(elements, function (element) {
                    if (indexOf(last, element) === -1) {
                        if (element.attachEvent) {
                            element.attachEvent(event, listener);
                        } else {
                            element.addEventListener(event, listener, false);
                        }
                    }
                });
                last = Array.prototype.slice.call(elements, 0);
            }
        }, 200);
    }

    function forEach(arr, func) {
        if (arr.forEach) {
            return arr.forEach(func);
        }
        var length = arr.length;
        while (length--) {
            func(arr[length]);
        }
    }

    /**
     * @license MIT
     * @author MDN
     */
    function indexOf(arr, searchElement, fromIndex) {
        if (arr.indexOf) {
            return arr.indexOf(searchElement, fromIndex);
        }
        var k;
        if (arr == null) {
            throw new TypeError('"arr" is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = +fromIndex || 0;
        if (Math.abs(n) === Infinity) {
            n = 0;
        }
        if (n >= len) {
            return -1;
        }
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    }

    function fastestSelector(selector) {
        if (selector.indexOf(' ') === -1) {
            if (selector.charAt(0) === '#' && selector.indexOf(' ') === -1) {
                var cut = selector.substring(1, selector.length);
                return function () {
                    return [document.getElementById(cut)];
                };
            } else if (selector.charAt(0) === '.' && selector.indexOf(' ') === -1) {
                cut = selector.substring(1, selector.length);
                return function () {
                    return document.getElementsByClassName(cut);
                };
            } else {
                return function () {
                    return document.getElementsByTagName(selector);
                };
            }
        }
        return function () {
            return document.querySelectorAll(selector);
        };
    }

    function check(bool, error) {
        if (!bool) {
            throw new Error(error);
        }
    }

    if (typeof module !== 'undefined' && module.exports) {
        module['exports'] = listen;
    } else if (typeof define !== 'undefined') {
        define(['dynamiceventlistener'], function() {
            return listen;
        });
    } else {
        global['addDynamicEventListener'] = listen;
    }

})(this, document);