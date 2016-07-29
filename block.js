var Block;
Block = function () {
    var element;
    var marking;
    // if (typeof arguments[0] === 'object' && arguments[0] instanceof Node && arguments[0] instanceof Element) {
    //     element = target;
    // }
    var node = function (t) { return document.createElement(t); };
    var tags = ('input button textarea hr p').split(' ');
    var reserved = [];
    var reserveData = function (e) {
        if (typeof e === 'string' || e instanceof String) reserved.push(e);
        else if (e.constructor === Array && variable instanceof Array) reserved = reserved.concat(e);
        return reserved;
    };
    var inArr = function (e, a) { return a.indexOf(e.trim().toLowerCase()) > -1; };
    var parseBlock = function (data) {
        var block;
        console.log((data.match(new RegExp('    t', 'g')) || []).length);
        return block;
    };
    var block = {
        block: true,
        add: function (m, b) {
            var args = [].slice.call(arguments);
            if (!b.block) b = Block.apply(Block, args.slice(1));
            b.mark(m);
            element.appendChild(b.node());
            return this;
        },
        addTo: function (e, m, b) {
            if (e.block) {
                var args = [].slice.call(arguments);
                if (!b.block) b = Block.apply(Block, args.slice(2));
                b.mark(m);
                element.appendChild(b.node());
            }
            return this;
        },
        class: function () {
            if (arguments[0] != null && (typeof arguments[0] === 'string' || arguments[0] instanceof String)) {
                element.className += ' ' + arguments[0];
                return this;
            } else return element.className;
        },
        id: function () {
            if (arguments[0] != null && (typeof arguments[0] === 'string' || arguments[0] instanceof String)) {
                element.id = arguments[0];
                return this;
            } else return element.id;
        },
        mark: function () {
            if (arguments[0] != null && (typeof arguments[0] === 'string' || arguments[0] instanceof String)) {
                if (arguments[0] == 'css' || arguments[0] == 'val')
                    console.warn('[BLOCK] cannot mark as \'' + arguments[0] + '\' (reserved)');
                else marking = arguments[0];
                return this;
            } else return marking;
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
            if (jQuery != null && jQuery != undefined && typeof jQuery != 'undefined' && window.jQuery) {
                var that = this;
                var $ = jQuery(element);
                $.block = function () { return that; };
                return $;
            }
        },
        load: function (f) {
            var data;
            var g = arguments[1];
            var a = arguments[2];
            if (g === true) {

            } else data = blocks[f];
            parseBlock(data);
            return this;
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
            var content = Block('div').class('content');
            block.add = function (m, b) {
                var args = [].slice.call(arguments);
                args.unshift(content);
                return block.addTo.apply(block, args);
            };
            element.appendChild(content.node());
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
'}';
document.getElementsByTagName('head')[0].appendChild(s);
s = undefined;
