var Block;
Block = function () {
    var element;
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
    var tags = ('input button textarea hr').split(' ');
    function tag(tag) {
        return tags.indexOf(tag.trim().toLowerCase()) > -1;
    }
    var type = arguments[0];
    var data = arguments[1];
    if (data != null && (typeof data === 'string' || data instanceof String)) data = { value: data };
    else if (data == null || typeof data !== 'object' || !(data instanceof Object)) data = { };
    switch (type) {
        case 'break':
            element = document.createElement('br');
            block.add = function () { };
            break;
        case 'text':
            element = document.createElement('span');
            if (data.value != null) element.appendChild(document.createTextNode(data.value));
            break;
        case 'image':
            element = document.createElement('div');
            block.add = function () { };
            if (data.src != null) {
                element.style.backgroundImage = "url('" + data.src + "')";
                element.style.backgroundRepeat = 'no-repeat';
                element.style.backgroundSize = 'cover';
            }
            if (data.height !== null) element.style.height = data.height;
            else element.style.height = '20px';
            if (data.width !== null) element.style.width = data.width;
            else element.style.width = '20px';
            break;
        case null:
        case undefined:
            element = document.createElement('div');
            element.className = 'block';
            var content = document.createElement('div');
            content.className = 'content';
            block.add = function (b) {
                if (b.block) content.appendChild(b.node());
                else content.appendChild(Block.apply(Block, arguments).node());
                return this;
            };
            element.appendChild(content);
            break;
        default:
            if (tag(type)) document.createElement(type);
            // else if (data != null && data.tag != null && tag(data.tag))
            //     element = document.createElement(data.tag);
            else {
                element = document.createElement('div');
                element.className = type;
            }
            break;
    }
    return block;
};
