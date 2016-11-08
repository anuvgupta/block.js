
/* CUSTOM BLOCKS BREAK, TEXT, AND IMAGE */

// define custom break block
Block('break', function () { // function to create break block
    var block = Block('span'); // start off with a span block
    block.add('br'); // add a line break to the span
    return block; // return the newly modified block
}, function (block, data) { // function to load data into break block
    data('val', function (val) { // get block data 'val' (amount of breaks)
        // add extra line breaks
        for (var i = 1; i < val; i++)
            block.add('br');
    });
});

// define custom text block
Block('text', function () { // function to create text block
    var block = Block('span'); // start off with a span block
    // until data is loaded, span is blank, so do nothing
    return block; // return the newly modified block
}, function (block, data) { // function to load data into text block
    var value = data('val', function (val) { // get data 'val' (text of span)
        // add text node to text block
        block.node().appendChild(document.createTextNode(val));
    });
});

// define custom image block
Block('image', function () { // function to create image block
    var block = Block('div'); // start off with div block
    // until data is loaded, image is blank, so do nothing
    return block; // return the newly modified block
}, function (block, data) { // function to load data into image block
    var src = data('src'); // get data 'src' (image source)
    var height = data('height'); // get data 'height'
    var width = data('width'); // get data 'width'
    var alt = data('alt'); // get data 'alt'
    if (src != null) { // if src is not null
        // load background image
        block.css('background-image', "url('" + src + "')")
            .css('background-repeat', 'no-repeat')
            .css('background-size', 'contain')
        ;
    }
    // if height is not null, set image div height
    if (height !== null) block.css('height', height);
    else block.css('height', 'auto');
    // if width is not null, set image div width
    if (width !== null) block.css('width', width);
    else block.css('width', 'auto');
    // if alt is not null, set image div title (div title acts like img alt)
    if (alt !== null) block.attribute('title', alt);
});
