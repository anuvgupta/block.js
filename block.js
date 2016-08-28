/*
 block.js v2.0
 (c) 2016 Anuv Gupta [http://anuv.me/block.js]
 License: MIT
*/

var __blocks = {  };
var __$block = false;
try { __$block = (typeof jQuery == 'function') || (typeof window.jQuery == 'function'); }
catch (error) { __$block = false; }
var Block;
Block = function () {
    // declare/initialize private instance fields
    var block;
    var addblock;
    var __addblock;
    var element;
    var events = { };
    var customEvents = { };
    var type = arguments[0];
    var marking = arguments[1];
    var parent;
    var __parent;
    var children = { };
    var __children = { };
    var keys = {
        __blockdata: []
    };
    // if new blocktype is being declared, add callbacks to __blocks object and return
    if (marking != undefined && marking != null && typeof marking == 'function') {
        __blocks[type] = { };
        __blocks[type].create = arguments[1];
        if (arguments[2] != undefined && arguments[2] != null && typeof arguments[2] == 'function')
            __blocks[type].load = arguments[2];
        return true;
    }
    // convenience methods
    var isType = function (val, type) { // match types
        if (type == 'null') return (val == null);
        else if (type == '=null') return (val === null);
        else if (type == 'undefined') return (val == undefined);
        else if (val === null || val == undefined) return false;
        else if (type == 'string') return ((typeof val === 'string') || (val instanceof String));
        else if (type == 'element') return (isType(val, 'object') && (val instanceof Node) && (val instanceof Element));
        else if (type == 'array') return ((typeof val === 'array') || (val instanceof Array));
        else if (type == 'object') return ((typeof val == 'object') || (val instanceof Object));
        else if (type == 'int') return (val === parseInt(val, 10) && !isNaN(val));
        else return (typeof val == type);
    };
    var node = function (tag) { // create element
        return document.createElement(tag);
    };
    var inArr = function (element, array) { // search array
        return array.indexOf(element.trim().toLowerCase()) > -1;
    };
    var setData = function (object, path, value) { // recursively set field within object
        if (path.length == 1) {
            object[path[0]] = value;
            return object;
        } else if (path.length > 1)
            return setData(object[path[0]], path.slice(1), value);
    };
    var getData = function (object, path) { // recursively get field from within object
        if (path.length == 1)
            return object[path[0]]
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
            if (first == -1 || line.substring(first, first + 2) == '//') // if line contains only space, or starts with comment
                continue; // skip go to next line
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
    if (isType(type, 'null') || isType(type, 'undefined'))
        type = 'block';
    if (marking == 1) marking = type;
    else if (isType(marking, 'null') || isType(marking, 'undefined') || marking == 0) {
        marking = Math.floor((Math.random() * 10000) + 1);
        while (isType(children[marking], 'object')) marking = Math.floor((Math.random() * 1000) + 1);
        marking = '_' + marking.toString();
    }

    // declare/initialize public block object
    block = {
        block: true, // block is a block
        add: function () { // add block to current block (or block specified by setAdd)
            var $args = [].slice.call(arguments);
            var $before = null;
            if (!isType($args[0], 'undefined') && !isType($args[0], 'null') && $args[0].block !== true) {
                if ($args.length >= 3) {
                    $before = $args[2];
                    $args = $args.slice(0, 2);
                }
                var $block = Block.apply(Block, $args);
            } else {
                if ($args.length >= 2) {
                    $before = $args[1];
                    $args = $args.slice(0, 1);
                }
                var $block = $args[0];
            }
            children[$block.mark()] = $block;
            $block.parent(this);
            if (isType(addblock, 'object') && addblock.block)
                addblock.add($block, $before);
            else {
                if (isType($before, 'string') && isType(children[$before], 'object') && children[$before].block)
                    element.insertBefore($block.node(), children[$before].node());
                else element.appendChild($block.node());
            }
            return this; // chain
        },
        __add: function () { // add block to current block's ghost tree (or ghost block specified by __setAdd)
            var $args = [].slice.call(arguments);
            var $before = null;
            if (!isType($args[0], 'undefined') && !isType($args[0], 'null') && $args[0].block !== true) {
                if ($args.length >= 3) {
                    $before = $args[2];
                    $args = $args.slice(0, 2);
                }
                var $block = Block.apply(Block, $args);
            } else {
                if ($args.length >= 2) {
                    $before = $args[1];
                    $args = $args.slice(0, 1);
                }
                var $block = $args[0];
            }
            __children[$block.mark()] = $block;
            $block.__parent(this);
            if (isType(__addblock, 'object') && __addblock.block)
                addblock.__add($block, $before);
            else {
                if (isType($before, 'string') && isType(__children[$before], 'object') && __children[$before].block)
                    element.insertBefore($block.node(), __children[$before].node());
                else element.appendChild($block.node());
            }
            return this; // chain
        },
        setAdd: function ($block) { // set block to which add method should add blocks
            if (isType($block, 'object') && $block.block)
                addblock = $block;
            return this; // chain
        },
        __setAdd: function ($block) { // set block to which add method should add blocks
            if (isType($block, 'object') && $block.block)
                __addblock = $block;
            return this; // chain
        },
        remove: function () {
            $marking = arguments[0];
            if (isType($marking, 'null') && isType($marking, 'undefined') && isType(parent, 'null') && isType(parent, 'undefined'))
                parent.remove(marking);
            else if (isType($marking, 'string') && !isType(children[$marking], 'null')) {
                if (isType(addblock, 'object') && addblock.block)
                    addblock.node().removeChild(children[$marking].node());
                else element.removeChild(children[$marking].node());
                delete children[$marking];
            }
            return this;
        },
        __remove: function () {
            $marking = arguments[0];
            if (isType($marking, 'null') && isType($marking, 'undefined') && isType(__parent, 'null') && isType(__parent, 'undefined'))
                __parent.__remove(marking);
            else if (isType($marking, 'string') && !isType(__children[$marking], 'null')) {
                if (isType(__addblock, 'object') && __addblock.block)
                    __addblock.node().removeChild(__children[$marking].node());
                else element.removeChild(__children[$marking].node());
                delete __children[$marking];
            }
            return this;
        },
        empty: function () {
            for (var $marking in children)
                this.remove($marking);
            return this;
        },
        __empty: function () {
            for (var $marking in children)
                this.remove($marking);
            return this;
        },
        type: function () { // set or get type of block
            var $type = arguments[0];
            if (isType($type, 'string')) {
                if (!isType(__blocks[$type], 'null') && !isType(__blocks[$type], 'undefined'))
                    type = $type;
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
            var $marking = arguments[0];
            if (isType($marking, 'string')) {
                if ($marking == 'css')
                    console.warn('[BLOCK] cannot mark as \'' + $marking + '\' (reserved)');
                else marking = $marking;
                return this; // chain
            } else return marking;
        },
        attribute: function ($attribute) { // set or get attribute of current block
            var $value = arguments[1];
            if (isType($value, 'string')) {
                element.setAttribute($attribute, $value);
                return this; // chain
            } else return element.getAttribute($attribute);
        },
        css: function () { // set or get value of css property of current block
            var $property = arguments[0];
            if (isType($property, 'object')) {
                for ($p in $property) {
                    if ($property.hasOwnProperty($p) && isType($property[$p], 'string'))
                        element.style[$p] = $property[$p];
                }
            } else if (isType($property, 'string')) {
                $value = arguments[1];
                if (isType($value, 'string'))
                    element.style[$property] = $value;
                else return element.style[$property];
            } else {
                var $obj = { };
                var $cssSD = element.style;
                for ($prop in $cssSD) {
                    if ($cssSD.hasOwnProperty($prop) && $cssSD[$prop] != '' && !(!isNaN(parseFloat($prop)) && isFinite($prop)))
                        $obj[$prop] = $cssSD[$prop];
                }
                return $obj;
            }
            return this;
        },
        key: function ($key) {
            $data = arguments[1];
            if (isType($data, 'undefined') || isType($data, 'null')) {
                if (isType(keys[$key], 'undefined') || isType(keys[$key], 'null'))
                    keys[$key] = { };
                else return keys[$key];
            } else keys[$key] = $data;
            return this;
        },
        on: function ($type, $callback) { // set event handler on current block
            var $block = this;
            if (isType($type, 'string')) {
                if (isType($callback, 'function')) {
                    if (isType(arguments[2], 'string')) {
                        var $id = arguments[2];
                        var $name = $type + '_' + $id;
                        if (!isType(events[$type], 'object'))
                            events[$type] = { };
                        events[$type][$id] = $callback;
                        element.addEventListener($name, $callback, false);
                        events[$name] = function ($e) {
                            var $data = $e.detail;
                            if (isType($e.detail, 'null') || isType($e.detail, 'undefined'))
                                $block.on($type, $id);
                            else $block.on($type, $id, $data);
                        };
                        element.addEventListener($type, events[$name], false);
                    } else element.addEventListener($type, $callback, false);
                } else {
                    if(isType($callback, 'string'))
                        $name = $type + '_' + $callback;
                    else if (isType($callback, 'null') || isType($callback, 'undefined') || isType($callback, 'object'))
                        $name = $type;
                    $data = arguments[arguments.length - 1];
                    if (isType($data, 'null') || isType($data, 'undefined') || isType($data, 'string') || !isType($data, 'object'))
                        $data = { };
                    if (document.createEvent) {
                        $event = document.createEvent('CustomEvent');
                        $event.initCustomEvent($name, true, true, $data);
                        element.dispatchEvent($event);
                    } else {
                        $event = document.createEventObject();
                        $event.eventType = $name;
                        element.fireEvent('on' + $name, $event);
                    }
                }
            }
            return this;
        },
        off: function ($type, $id) { // remove event handler from current block by id
            var $callbackA = events[$type + '_' + $id];
            var $callbackB = null;
            if (!isType(events[$type], 'null') && !isType(events[$type], 'undefined'))
                $callbackB = events[$type][$id];
            if (isType($callbackA, 'function')) {
                events[$type + '_' + $id] = null;
                element.removeEventListener($type, $callbackA);
            }
            if (isType($callbackB, 'function')) {
                events[$type][$id] = null;
                element.removeEventListener($type, $callbackB);
            }
            return this;
        },
        child: function ($marking) { // [recursively] get child of current block by marking
            if (isType($marking, 'string')) {
                if ($marking.includes('/'))
                    return children[$marking.substring(0, $marking.indexOf('/'))].child($marking.substring($marking.indexOf('/') + 1));
                else if(!isType(children[$marking], 'null') && !isType(children[$marking], 'undefined'))
                    return children[$marking];
                else return null;
            } else return null;
        },
        children: function () {
            return children;
        },
        childCount: function () { // get number of children
            var $length = 0;
            for (var $k in children) $length++;
            return $length;
        },
        __child: function ($marking) { // [recursively] get child of current block by marking
            if (isType($marking, 'string')) {
                if ($marking.includes('/'))
                    return __children[$marking.substring(0, $marking.indexOf('/'))].__child($marking.substring($marking.indexOf('/') + 1));
                else if(!isType(__children[$marking], 'null') && !isType(__children[$marking], 'undefined'))
                    return __children[$marking];
                else return null;
            } else return null;
        },
        __children: function () {
            return __children;
        },
        __childCount: function () { // get number of children
            var $length = 0;
            for (var $k in __children) $length++;
            return $length;
        },
        sibling: function ($path) {
            if (parent != null && parent != undefined)
                return parent.child($path);
            return null;
        },
        siblings: function () {
            if (parent != null && parent != undefined)
                return parent.children();
            return null;
        },
        siblingCount: function () {
            if (parent != null && parent != undefined)
                return parent.childCount();
            return null;
        },
        __sibling: function ($path) {
            if (__parent != null && __parent != undefined)
                return __parent.__child($path);
            return null;
        },
        __siblings: function () {
            if (__parent != null && __parent != undefined)
                return __parent.__children();
            return null;
        },
        __siblingCount: function () {
            if (__parent != null && __parent != undefined)
                return __parent.__childCount();
            return null;
        },
        parent: function () { // get or set parent of current block (recursively within parents)
            var $parent = arguments[0];
            if (isType($parent, 'object') && $parent.block && isType(parent, 'undefined') && isType(parent, 'null')) {
                parent = $parent;
                return this; // chain
            } else if (isType($parent, 'int') && !isType(parent, 'undefined') && !isType(parent, 'null')) {
                if ($parent == 0) return parent;
                else return parent.parent($parent - 1);
            } else if (isType(parent, 'undefined') || isType(parent, 'null'))
                return null;
            else return parent;
        },
        __parent: function () {
            var $parent = arguments[0];
            if (isType($parent, 'object') && $parent.block && isType(__parent, 'undefined') && isType(__parent, 'null')) {
                __parent = $parent;
                return this; // chain
            } else if (isType($parent, 'int') && !isType(__parent, 'undefined') && !isType(__parent, 'null')) {
                if ($parent == 0) return __parent;
                else return __parent.__parent($parent - 1);
            } else if (isType(__parent, 'undefined') || isType(__parent, 'null'))
                return null;
            else return __parent;
        },
        node: function () { // get current block's node (DOM element)
            return element;
        },
        fill: function ($target) { // fill DOM element with contents of current block
            if (isType($target, 'object') && $target.block) {
                $target.empty();
                $target = $target.node();
            } else if (isType($target, 'string'))
                $target = document.querySelector($target);
            if (isType($target, 'element')) {
                $target.innerHTML = '';
                $target.appendChild(element);
            }
            return this; // chain
        },
        jQuery: function () { // jQuery the block's DOM element if jQuery present
            if (__$block) {
                var $block = this;
                return jQuery.extend(jQuery(element), {
                    block: function () {
                        return $block;
                    }
                });
            }
            console.warn('jQuery not detected');
            return null;
        },
        $: function () { // shortcut for jQuery function
            return this.jQuery();
        },
        data: function ($blockdata) { // load blockdata into current block and its children
            var $data = { };
            var $style = { };
            var $reservedAttributes = [];
            if (isType($blockdata, 'object')) {
                for ($key in $blockdata) {
                    if ($blockdata.hasOwnProperty($key)) {
                        if ($key == 'css') {
                            $style = $blockdata.css;
                            $reservedAttributes.push('css');
                        } else {
                            if (isType($blockdata[$key], 'object') && isType(children[$key], 'object')) {
                                children[$key].data($blockdata[$key]);
                                $reservedAttributes.push($key);
                            } else {
                                if (isType($blockdata[$key], 'object'))
                                    $reservedAttributes.push($key);
                                $data[$key] = $blockdata[$key];
                            }
                        }
                    }
                }
            } else if (isType($blockdata, 'string') || isType($blockdata, 'int'))
                $data = { val: $blockdata };
            else if (isType($blockdata, 'null') || !isType($blockdata, 'object'))
                $data = { };
            else return this;
            if ((type != 'block') && !isType(__blocks[type], 'undefined') && !isType(__blocks[type], 'null')) {
                var $getData = function ($key) {
                    if ($key == 'this')
                        return $data;
                    else if (isType($data[$key], 'undefined') || isType($data[$key], 'null'))
                        return null;
                    else {
                        $reservedAttributes.push($key);
                        return $data[$key];
                    }
                };
                var $getStyle = function ($property) {
                    if ($property == 'this')
                        return $style;
                    else if (isType($style[$property], 'undefined') || isType($style[$property], 'null'))
                        return null;
                    else return $style[$property];
                };
                __blocks[type].load(this, $getData, $getStyle);
            }
            for ($property in $style) {
                if ($style.hasOwnProperty($property))
                    element.style[$property] = $style[$property];
            }
            for ($key in $data) {
                if ($data.hasOwnProperty($key) && !inArr($key, $reservedAttributes))
                    element.setAttribute($key, $data[$key]);
            }
            keys['__blockdata'].push({
                data: $data,
                css: $style
            });
            return this;
        },
        parse: function ($callback, $data) { // parse blockdata into object
            $data = $data.replace(/\r\n|\r|\n/g, '\n'); // clean up carriage returns
            var $indentation = $data.substring(0, $data.indexOf('*')); // find indentation
            // parse raw blockdata into object and load into current block
            var $blockdata = parseBlock($data.substring($data.indexOf('*') + 2), $indentation);
            this.data($blockdata[marking]);
            if (isType($callback, 'function')) $callback(this);
            return this;
        },
        load: function ($callback, $file) { // load blockdata file from different sources *!* LINK IMPORT MEANT TO BE ADDED NEXT *!*
            var $block = this;
            var $next = function ($cb, $d) { // code to run when blockdata is retrieved
                $block.parse.apply($block, [$cb, $d]);
            };
            var $ajax = arguments[2]; // use ajax to get raw blockdata
            var $asynch = arguments[3]; // use asynchronous request
            if ($asynch == null || $asynch == undefined) $asynch = true; // default to async
            if (isType($ajax, 'string') && $ajax.toLowerCase() === 'jquery') { // if jQuery request desired
                if (__$block) { // if jQuery present
                    jQuery.ajax({ // use jQuery ajax
                        url: $file + '.block',
                        type: 'GET',
                        async: $asynch,
                        success: function ($rawblockdata) { $next($callback, $rawblockdata); }
                    });
                } else console.warn('jQuery not detected');
            } else if ($ajax === true) { // if normal request desired
                var $xhr; // use xhr object
                if (window.XMLHttpRequest) $xhr = new XMLHttpRequest();
                else $xhr = new ActiveXObject('Microsoft.XMLHTTP'); // IE support
                $xhr.onreadystatechange = function () { // when data recieved, load blockdata
                    if ($xhr.readyState == 4 && $xhr.status == 200)
                        $next($callback, $xhr.responseText);
                };
                $xhr.open('GET', $file + '.block', $asynch);
                $xhr.send();
            } else $next($callback, customBlockData[$file]); //if ajax not wanted, get from local file
            return this; // chain
        }
    };

    // construct blocks without data
    if (type == 'block') { // default block
        element = node('div');
        element.className = 'block';
        var content = Block('div').class('content').mark('content');
        block.setAdd(content);
        block.__add(content);
        block.__setAdd(content);
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
var $s = document.createElement('style');
$s.type = 'text/css';
$s.innerHTML = '.block { ' +
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
document.getElementsByTagName('head')[0].appendChild($s);
$s = null;
