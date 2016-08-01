/*
 block.js v2.0
 (c) 2016 Anuv Gupta [http://anuvgupta.tk/block.js]
 License: MIT
*/

var __blocks = {  };
var __$block = false;
try { __$block = (typeof jQuery == 'function') || (typeof window.jQuery == 'function'); }
catch (err) { __$block = false; }
var Block;
Block = function () {
    // declare/initialize private instance fields
    var block;
    var addblock;
    var element;
    var events = { };
    var type = arguments[0];
    var marking = arguments[1];
    var parent;
    var children = { };
    // if new blocktype is being declared, add callbacks to __blocks object and return
    if (marking != undefined && marking != null && typeof marking == 'function') {
        __blocks[type] = { };
        __blocks[type].create = arguments[1];
        if (arguments[2] != undefined && arguments[2] != null && typeof arguments[2] == 'function')
            __blocks[type].load = arguments[2];
        return true;
    }
    // convenience methods
    var isType = function (d, t) { // match types
        if (t == 'null') return (d == null);
        else if (t == '=null') return (d === null);
        else if (t == 'undefined') return (d == undefined);
        else if (d === null || d == undefined) return false;
        else if (t == 'string') return ((typeof d === 'string') || (d instanceof String));
        else if (t == 'element') return (isType(d, 'object') && (d instanceof Node) && (d instanceof Element));
        else if (t == 'array') return ((typeof d === 'array') || (d instanceof Array));
        else if (t == 'object') return ((typeof d == 'object') || (d instanceof Object));
        else if (t == 'int') return (d === parseInt(d, 10) && !isNaN(d));
        else return (typeof d == t);
    };
    var node = function (t) { return document.createElement(t); }; // create element
    var inArr = function (e, a) { return a.indexOf(e.trim().toLowerCase()) > -1; }; // search array
    var setData = function (object, path, value) { // recursively set field within object
        if (path.length == 1) {
            object[path[0]] = value;
            return object;
        } else if (path.length > 1)
            return setData(object[path[0]], path.slice(1), value);
    };
    var getData = function (object, path) { // recursively get field from within object
        if (path.length == 1) return object[path[0]]
        else if (path.length > 1)
            return getData(object[path[0]], path.slice(1));
    };
    var parseBlock = function (data, indentation) { // parse blockfile to object
        var blockdata = { }; // declare/init blockdata object
        var path = []; // declare/init path array
        var lines = data.split('\n'); // split each line into array
        for (i in lines) { // for each line
            var line = lines[i]; // get line
            var first = line.search(/\S/); // get position of first non-space char in line
            if (first == -1 || line.substring(first, first + 2) == '//') continue; // if line contains only space, or starts with comment, go to next line
            line = line.substring(0, first) + line.substring(first).trim(); // trim extra space off right end of line
            var indents = (line.match(new RegExp(indentation, 'g')) || []).length; // count indentation level of line
            line = line.trim(); // remove indentation
            var space = line.search(/ /); // find first space in line (end of key name)
            if (space == -1) { // if there is no space, key holds object value
                var key = line; // since the object value is not on the line, the line is the key name
                var value = { }; // the value of this key is an object, declare/initialize
            } else { //if there is a space, key holds string value
                var key = line.substring(0, space); // get the key (before the first space)
                var value = line.substring(space + 1); //get the value (after the first space)
            }
            // each indent on the line represents a level in the blockdata object, thus
            path = path.slice(0, indents); // remove that many levels from last path (position in blockdata object)
            path.push(key); // add key to current level to generate the current path
            /* example
                car
                    details
                        make Lamborghini
                        model Reventon
                    color chrome
                    owner Joe
                driver
                    name Joe

                car @ indent level 0: base level key, add to base of blockdata object; current path: ['car']
                details @ indent level 1: key, add to car object; current path: ['car' ,'details']
                make @ indent level 2: key:value pair, add to details object; current path: ['car', 'details', 'make']
                model @ indent level 2: key:value pair, add to details object; current path: ['car', 'details', 'model']
                color @ indent level 1: key:value pair, get first element of path (car), add to car object; current path: ['car', 'color']
                driver @ indent level 0: base level key, get 0 element of path (blockdata), add to base of blockdata object; current path: ['driver']
                name @ indent level 1: key:value pair, add to driver obejct; current path: ['driver', 'name']
            */
            setData(blockdata, path, value); // use recursive convenience function to modify blockdata object accordingly
        }
        return blockdata; // return the fully formed blockdata object
    };
    // use convenience method isType to prevent type errors with optional parameters
    if (isType(type, 'null') || isType(type, 'undefined')) type = 'block';
    if (isType(marking, 'null') || isType(marking, 'undefined')) {
        marking = Math.floor((Math.random() * 10000) + 1);
        while (isType(children[marking], 'object')) marking = Math.floor((Math.random() * 1000) + 1);
        marking = '_' + marking.toString();
    }

    // declare/initialize public block object
    block = {
        block: true, // block is a block
        add: function () { // add block to current block (or block specified by setAdd)
            var args = [].slice.call(arguments);
            if (!isType(args[0], 'undefined') && !isType(args[0], 'null') && !args[0].block)
                var b = Block.apply(Block, args);
            else var b = args[0];
            children[b.mark()] = b;
            b.parent(this);
            if (isType(addblock, 'object') && addblock.block) addblock.add(b);
            else element.appendChild(b.node());
            return this; // chain
        },
        setAdd: function (b) { // set block to which aadd method should add blocks
            if (isType(b, 'object') && b.block) addblock = b;
            return this; // chain
        },
        type: function () { // set or get type of block
            var t = arguments[0];
            if (isType(t, 'string')) {
                if (!isType(__blocks[t], 'null') && !isType(__blocks[t], 'undefined')) type = t;
            } else return type;
            return this; // chain
        },
        class: function () { // add to or get current block's DOM class
            if (isType(arguments[0], 'string')) {
                element.className += ' ' + arguments[0];
                return this; // chain
            } else return element.className;
        },
        id: function () { // set or get current block's DOM id
            if (isType(arguments[0], 'string')) {
                element.id = arguments[0];
                return this; // chain
            } else return element.id;
        },
        mark: function () { // set or get current block's marking (id in block tree)
            var m = arguments[0];
            if (isType(m, 'string')) {
                if (m == 'css')
                    console.warn('[BLOCK] cannot mark as \'' + m + '\' (reserved)');
                else marking = m;
                return this; // chain
            } else return marking;
        },
        attribute: function (a, v) { // set or get attribute of current block
            var v = arguments[1];
            if (isType(v, 'string')) {
                element.setAttribute(a, v);
                return this; // chain
            } else return element.getAttribute(a);
        },
        css: function (p) {
            if (isType(p, 'object')) {
                for (prop in p) {
                    if (p.hasOwnProperty(prop) && isType(p[prop], 'string'))
                        element.style[prop] = p[prop];
                }
            } else if (isType(p, 'string')) {
                v = arguments[1];
                if (isType(v, 'string')) element.style[p] = v;
                else return element.style[p];
            }
            return this;
        },
        on: function (e, f) {
            if (isType(e, 'string') && isType(f, 'function')) {
                if (isType(arguments[0], 'string')) events[e + '_' + arguments[0]] = f;
                element.addEventListener(e, f);
            }
            return this;
        },
        off: function (e, id) {
            var f = events[e + '_' + id];
            if (isType(f, 'function')) element.removeEventListener(e, f);
            return this;
        },
        child: function (n) {
            if (isType(n, 'string')) {
                if (n.includes('/')) return children[n.substring(0, n.indexOf('/'))].child(n.substring(n.indexOf('/') + 1));
                else if(!isType(children[n], 'null') && !isType(children[n], 'undefined')) return children[n];
                else return null;
            } else return null;
        },
        parent: function () {
            var p = arguments[0];
            if (isType(p, 'object') && p.block && isType(parent, 'undefined') && isType(parent, 'null')) {
                parent = p;
                return this; // chain
            } else return parent;
        },
        node: function () { // get current block's node (DOM element)
            return element;
        },
        fill: function (target) { // fill DOM element with contents of current block
            if (isType(target, 'string')) target = document.querySelector(target);
            else if (isType(target, 'element')) {
                target.innerHTML = '';
                target.appendChild(element);
            }
            return this; // chain
        },
        $: function () { // jQuery the block's DOM element if jQuery present
            if (__$block) {
                var block = this;
                var $ = jQuery(element);
                $.block = function () { return block; };
                return $;
            } else console.warn('jQuery not detected');
        },
        data: function (blockdata) { // load blockdata into current block and its children
            var data = { };
            var style = { };
            for (key in blockdata) {
                if (blockdata.hasOwnProperty(key)) {
                    if (key == 'css') {
                        var css = blockdata.css;
                        for (property in css) {
                            if (css.hasOwnProperty(property)) style[property] = css[property];
                        }
                        delete blockdata.css;
                    } else {
                        if (isType(blockdata[key], 'object') && isType(children[key], 'object'))
                            children[key].data(blockdata[key]);
                        else data[key] = blockdata[key];
                    }
                }
            }

            if (isType(data, 'string') || isType(data, 'int')) data = { value: data };
            else if (isType(data, 'null') || !isType(data, 'object')) data = { };

            var reserved = [];
            if (type == 'block') {
                // console.log('block');
            } else if (!isType(__blocks[type], 'undefined') && !isType(__blocks[type], 'null')) {
                var getData = function (key) {
                    if (isType(data[key], 'undefined') || isType(data[key], 'null')) return null;
                    else {
                        reserved.push(key);
                        return data[key];
                    }
                };

                __blocks[type].load(this, getData, style);
            }
            for (property in style) {
                if (style.hasOwnProperty(property)) element.style[property] = style[property];
            }
            for (key in data) {
                if (data.hasOwnProperty(key) && !inArr(key, reserved)) element.setAttribute(key, data[key]);
            }
        },
        load: function (f, p) { // load blockdata file from different sources *!* LINK IMPORT MEANT TO BE ADDED NEXT *!*
            var b = this;
            var next = function (data) { // code to run when blockdata is retrieved
                data = data.replace(/\r\n|\r|\n/g, '\n'); // clean up carriage returns
                var indentation = data.substring(0, data.indexOf('*')); // find indentation
                // parse raw blockdata into object and load into current block
                var blockdata = parseBlock(data.substring(data.indexOf('*') + 2), indentation);
                b.data(blockdata[marking]);
                if (isType(f, 'function')) f(b);
            };
            var g = arguments[2]; // use ajax to get raw blockdata
            var a = arguments[3]; // use asynchronous request
            if (a == null || a == undefined) a = true; // default to async
            if (isType(g, 'string') && g.toLowerCase() === 'jquery') { // if jQuery request desired
                if (__$block) { // if jQuery present
                    jQuery.ajax({ // use jQuery ajax
                        url: f + '.block',
                        type: 'GET',
                        async: p,
                        success: function (d) { next(d); }
                    });
                } else console.warn('jQuery not detected');
            } else if (g === true) { // if normal request desired
                var xhr; // use xhr object
                if (window.XMLHttpRequest) xhr = new XMLHttpRequest();
                else xhr = new ActiveXObject('Microsoft.XMLHTTP'); // IE support
                xhr.onreadystatechange = function () { // when data recieved, load blockdata
                    if (xhr.readyState == 4 && xhr.status == 200) next(xhr.responseText);
                };
                xhr.open('GET', p + '.block', a);
                xhr.send();
            } else next(customBlockData[p]); //if ajax not wanted, get from local file
            return this; // chain
        }
    };

    // construct blocks without data
    if (type == 'block') { // default block
        element = node('div');
        element.className = 'block';
        var content = Block('div').class('content');
        block.setAdd(content);
        block.cssContent = function () {
            var args = [].slice.call(arguments);
            content.css.apply(content, args);
            return block; // chain
        };
        element.appendChild(content.node());
    } else { // custom defined blocks
        if (__blocks[type] != null) {
            block = __blocks[type].create();
            block.type(type);
            block.mark(marking);
        } else element = node(type);
    }
    return block;
};
// add default block style to document
var s = document.createElement('style');
s.type = 'text/css';
s.innerHTML = '.block { ' +
    	'width: 100%; ' +
    	'height: 100%; ' +
    	'display: table; ' +
    	'text-align: center; ' +
    '} ' +
    '.block .content { ' +
    	'display: table-cell; ' +
    	'vertical-align: middle; ' +
        'text-align: center; ' +
        'margin: 0 auto; ' +
    '}';
document.getElementsByTagName('head')[0].appendChild(s);
s = null;
