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
3. Add the following code to the `function load()` JavaScript block:
    ```javascript
    Block()
        .add('text', 'Hello World!')
    .fill(document.body);
    ```
