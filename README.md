# block.js
`block.js` is a lightweight JavaScript library for generating HTML blocks  
&nbsp;&nbsp;&nbsp;&nbsp;<sub>*inspired by [techlab](https://github.com/techlabeducation)'s View.js*</sub>  
&nbsp;  
<img src = 'https://raw.githubusercontent.com/anuvgupta/block.js/img/html5.png' width = '60px'/>
<img src = 'https://raw.githubusercontent.com/anuvgupta/block.js/img/css3.png' width = '60px'/>
<img src = 'https://raw.githubusercontent.com/anuvgupta/block.js/img/js5.png' width = '60px'/>
<img src = 'https://raw.githubusercontent.com/anuvgupta/block.js/img/jQuery.png' width = '60px'/>  
compatible
## Getting Started
1. Clone this repository, or copy the raws [block.js](https://raw.githubusercontent.com/anuvgupta/block.js/master/block.js),  [block.css](https://raw.githubusercontent.com/anuvgupta/block.js/master/block.css), and [demo.html](https://raw.githubusercontent.com/anuvgupta/block.js/master/demo.html) into a folder
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
        <body onload = 'load()'>
            <!-- blocks are placed here -->
        </body>
    </html>
    ```
3. Add the following code to the `function load()` JavaScript block (after the comment):

    ```javascript
    Block()
        .add('text', 'Hello World')
    .fill(document.body);
    ```
4. Open `demo.html` in your favorite browser (Chrome) to see `Hello World` on the screen!
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
        - *Lack of semicolons `;` is due to command chaining (most functions of a Block return that Block)*
    - Lines 15-18 - HTML Body
        - `onload = 'load()` calls load function to generate blocks
        - body tag left blank (`fill` method overwrites contents, including comments)
