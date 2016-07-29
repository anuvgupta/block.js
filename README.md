# block.js
block.js is a lightweight JavaScript library for generating HTML blocks.  
&nbsp;&nbsp;&nbsp;&nbsp;<sub>*inspired by [techlab](https://github.com/techlabeducation)'s View.js*</sub>  
&nbsp;  
Tired of writing `<html>` tags? Lost and confused in a web of `#css` selectors?  
Just want to create *simple, aesthetic, stress-free* web pages? **block.js is for you!**

## Philosophy
block.js splits web design into three main divisions:

1. Content Creation  
  - Adding text to fill blocks  
  - Linking images/icons for visuals  
2. Layout and Style
  - Modifying block appearance
  - Defining positions of blocks
3. Markup Generation
  - Binding content and style
  - Generating HTML blocks

We believe that you only need to worry about **content** and **layout**. *Leave markup generation to us.*
&nbsp;  

## Getting Started
1. Clone this repository, or copy raws [block.js](https://raw.githubusercontent.com/anuvgupta/block.js/master/block.js),  [block.css](https://raw.githubusercontent.com/anuvgupta/block.js/master/block.css), and [demo.html](https://raw.githubusercontent.com/anuvgupta/block.js/master/demo.html) into a folder
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
        - 1-2: HTML5 doctype declaration
        - 3-4: head block with title
        - 5: link to block.js stylesheet
        - 6: script link to block.js
    - Lines 7-14 - JavaScript
        - 8: declare `load()` function
        - 10: `Block()` generates a new HTML block
        - 11: add a text block, with value `Hello World`, to the Block generated in line 10
        - 12: "fill" the body node with the Block generated in line 10 (modified in line 11)
        - *Lack of semicolons `;` is due to command chaining (most functions of a Block return that Block)*
    - Lines 15-18 - HTML Body
        - `onload = 'load()` calls load function to generate blocks
        - body tag left blank (`fill` method overwrites contents, including comments)

## Further Tutorials
&nbsp;&nbsp;View this tutorial and others at [anuvgupta.tk/block.js/tutorials](https://anuvgupta.tk/block.js/tutorials)

# Documentation
&nbsp;&nbsp;View all API docs and tutorials at [anuvgupta.tk/block.js/docs](https://anuvgupta.tk/block.js/docs)

# Compatibility
&nbsp;&nbsp;&nbsp;&nbsp;[![jQuery](http://anuvgupta.tk/block.js/img/logo.70/jQueryB.png)](https://jquery.com/) [![HTML5](http://anuvgupta.tk/block.js/img/logo.70/html5.png)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) [![CSS3](http://anuvgupta.tk/block.js/img/logo.70/css3.png)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3) [![EcmaScript 6](http://anuvgupta.tk/block.js/img/logo.70/js5.png)](http://es6-features.org/#Constants)
[![AngularJS](http://anuvgupta.tk/block.js/img/logo.70/angular.png)](https://angularjs.org/)
