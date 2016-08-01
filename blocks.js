// custom blocks break, text, and image

// define break block
Block('break', function () { //function to create break block
    var block = Block('span'); //start off with a span block
    block.add(Block('br')); //add a line break to the span
    return block; //return the newly modified block
}, function (block, data) { //function to load data into break block
    var value = data('val'); //get block data 'val' (amount of breaks)
    if (value !== null) { //if val is null, don't change block
        //else add that many extra line breaks
        for (var i = 1; i < value; i++) block.add(Block('br'));
    }
    //prevent blocks from being added to this block
    block.add = function () {
        return block; //return block to allow chaining
    };
});

// define text block
Block('text', function () { //function to create text block
    var block = Block('span'); //start off with a span block
    //until data is loaded, span is blank, so do nothing
    return block; //return the newly modified block
}, function (block, data) { //function to load data into text block
    var value = data('val'); //get data 'val' (text of span)
    // if val is not null, add text to text block
    if (value != null) block.node().appendChild(document.createTextNode(value));
});

// define image block
Block('image', function () { //function to create image block
    var block = Block('div'); //start off with div block
    //prevent blocks from being added to this block
    block.add = function () {
        return block; //return block to allow chaining
    };
    //until data is loaded, image is blank, so do nothing
    return block; //return the newly modified block
}, function (block, data) { //function to load data into image block
    var element = block.node(); //get the block's element
    var src = data('src'); //get data 'src' (image source)
    var height = data('height'); //get data 'height'
    var width = data('width'); //get data 'width'
    if (src != null) { //if src is not null
        //load background image
        element.style.backgroundImage = "url('" + src + "')";
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundSize = 'contain';
    }
    //if height is not null, set image div height
    if (height !== null) element.style.height = height;
    else element.style.height = 'auto';
    //if width is not null, set image div width
    if (width !== null) element.style.width = width;
    else element.style.width = 'auto';
});
