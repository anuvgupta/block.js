
/* DEMO APP */

// when window loads completely
window.addEventListener('load', function () {
    // generate main block
    Block('block', 'demo')
        // place block into body tag
        .fill(document.body)
        // load blockfile into block (asynchronously)
        .load(null, 'demo', true)
    ;
});
