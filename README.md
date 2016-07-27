# block.js
`block.js` is a lightweight JavaScript library for generating HTML blocks  
> inspired by [techlab](https://github.com/techlabeducation)'s View.js

&nbsp;&nbsp;&nbsp;<sub>*jQuery compatible*</sub>

## Getting Started
1. Clone this repository, or copy the raws of [block.js](https://cdn.rawgit.com/anuvgupta/block.js/master/block.js),  [block.css](https://cdn.rawgit.com/anuvgupta/block.js/master/block.css), and [demo.html](https://cdn.rawgit.com/anuvgupta/block.js/master/demo.html) into a folder
2. With your favorite text editor, open `demo.html` - it should have following contents:

    ```html
    <!DOCTYPE html>  
    <html>
        <head>
            <title>block.js demo</title>
            <link rel = 'stylesheet' type = 'text/css' href = './block.css'>
            <script type = 'text/javascript' src = './block.js'></script>
            <script type = 'text/javascript'>
              function load() {
                // generate html blocks
              }
            </script>
        </head>
        <body onload = 'load();'>
        </body>
    </html>
    ```
3. Add the following code to the `function load()` JavaScript block (after the comment):

    ```javascript
    Block()
        .add('text', 'Hello World')
    .fill(document.body);
    ```
4. Open `demo.html` your favorite browser (Chrome) to see `Hello World` on the screen!
5. Explanation
    - Lines 1-6 - HTML Head
        - HTML5 doctype declaration
        - head block with title
        - link to block.js stylesheet
        - script link to block.js
    - Lines 7-14 - JavaScript
        - 8: declare `load()` function
        - 10: `Block()` generates a new HTML block
        - 11: add a text block, with value `Hello World`, to the Block generated in line 10
        - 12: "fill" the body node with the Block generated in line 10 (modified in line 11)
        - *Lack of semicolons `;` due to command chaining (most functions of a Block return that Block)*
    - Lines 15-18 - HTML Body
        - `onload = 'load()` calls load function to generate blocks
        - body tag left blank
