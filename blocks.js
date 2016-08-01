Block('break', function () {
    var block = Block('span');
    block.add(Block('br'));
    return block;
}, function (block, data) {
    var value = data('val');
    if (value === null) value = 1;
    for (var i = 1; i < value; i++) block.add(Block('br'));
    block.add = function () { return block; };
});

Block('text', function () {
    var block = Block('span');
    return block;
}, function (block, data) {
    var value = data('val');
    if (value != null) block.node().appendChild(document.createTextNode(value));
});

Block('image', function () {
    var block = Block('div');
    block.add = function () { return block; };
    return block;
}, function (block, data) {
    var element = block.node();
    var src = data('src');
    var height = data('height');
    var width = data('width');
    if (src != null) {
        element.style.backgroundImage = "url('" + src + "')";
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundSize = 'contain';
    }
    if (height !== null) element.style.height = height;
    else element.style.height = 'auto';
    if (width !== null) element.style.width = width;
    else element.style.width = 'auto';
});
