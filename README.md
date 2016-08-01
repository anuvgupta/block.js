# block.js
block.js is a lightweight JavaScript library for generating HTML blocks.  
&nbsp;&nbsp;&nbsp;&nbsp;<sub>*inspired by [techlab](https://github.com/techlabeducation)'s View.js*</sub>  
&nbsp;  
Tired of writing `<html>` tags? Lost and confused in a web of `#css` selectors?  
Just want to create *simple, aesthetic, stress-free* web pages? **block.js is for you!**

## Philosophy
block.js splits web design into three main divisions:

1. Block Layout
    - Defining tree of blocks
    - Manipulating blocks (no DOM!)
2. Content Creation  
    - Adding text to fill blocks  
    - Linking images/icons for visuals  
    - Presentation and Style
        - Modifying block appearance
        - Defining positions of blocks
3. Markup Generation
    - Binding content and style
    - Generating HTML blocks

We believe that you only need to worry about **content** and **layout**. *Leave markup generation to us.*
&nbsp;  

## Getting Started
1. Clone this repository into a folder. Now you have two options:
    1. Load this code into a web server (ie. `localhost/block.js/demo/demo.html`)
        - This is the best option! Block content data is stored in blockfiles, and loading them with AJAX get requests is a best practice for enhanced user experience. jQuery AJAX is supported, as well as synchronous requests.
        - Blockfiles look like true blockfiles (read #2 to understand why this is important).
        - Example taken from `demo/demo.block`:
        
            ```
                *
            demo
                text1
                    val Hello World
                    css
                        font 30px Helvetica
                        color blue
            ```
                
        - Works on all modern and most old browsers
            - (See here for more info)[http://caniuse.com/#feat=xhr2]
            - New versions of IE7+ support AJAX, and block.js supports AJAX for IE5 and IE6
    2. Work on the code locally (ie. `file:///Users/admin/Documents/GitHub/block.js/demo/demo.html`)
        - Only use this option if you don't have a web server readily available
        - Blockfiles are not true blockfiles in this case. They are JavaScript scripts included with a `<script>` tag, which set a variable to the block content data. This works, but is synchronous (detrimental to user experience)
        - This practice does not model the separation philosophy of the block-content-markup schema
        - Less browser support (ES5 versus ES6)
            - If you wish to support new as well as old browsers, you will have to use EcmaScript5, which makes it hard to create multiline strings.
            - Example taken from `demo/localdemo_es5.block`:
            
                 ```javascript
                var customBlockData = { demo:
                '    *\n' +
                'demo\n' +
                '    text1\n' +
                '        val Hello World\n' +
                '        css\n' +
                '            font 30px Helvetica\n' +
                '            color blue\n'
                 };
                ```
                    
                One must use `+` for concatenation and `\n` for newlines repeatedly
            - EcmaScript6 (supported by all modern browsers) supports a multiline string literal expression, but may not be supported in older browsers.
            - Example taken from `demo/localdemo_es6.block`:
            
                ```javascript
                var customBlockData = { demo:
                `    *
                demo
                    text1
                        val Hello World
                        css
                            font 30px Helvetica
                            color blue
                 `};
                ```
                
    3. In short, USE A WEB SERVER! It can be a simple (Apache)[https://httpd.apache.org/] server, full-blown (XAMPP)[https://www.apachefriends.org/index.html], ruby (WEBrick)[http://ruby-doc.org/stdlib-2.0.0/libdoc/webrick/rdoc/WEBrick.html] or (Rails)[http://rubyonrails.org/], or a tiny python (SimpleHTTPServer)[https://docs.python.org/2/library/simplehttpserver.html].
2. With your favorite text editor, open `demo/demo.html` - it should have following contents:

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
&nbsp;&nbsp;&nbsp;&nbsp;[![jQuery](http://anuvgupta.tk/block.js/img/logo/75/jQueryB.png)](https://jquery.com/) [![HTML5](http://anuvgupta.tk/block.js/img/logo/75/html5.png)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) [![CSS3](http://anuvgupta.tk/block.js/img/logo/75/css3.png)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3) [![EcmaScript6](http://anuvgupta.tk/block.js/img/logo/75/js5.png)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla)
[![AngularJS](http://anuvgupta.tk/block.js/img/logo/75/angular.png)](https://angularjs.org/)  
block.js is compatible with many libraries and frameworks. For more questions about compatibility, email me at [anuv.ca@gmail.com](mailto:anuv.ca@gmail.com?Subject=Compatibility%20Issue)
