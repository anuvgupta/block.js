function load() {
    // generate html blocks
    Block('block', 'demo')
        .add('break', 'br1')
        .add('text', 'text1')
        .add('break', 'br1')
        .add(Block('block', 'subBlock')
            .add('image', 'image1')
        )
        .add('break')
        //.add('input1', 'input')
    .fill(document.body)
    .load('demo', true);
}
