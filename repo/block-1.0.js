/*
  block.js v1.0
  [http://github.anuv.me/block.js]
  File: block.js (block.js master)
  Source: [https://github.com/anuvgupta/block.js/tree/v1]
  License: MIT [https://github.com/anuvgupta/block.js/blob/v1/LICENSE.md]
  Copyright: (c) 2016 Anuv Gupta
*/
var Block;
Block = function () {
    var element;
    var node = function (t) { return document.createElement(t); };
    var tags = ('input button textarea hr p').split(' ');
    var reserved = [];
    var reserveData = function (e) {
        if (typeof e === 'string' || e instanceof String) reserved.push(e);
        else if (e.constructor === Array && variable instanceof Array) reserved = reserved.concat(e);
        return reserved;
    };
    var inArr = function (e, a) { return a.indexOf(e.trim().toLowerCase()) > -1; };
    var block = {
        block: true,
        add: function (b) {
            if (b.block) element.appendChild(b.node());
            else element.appendChild(Block.apply(Block, arguments).node());
            return this;
        },
        class: function () {
            if (arguments[0] != null && (typeof arguments[0] === 'string' || arguments[0] instanceof String)) {
                element.className += ' ' + arguments[0];
                return this;
            }
            else return element.className;
        },
        id: function () {
            if (arguments[0] != null && (typeof arguments[0] === 'string' || arguments[0] instanceof String)) {
                element.id = arguments[0];
                return this;
            }
            else return element.id;
        },
        attribute: function (a, v) {
            element.setAttribute(a, v);
            return this;
        },
        node: function () {
            return element;
        },
        fill: function (target) {
            if (typeof target === 'string' || target instanceof String) target = document.querySelector(target);
            if (typeof target === 'object' && target instanceof Node && target instanceof Element) {
                target.innerHTML = '';
                target.appendChild(element);
            }
        },
        $: function () {
            if (jQuery != null && jQuery != undefined && typeof jQuery != 'undefined' && window.jQuery) return jQuery(element);
        }
    };
    var type = arguments[0];
    var data = arguments[1];
    if (data != null && (typeof data === 'string' || data instanceof String || (data === parseInt(data, 10) && !isNaN(data)))) data = { value: data };
    else if (data == null || typeof data !== 'object' || !(data instanceof Object)) data = { };
    if (type != null && typeof type === 'string' && type instanceof String && typeof type === 'object' || type instanceof Object) {
        data = type;
        if (data.type != null && data.type != undefined) type = data.type;
        else type = 'block';
    }
    if (type == null || type == undefined) type = 'block';
    switch (type) {
        case 'break':
            if (data.value > 1) {
                element = node('span');
                for (var i = 0; i < data.value; i++) element.appendChild(node('br'));
                reserveData('value');
            } else element = node('br');
            block.add = function () { };
            break;
        case 'text':
            element = node('span');
            if (data.value != null) {
                element.appendChild(document.createTextNode(data.value));
                reserveData('value');
            }
            break;
        case 'image':
            element = node('div');
            block.add = function () { };
            if (data.src != null) {
                element.style.backgroundImage = "url('" + data.src + "')";
                element.style.backgroundRepeat = 'no-repeat';
                element.style.backgroundSize = 'cover';
            }
            reserveData('src');
            if (data.height !== null) element.style.height = data.height;
            else element.style.height = '20px';
            reserveData('height');
            if (data.width !== null) element.style.width = data.width;
            else element.style.width = '20px';
            reserveData('width');
            break;
        case 'block':
            element = node('div');
            element.className = 'block';
            var content = node('div');
            content.className = 'content';
            block.add = function (b) {
                if (b.block) content.appendChild(b.node());
                else content.appendChild(Block.apply(Block, arguments).node());
                return this;
            };
            element.appendChild(content);
            break;
        default:
            if (inArr(type, tags)) element = node(type);
            // else if (data != null && data.tag != null && tag(data.tag))
            //     element = node(data.tag);
            else {
                element = node('div');
                element.className = type;
            }
            break;
    }
    for (var key in data) {
        if (data.hasOwnProperty(key) && !inArr(key, reserved)) element.setAttribute(key, data[key]);
    }
    return block;
};
