/*
  block.js v3.0
  [http://anuv.me/block.js]
  File: block.js (block.js master)
  Source: [https://github.com/anuvgupta/block.js]
  License: MIT [https://github.com/anuvgupta/block.js/blob/v3/LICENSE.md]
  Copyright: (c) 2016 Anuv Gupta
*/

var Block;
Block = function () {
    // instance fields
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
    var keys = { };
    var blockdata = { count: 0 };
    var dataBindings = { };
    var mediaQueries = { };
    var resizeQuery;
    // if new blocktype is being declared, add callbacks to Block.blocks object and return
    if (marking != undefined && marking != null && typeof marking == 'function') {
        Block.blocks[type] = { };
        Block.blocks[type].create = arguments[1];
        if (arguments[2] != undefined && arguments[2] != null && typeof arguments[2] == 'function')
            Block.blocks[type].load = arguments[2];
        return true;
    }
    // convenience type checking functions
    var Is = Block.is;
    // use convenience methods of Is to prevent type errors with optional parameters
    if (Is.unset(type))
        type = 'block';
    if (marking == true) marking = type;
    else if (Is.unset(marking) || marking == 0) {
        do {
            marking = '_' + Math.floor((Math.random() * 1000) + 1).toString();
        } while (Is.obj(children[marking]));
    }

    // declare/initialize public block object
    block = {
        block: true, // block is a block
        add: function () { // add block to current block (or block specified by setAdd)
            var $args = [].slice.call(arguments);
            var $before = null;
            if (Is.set($args[0]) && $args[0].block !== true) {
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
            if (Is.obj(addblock) && addblock.block)
                addblock.add($block, $before);
            else {
                if (Is.str($before) && Is.obj(children[$before]) && children[$before].block)
                    element.insertBefore($block.node(), children[$before].node());
                else element.appendChild($block.node());
            }
            return this; // chain
        },
        __add: function () { // add block to current block's ghost tree (or ghost block specified by __setAdd)
            var $args = [].slice.call(arguments);
            var $before = null;
            if (Is.set($args[0]) && $args[0].block !== true) {
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
            if (Is.obj(__addblock) && __addblock.block)
                addblock.__add($block, $before);
            else {
                if (Is.str($before) && Is.obj(__children[$before]) && __children[$before].block)
                    element.insertBefore($block.node(), __children[$before].node());
                else element.appendChild($block.node());
            }
            return this; // chain
        },
        setAdd: function ($block) { // set block to which add method should add blocks
            if (Is.obj($block) && $block.block)
                addblock = $block;
            return this; // chain
        },
        __setAdd: function ($block) { // set block to which add method should add blocks
            if (Is.obj($block) && $block.block)
                __addblock = $block;
            return this; // chain
        },
        remove: function () {
            $marking = arguments[0];
            if (Is.null($marking) && Is.undef($marking) && Is.null(parent) && Is.undef(parent))
                parent.remove(marking);
            else if (Is.str($marking) && !Is.null(children[$marking])) {
                if (Is.obj(addblock) && addblock.block)
                    addblock.node().removeChild(children[$marking].node());
                else element.removeChild(children[$marking].node());
                delete children[$marking];
            }
            return this;
        },
        __remove: function () {
            $marking = arguments[0];
            if (Is.null($marking) && Is.undef($marking) && Is.null(__parent) && Is.undef(__parent))
                __parent.__remove(marking);
            else if (Is.str($marking) && !Is.null(__children[$marking])) {
                if (Is.obj(__addblock) && __addblock.block)
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
            if (Is.str($type)) {
                if (Is.set(Block.blocks[$type]))
                    type = $type;
            } else return type;
            return this; // chain
        },
        class: function () { // add to or get current block's DOM class
            if (Is.str(arguments[0])) {
                element.className += ' ' + arguments[0];
                return this; // chain
            } else return element.className;
        },
        id: function () { // set or get current block's DOM id
            if (Is.str(arguments[0])) {
                element.id = arguments[0];
                return this; // chain
            } else return element.id;
        },
        mark: function () { // set or get current block's marking (id in block tree)
            var $marking = arguments[0];
            if (Is.str($marking)) {
                if ($marking == 'css')
                    console.warn('[BLOCK] cannot mark as \'' + $marking + '\' (reserved)');
                else marking = $marking;
                return this; // chain
            } else return marking;
        },
        attribute: function ($attribute) { // set or get attribute of current block
            var $value = arguments[1];
            if (Is.str($value)) {
                element.setAttribute($attribute, $value);
                return this; // chain
            } else return element.getAttribute($attribute);
        },
        css: function () { // set or get value of css property of current block
            var $property = arguments[0];
            if (Is.obj($property)) {
                for (var $p in $property) {
                    if ($property.hasOwnProperty($p) && Is.str($property[$p]))
                        element.style[$p] = $property[$p];
                }
            } else if (Is.str($property)) {
                var $value = arguments[1];
                if (Is.str($value))
                    element.style[$property] = $value;
                else return element.style[$property];
            } else {
                var $obj = { };
                var $cssSD = element.style;
                for (var $prop in $cssSD) {
                    if ($cssSD.hasOwnProperty($prop) && $cssSD[$prop] != '' && !(!isNaN(parseFloat($prop)) && isFinite($prop)))
                        $obj[$prop] = $cssSD[$prop];
                }
                return $obj;
            }
            return this;
        },
        key: function ($key) {
            var $data = arguments[1];
            if (Is.unset($data)) {
                if (!Is.str($key) && Is.obj($key)) {
                    for ($subkey in $key) {
                        if ($key.hasOwnProperty($subkey))
                            keys[$subkey] = $key[$subkey];
                    }
                } else if (Is.unset(keys[$key]))
                    return null;
                else return keys[$key];
            } else keys[$key] = $data;
            return this;
        },
        blockdata: function ($key) {
            if (Is.unset(blockdata[$key]))
                return null;
            else return blockdata[$key];
            return this;
        },
        on: function ($type, $callback) { // set event handler on current block
            var $block = this;
            if (Is.str($type)) {
                if (Is.func($callback)) {
                    var $newCallback = function ($e) {
                        var $data = $e.detail;
                        if (Is.unset($e.detail))
                            $callback($e, $block, { });
                        else $callback($e, $block, $e.detail);
                    };
                    if (Is.str(arguments[2])) {
                        var $id = arguments[2];
                        var $name = $type + '_' + $id;
                        if (!Is.obj(events[$type]))
                            events[$type] = { };
                        events[$type][$id] = function ($e) {
                            $newCallback($e);
                        };
                        element.addEventListener($name, events[$type][$id], false);
                        events[$name] = function ($e) {
                            var $data = $e.detail;
                            if (Is.unset($e.detail))
                                $block.on($type, $id, { });
                            else $block.on($type, $id, $data);
                        };
                        element.addEventListener($type, events[$name], false);
                    } else element.addEventListener($type, $newCallback, false);
                } else {
                    if(Is.str($callback))
                        $name = $type + '_' + $callback;
                    else $name = $type;
                    var $data = arguments[arguments.length - 1];
                    if (Is.unset($data) || !Is.obj($data))
                        $data = { };
                    if (window.CustomEvent) {
                        var $event = new CustomEvent($name, {
                            detail: $data,
                            bubbles: true,
                            cancelable: true
                        });
                        element.dispatchEvent($event);
                    } else if (document.createEvent) {
                        $event = document.createEvent('Event');
                        $event.initEvent($name, true, true, $data);
                        element.dispatchEvent($event);
                    } else if (document.createEventObject) {
                        $event = document.createEventObject();
                        $event.eventType = $name;
                        $event.detail = $data;
                        element.fireEvent('on' + $name, $event);
                        console.warn('Event bubbling and data not fully supported');
                    } else {
                        console.warn('Events not fully supported');
                    }
                }
            }
            return this;
        },
        off: function ($type, $id) { // remove event handler from current block by id
            var $callbackA = events[$type + '_' + $id];
            var $callbackB = null;
            if (Is.set(events[$type]))
                $callbackB = events[$type][$id];
            if (Is.func($callbackA)) {
                events[$type + '_' + $id] = null;
                element.removeEventListener($type, $callbackA);
            }
            if (Is.func($callbackB)) {
                events[$type][$id] = null;
                element.removeEventListener($type + '_' + $id, $callbackB);
            }
            return this;
        },
        child: function ($marking) { // [recursively] get child of current block by marking
            if (Is.str($marking)) {
                if ($marking.includes('/')) {
                    var $childName = $marking.substring(0, $marking.indexOf('/'));
                    if (Is.set(children[$childName]))
                        return children[$childName].child($marking.substring($marking.indexOf('/') + 1));
                } else if (Is.set(children[$marking]))
                    return children[$marking];
                else return null;
            }
            return null;
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
            if (Is.str($marking)) {
                if ($marking.includes('/'))
                    return __children[$marking.substring(0, $marking.indexOf('/'))].__child($marking.substring($marking.indexOf('/') + 1));
                else if(Is.set(__children[$marking]))
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
            if (Is.obj($parent) && $parent.block && Is.unset(parent)) {
                parent = $parent;
                return this; // chain
            } else if (Is.int($parent) && Is.set($parent)) {
                if ($parent == 0) return parent;
                else return parent.parent($parent - 1);
            } else if (Is.unset(parent))
                return null;
            else return parent;
        },
        __parent: function () {
            var $parent = arguments[0];
            if (Is.obj($parent) && $parent.block && Is.unset(__parent)) {
                __parent = $parent;
                return this; // chain
            } else if (Is.int($parent) && Is.set(__parent)) {
                if ($parent == 0) return __parent;
                else return __parent.__parent($parent - 1);
            } else if (Is.unset(__parent))
                return null;
            else return __parent;
        },
        html: function () {
            var $html = arguments[0];
            var $append = arguments[1];
            if (Is.str($html)) {
                if (Is.set($append) && $append === true)
                    element.innerHTML += $html;
                else element.innerHTML = $html;
            } else return element.innerHTML;
            return this;
        },
        node: function () { // get current block's node (DOM element)
            return element;
        },
        fill: function ($target) { // fill DOM element with contents of current block
            if (Is.obj($target) && $target.block) {
                $target.empty();
                $target = $target.node();
            } else if (Is.str($target))
                $target = document.querySelector($target);
            if (Is.elem($target)) {
                $target.innerHTML = '';
                $target.appendChild(element);
            }
            return this; // chain
        },
        jQuery: function () { // jQuery the block's DOM element if jQuery present
            if (Block.jQuery) {
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
        query: function ($query, $callback) {
            if (Is.str($query)) {
                var $callbackJS;
                if (Is.func($callback))
                    $callbackJS = $callback.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1];
                else if (Is.str($callback))
                    $callbackJS = $callback;
                else return this;
                var $objectToEnd = $query;
                var $propertyToEnd = $objectToEnd.substring($objectToEnd.search(/ /) + 1);
                var $conditionToEnd = $propertyToEnd.substring($propertyToEnd.search(/ /) + 1);
                var $object = $objectToEnd.substring(0, $objectToEnd.search(/ /)).trim();
                var $property = $propertyToEnd.substring(0, $propertyToEnd.search(/ /)).trim();
                var $condition = $conditionToEnd.trim();
                if ($object == 'window') {
                    if ($property == 'height') $property = 'innerHeight';
                    else if ($property == 'width') $property = 'innerWidth';
                }
                var $callbackJS = 'if (' + $object + '.' + $property + ' ' + $condition + ') { ' + $callbackJS + ' }';
                if (!Is.obj(mediaQueries[$object])) {
                    mediaQueries[$object] = { };
                    mediaQueries[$object][$property] = [];
                } else if (!Is.arr(mediaQueries[$object][$property]))
                    mediaQueries[$object][$property] = [];
                mediaQueries[$object][$property].unshift($callbackJS);
            } else resizeQuery(new CustomEvent(marking + '_query_' + (Math.floor(Date.now() / 1000).toString())));
            return this; // chain
        },
        data: function ($blockdata) { // load blockdata into current block and its children
            var $data = { };
            var $style = { };
            var $reservedAttributes = [];
            if (Is.obj($blockdata)) {
                $reservedAttributes.push('__keys');
                if (Is.arr($blockdata['__keys']))
                    var $iterableKeys = $blockdata['__keys'];
                else var $iterableKeys = Object.keys($blockdata);
                for (var $j = 0; $j < $iterableKeys.length; $j++) {
                    var $key = $iterableKeys[$j];
                    if ($blockdata.hasOwnProperty($key)) {
                        var $midspace = $key.search(/ /);
                        if ($key == 'css') {
                            $style = $blockdata.css;
                            $reservedAttributes.push('css');
                        } else if ($key == '__js') {
                            eval(
                                '/* block.js auto-generated JS clause\n' +
                                '    (temporary event callback)\n' +
                                '   block type = ' + type + '\n' +
                                '   block marking = ' + marking + '\n' +
                                '*/\n' +
                                'var $callback = function (event, block, data) {\n\n' + $blockdata['__js'] + '\n\n};'
                            );
                            this.on('__temp_event', $callback, '__rand');
                            this.on('__temp_event', '__rand');
                            this.off('__temp_event', '__rand');
                            $reservedAttributes.push('__js');
                        } else if ($key.substring(0, 1) == ':') {
                            $reservedAttributes.push($key);
                            var $dataToLoad = $blockdata[$key];
                            var $eventTypes = $key.substring(1);
                            var $eventCallback = '';
                            if (Is.str($dataToLoad['__js'])) {
                                $eventCallback += $dataToLoad['__js'];
                                delete $dataToLoad['__js'];
                            }
                            if (Is.set($dataToLoad)) {
                                $dataToLoad = JSON.stringify($dataToLoad);
                                if (Is.str(arguments[1])) {
                                    $eventCallback += ' block.data(' + $dataToLoad + ', "' + arguments[1] + '");';
                                } else {
                                    $eventCallback += ' block.data(' + $dataToLoad + ');';
                                }
                            }
                            eval(
                                '/* block.js auto-generated event listener\n' +
                                '    (event listener callback)\n' +
                                '   block type = ' + type + '\n' +
                                '   block marking = ' + marking + '\n' +
                                '   events = ' + $eventTypes + '\n' +
                                '*/\n' +
                                'var $callback = function (event, block, data) {\n\n' + $eventCallback + '\n\n};'
                            );
                            $eventTypes = $eventTypes.split(',');
                            $eventTypes.forEach(function ($eventType) {
                                this.on($eventType.trim(), $callback);
                            }, this);
                        } else if ($key.substring(0, 1) == '@') {
                            $reservedAttributes.push($key);
                            if ($key.length > 6 && $key.substring(1, 6) == 'query') {
                                $dataToLoad = $blockdata[$key];
                                var $callbackJS = '';
                                if (Is.str($dataToLoad['__js'])) {
                                    $callbackJS += $dataToLoad['__js'];
                                    delete $dataToLoad['__js'];
                                }
                                if (Is.set($dataToLoad)) {
                                    $dataToLoad = JSON.stringify($dataToLoad);
                                    if (Is.str(arguments[1])) {
                                        $callbackJS += ' block.data(' + $dataToLoad + ', "' + arguments[1] + '");';
                                    } else {
                                        $callbackJS += ' block.data(' + $dataToLoad + ');';
                                    }
                                }
                                var $query = $key.substring(7);
                                this.query($query, $callbackJS);
                            }
                        } else if ($key.substring(0, 1) == '!') {
                            $reservedAttributes.push($key);
                            var $type = $key.substring(1);
                            var $initJS = '';
                            var $callbacks = $blockdata[$key];
                            if (Is.obj($callbacks['init']) && Is.str($callbacks['init']['__js']))
                                $initJS = $callbacks['init']['__js'];
                            eval(
                                '/* block.js auto-generated custom block initialization\n' +
                                '    (initialization callback)\n' +
                                '   custom block type = ' + $type + '\n' +
                                '*/\n' +
                                'var $initCallback = function () {\n\n' + $initJS + '\n\n};'
                            );
                            var $dataJS = '';
                            if (Is.obj($callbacks['load']) && Is.str($callbacks['load']['__js']))
                                $dataJS = $callbacks['load']['__js'];
                            eval(
                                '/* block.js auto-generated custom block data loading\n' +
                                '    (data loading callback)\n' +
                                '   custom block type = ' + $type + '\n' +
                                '*/\n' +
                                'var $dataCallback = function (block, data, style) {\n\n' + $dataJS + '\n\n};'
                            );
                            Block($type, $initCallback, $dataCallback);
                        } else if ($key.substring(0, 1) == '#') {
                            $reservedAttributes.push($key);
                            var $name = $key.substring(1);
                            var callbackJS = ''
                            if (Is.obj($blockdata[$key]) && Is.str($blockdata[$key]['__js']))
                                $callbackJS = $blockdata[$key]['__js'];
                            eval(
                                '/* block.js auto-generated data binding\n' +
                                '    ("on-the-fly" data binding callback)\n' +
                                '   block type = ' + type + '\n' +
                                '   block marking = ' + marking + '\n' +
                                '   data name = ' + $name + '\n' +
                                '*/\n' +
                                'var $callback = function (' + $name + ') {\n' + $callbackJS + '\n};'
                            );
                            this.bind($name, $callback);
                        } else if ($key.substring(0, 1) == '$') {
                            $reservedAttributes.push($key);
                            this.key($key.substring(1), $blockdata[$key]);
                        } else if ($midspace > 0) {
                            var $childtype = $key.substring(0, $midspace);
                            var $childmarking = $key.substring($midspace + 1);
                            var $childblock = Block($childtype, $childmarking);
                            if (Is.obj($blockdata[$key])) {
                                if (Is.str(arguments[1]))
                                    $childblock.data($blockdata[$key], arguments[1]);
                                else $childblock.data($blockdata[$key]);
                                $reservedAttributes.push($key);
                            }
                            this.add($childblock, Is.set($iterableKeys[$j + 1]) ? $iterableKeys[$j + 1] : null);
                            $reservedAttributes.push($key);
                        } else {
                            if (Is.obj($blockdata[$key]) && Is.obj(children[$key])) {
                                if (Is.str(arguments[1]))
                                    children[$key].data($blockdata[$key], arguments[1]);
                                else children[$key].data($blockdata[$key]);
                                $reservedAttributes.push($key);
                            } else {
                                if (Is.obj($blockdata[$key]))
                                    $reservedAttributes.push($key);
                                $data[$key] = $blockdata[$key];
                            }
                        }
                    }
                }
            } else if (Is.str($blockdata) || Is.int($blockdata))
                $data = { val: $blockdata };
            else if (Is.null($blockdata) || !Is.obj($blockdata))
                $data = { };
            else return this;
            if ((type != 'block') && Is.set(Block.blocks[type])) {
                var $getData = function ($key, $callback) {
                    var $currentData;
                    if ($key == 'this')
                        $currentData = $data;
                    else if (Is.unset($data[$key]))
                        $currentData = null;
                    else {
                        $reservedAttributes.push($key);
                        $currentData = $data[$key];
                    }
                    if (Is.func($callback) && Is.set($currentData))
                        $callback($currentData);
                    return $currentData;
                };
                var $getStyle = function ($property, $callback) {
                    var $currentStyle;
                    if ($property == 'this')
                        $currentStyle = $style;
                    else if (Is.unset($style[$property]))
                        $currentStyle = null;
                    else $currentStyle = $style[$property];
                    if (Is.func($callback, 'function') && Is.set($currentStyle))
                        $callback($currentStyle);
                    return $currentStyle;
                };
                Block.blocks[type].load(this, $getData, $getStyle);
            }
            for (var $property in $style) {
                if ($style.hasOwnProperty($property))
                    element.style[$property] = $style[$property];
            }
            for (var $key in dataBindings) {
                if (dataBindings.hasOwnProperty($key) && $data.hasOwnProperty($key)) {
                    $reservedAttributes.push($key);
                    dataBindings[$key]($data[$key], this);
                }
            }
            for (var $key in $data) {
                if ($data.hasOwnProperty($key) && !Block.inArr($key, $reservedAttributes))
                    element.setAttribute($key, $data[$key]);
            }
            blockdata.count++;
            blockdata[Is.str(arguments[1]) ? arguments[1] : ('#' + blockdata.count)] = {
                data: $data,
                css: $style
            };
            return this; // chain
        },
        bind: function ($key, $callback) {
            if (Is.str($key) && Is.func($callback))
                dataBindings[$key] = $callback;
            return this; // chain
        },
        parse: function ($callback, $data) { // parse blockdata into object
            $data = $data.replace(/\r\n|\r|\n/g, '\n'); // clean up carriage returns
            var $indentation = $data.substring(0, $data.indexOf('*')); // find indentation
            // parse raw blockdata into object and load into current block
            var $blockdata = Block.parse($data.substring($data.indexOf('*') + 2), $indentation);
            // do not load into current block if data desired
            if (arguments[arguments.length - 1] === true) return $blockdata;
            var $outsideData = { };
            for (var $prop in $blockdata) {
                if ($blockdata.hasOwnProperty($prop) && $prop != marking)
                    $outsideData[$prop] = $blockdata[$prop];
            }
            Block('u').data($outsideData);
            if (Is.str(arguments[2])) this.data($blockdata[marking], arguments[2]);
            else this.data($blockdata[marking]);
            if (Is.func($callback)) $callback(this);
            return this;
        },
        load: function ($callback, $file) { // load blockdata file from different sources (*!* LINK IMPORT MEANT TO BE ADDED NEXT *!*)
            var $block = this;
            var $next = function ($cb, $d) { // code to run when blockdata is retrieved
                $block.parse.apply($block, [$cb, $d, $file]);
            };
            var $ajax = arguments[2]; // use ajax to get raw blockdata
            var $asynch = arguments[3]; // use asynchronous request
            if ($asynch == null || $asynch == undefined) $asynch = true; // default to async
            if (Is.str($ajax) && $ajax.toLowerCase() === 'jquery') { // if jQuery request desired
                if (Block.jQuery) { // if jQuery present
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
                else if (window.ActiveXObject) $xhr = new ActiveXObject('Microsoft.XMLHTTP'); // IE support
                else console.warn('XHR (XMLHttpRequest) not supported');
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
        element = Block.node('div');
        block.css({
            width: '100%',
            height: '100%',
            display: 'table',
            textAlign: 'center'
        });
        var content = Block('div')
            .mark('content')
            .css({
                display: 'table-cell',
                textAlign: 'center',
                verticalAlign: 'middle',
                margin: '0 auto'
            })
        ;
        block.setAdd(content).__add(content);
    } else { // custom defined blocks
        if (Block.blocks[type] != null) {
            block = Block.blocks[type].create()
                .type(type)
                .mark(marking)
            ;
            /* type is overwritten!
                thus, for custom blocks:
                    one can return Block('tagname') in init, no problem
                    one cannot return Block('customblocktype') in init, causes block pseudo inheritance issues
                        instead return Block('div').add(Block('customblocktype')) to access parent block
            */
        } else element = Block.node(type);
    }
    block.attribute('block', marking);
    resizeQuery = function ($e) {
        var $callback = '';
        for (var $objectName in mediaQueries)
            if (mediaQueries.hasOwnProperty($objectName)) {
                var $object = mediaQueries[$objectName];
                for (var $propertyName in $object)
                    if ($object.hasOwnProperty($propertyName)) {
                        var $property = $object[$propertyName];
                        for (var $i in $property) {
                            if ($i == 0) $callback += ' ' + $property[$i];
                            else $callback += ' else ' + $property[$i]
                        }
                    }
            }
        eval(
            '/* block.js auto-generated media query\n' +
            '    (window resize event callback)\n' +
            '   block type = ' + type + '\n' +
            '   block marking = ' + marking + '\n' +
            '*/\n' +
            '$callback = function (event, block, data) {\n\n' + $callback + '\n\n};'
        );
        if (Is.unset($e.detail))
            $callback($e, block, { });
        else $callback($e, block, $e.detail);
    };
    window.addEventListener('blockjs_query', resizeQuery);
    return block;
};

// convenience methods and variables

Block.is = { // match types
    null: function (v) { return (v == null); },
    eqnull: function (v) { return (v === null); },
    undef: function (v) { return (v == undefined); },
    set: function (v) { return (v != undefined && v !== null); },
    unset: function (v) { return (v == undefined || v === null); },
    str: function (v) { return (v !== null && v != undefined && (typeof v == 'string' || v instanceof String)); },
    func: function (v) { return (v !== null && v != undefined && (typeof v == 'function' || v instanceof Function)); },
    node: function (v) { return (v !== null && v != undefined && (typeof v == 'object' || v instanceof Object) && v instanceof Node); },
    elem: function (v) { return (v !== null && v != undefined && (typeof v == 'object' || v instanceof Object) && v instanceof Node && v instanceof Element); },
    arr: function (v) { return (v !== null && v != undefined && (typeof v == 'array' || v instanceof Array)); },
    obj: function (v) { return (v !== null && v != undefined && (typeof v == 'object' || v instanceof Object)); },
    int: function (v) { return (v !== null && v != undefined && (v === parseInt(v, 10) && !isNaN(v))); },
    type: function (v, t) { return (typeof v == t); }
};

Block.node = function (tag) { // create element
    return document.createElement(tag);
};

Block.inArr = function (element, array) { // search array
    return array.indexOf(element) > -1;
};

Block.set = function (object, path, value) { // recursively set field within object
    if (path.length == 1) {
        object[path[0]] = value;
        return object;
    } else if (path.length > 1)
        return Block.set(object[path[0]], path.slice(1), value);
};

Block.get = function (object, path) { // recursively get field from within object
    if (path.length == 1)
        return object[path[0]]
    else if (path.length > 1)
        return Block.get(object[path[0]], path.slice(1));
};

Block.parse = function (data, indentation) { // parse blockfile to object
    var blockdata = { }; // declare/init blockdata object
    var path = []; // declare/init path array
    var lines = data.split('\n'); // split each line into array
    for (var i = 0; i < lines.length; i++) { // for each line
        var line = lines[i]; // get line
        var first = line.search(/\S/); // get position of first non-space char in line
        if (first == -1 || line.substring(first, first + 2) == '//') // if line contains only space, or starts with comment
            continue; // skip go to next line
        line = line.substring(0, first) + line.substring(first).trim(); // trim extra space off right end of line
        var indents = (line.match(new RegExp(indentation, 'g')) || []).length; // count indentation level of line
        line = line.trim(); // remove indentation
        var space = line.search(/ /); // find first space in line (end of key name)
        if (space == -1 || line.substring(0, 1) == ':' || line.substring(0, 1) == '@') { // if there is no space (or begins with a reserved event symbol), key holds object value or JavaScript
            var key = line; // since the object value is not on the line, the line is the key name
            var value = { }; // the value of this key is an object, declare/initialize
            if (key == '{') { // for JavaScript
                var js = '';
                for (var j = i + 1; j < lines.length; j++) {
                    var jsLine = lines[j]; // get line
                    var jsFirst = jsLine.search(/\S/); // get position of first non-space char in line
                    var jsIndents = (jsLine.match(new RegExp(indentation, 'g')) || []).length; // count indentation level of line
                    jsLine = jsLine.trim(); // remove indentation
                    if (jsLine == '}' && jsIndents == indents)
                        break;
                    else js += jsLine + '\n ';
                }
                i = j;
                key = '__js';
                value = js;
            } else if (key == '`') { // for multiline strings
                var str = '';
                for (var s = i + 1; s < lines.length; s++) {
                    var strLine = lines[s]; // get line
                    var strFirst = strLine.search(/\S/); // get position of first non-space char in line
                    var strIndents = (strLine.match(new RegExp(indentation, 'g')) || []).length; // count indentation level of line
                    strLine = strLine.trim(); // remove indentation
                    if (strLine == '`' && strIndents == indents)
                        break;
                    else str += strLine + '\n ';
                }
                i = s;
                key = '__str';
                value = str;
            }
        } else if (Block.is.str(lines[i + 1]) && first < lines[i + 1].search(/\S/)) { // if there is a space and also child lines, line builds new block
            var key = line;
            var value = { };
        } else { // if there is a space (and no child lines), key holds string value
            var key = line.substring(0, space); // get the key (before the first space)
            var value = line.substring(space + 1); // get the value (after the first space)
        }
        // each indent on the line represents a level in the blockdata object, thus
        path = path.slice(0, indents); // remove that many levels from last path (position in blockdata object)

        if (key != '__str') {
            // preserve key order
            var __keyOrderPath = path.concat(['__keys']);
            if (!Block.is.arr(Block.get(blockdata, __keyOrderPath)))
                Block.set(blockdata, __keyOrderPath, [key]);
            else Block.get(blockdata, __keyOrderPath).push(key);

            path.push(key); // add key to current level to generate the current path
        }
        Block.set(blockdata, path, value); // use recursive convenience function to modify blockdata object accordingly
    }
    return blockdata; // return the fully formed blockdata object, with the key order
};

Block.jQuery = false;
try { Block.jQuery = (typeof jQuery == 'function') || (typeof window.jQuery == 'function'); }
catch (error) { Block.jQuery = false; }

Block.blocks = { };

Block.queries = function (state) { // control media queries
    if (state === 'on')
        window.addEventListener('resize', Block.queryListener);
    else if (state === 'off')
        window.removeEventListener('resize', Block.queryListener);
    else window.dispatchEvent(new CustomEvent('blockjs_query'));
};
Block.queryListener = function () {
    Block.queries();
};
Block.queries('on');
