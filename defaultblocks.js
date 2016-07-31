

Block('break', function () {
    var block = Block('span');
    block.node().appendChild(document.createElement('br'));
    block.add = function () { return block; };
    return block;
}, function (block, data) {
    var value = data('value');
    if (value === null) value = 1;
    for (var i = 0; i < value; i++) block.node().appendChild(document.createElement('br'));
});

Block('text', function () {
    var block = Block('span');
    return block;
}, function (block, data) {
    console.log(data('val'));
    var value = data('val');
    if (value != null) element.appendChild(document.createTextNode(value));
});

Block('image', function () {
    // element = node('div');
    // block.add = function () { };
    // if (data.src != null) {
    //     element.style.backgroundImage = "url('" + data.src + "')";
    //     element.style.backgroundRepeat = 'no-repeat';
    //     element.style.backgroundSize = 'cover';
    // }
    // reserveData('src');
    // if (data.height !== null) element.style.height = data.height;
    // else element.style.height = '20px';
    // reserveData('height');
    // if (data.width !== null) element.style.width = data.width;
    // else element.style.width = '20px';
    // reserveData('width');
}, function (block, data) {

})
