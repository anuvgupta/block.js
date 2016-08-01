function load() {
    // generate html blocks
    Block('block', 'demo')
        .add('break')
        .add('text', 'text1')
        .add('break', 'br1')
        .add(Block('block', 'imageBlock')
            .add('image', 'image1')
        )
        .add('break')
        .add('input', 'textbox1')
    .fill(document.body)
    .load('demo', true);
}
