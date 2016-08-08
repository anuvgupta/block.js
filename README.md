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
    - Manipulating blocks (no DOM)
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
*Get started in just* ***5*** *easy steps*  

1. Clone this repository into a folder. Now you have two options:
    1. Load this code into a web server (ie. `localhost/block.js/demo/demo.html`)
        - This is the best option! Block content data is stored in blockfiles, and loading them with AJAX get requests is a best practice for enhanced user experience. jQuery AJAX is also supported, as well as synchronous requests.
        - Blockfiles look like true blockfiles (read #2 to understand why this is important).  
          Example taken from `demo/demo.block`:

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
            - [See here for more info](http://caniuse.com/#feat=xhr2) on XMLHttpRequest cross-browser support
            - New versions of IE7+ support AJAX, and block.js supports AJAX for IE5 and IE6
        - Continue with this tutorial
    2. Work on the code locally (ie. `file:///Users/admin/Documents/GitHub/block.js/demo/demo.html`)
        - Only use this option if you don't have a web server readily available!
        - Blockfiles are not true blockfiles in this case. They are JavaScript scripts included with a `<script>` tag, which set a variable to the block content data. This works, but is synchronous (detrimental to user experience)
        - This practice does not model the separation philosophy of the block-content-markup schema
        - Less browser support (ES5 versus ES6)
            - If you wish to support new as well as old browsers, you will have to use [EcmaScript5](http://caniuse.com/#feat=es5), which makes it hard to create multiline strings.  
              Example taken from `demo/localdemo_es5.block`:

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
            - [EcmaScript6](http://caniuse.com/#search=es6) (supported by all modern browsers) supports a multiline string literal expression, but may not be supported in older browsers.  
              Example taken from `demo/localdemo_es6.block`:

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

                The ``` ` ``` symbol denotes a multiline string literal, and newlines `\n` are added automatically
            <!-- - This tutorial is for this using a web server. For a tutorial using local files, refer [here](http://anuv.tk/block.js/tutorial/local). -->
    3. In short, ***use a web server!*** It can be a simple [Apache](https://httpd.apache.org/) server, full-blown [XAMPP](https://www.apachefriends.org/index.html), ruby [WEBricks](http://ruby-doc.org/stdlib-2.0.0/libdoc/webrick/rdoc/WEBrick.html) or [Rails](http://rubyonrails.org/), or even a tiny python [SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html). Just do it, and reduce hassle when you code.
2. With your favorite text editor (Atom), open `demo/demo.html` - it should have following contents:

    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <title>block.js demo</title>
            <script src = '../block.js'></script>
            <script src = '../blocks.js'></script>
            <script src = 'demo.js'></script>
        </head>
        <body onload = 'load()'>
            <!-- blocks are placed here -->
        </body>
    </html>
    ```

    A quick note: **This is all the HTML that you will ever need!** &nbsp; <sub>goodbye, `<tags>`!</sub>
3. A quick rundown of the purpose each file in the repository:
    - `block.js` the base code for the block.js library
    - `blocks.js` the code for defining and loading custom blocks
    - `demo/demo.html` the basic HTML markup to load scripts
    - `demo/demo.js` the code that creates blocks and marks them (links/binds them to IDs)
    - `demo/demo.block` the blockfile - contains the content and css for the blocks to load
        - `demo/localdemo_es5.block` the local JavaScript version of the blockfile
        - `demo/localdemo_es6.block` the local JavaScript (with EcmaScript6 support) blockfile
4. Open your favorite web browser (Chrome):
    - If you are using a web server
        - Copy this repository into your server's equivalent of a `www` or `htdocs` directory
        - Start your server and go to `http://` (your IP/hostname+port, ie. `localhost` or `127.0.0.1:80`) `/block.js/demo/demo.html` in your browser
    - If you are using local files
        - Based on EcmaScript support 5 or 6 (choose one), add this line before including `demo.js`:  
          `<script src = 'localdemo_es5.block'></script>` or `<script src = 'localdemo_es6.block'></script>`
        - Open `demo/demo.js` and remove `true` from line 13, so it reads `.load(null, 'demo');`
        - Open `demo/demo.html` in your browser
    - See `Hello World`, a Cavalier King Charles Spaniel, and an input box on the screen!
        - If you don't see the dog, the image was probably removed. Open `demo/demo.block` (or whichever `localdemo` you are using) and change image1's src to an image you know exists
5. Explanation (for further explanation of the code, read the comments in each file):
    - `blocks.js` tells `block.js` how to create and load data into blocks of type 'break', 'text', and 'image'
    - `demo/demo.js` tells `block.js` what blocks to create (based on `blocks.js` and HTML tags) and in what order
    - `demo/demo.block` (or one of the `localdemo` files) tells `block.js` what content/data to load into the blocks created by `demo.js` (text, css, images)
    - For more information on defining custom blocks, creating and manipulating blocks, and content binding, refer below to further tutorials and documentation

## Further Tutorials
&nbsp;&nbsp;View this tutorial and others at [anuv.tk/block.js?tutorials](http://anuv.tk/block.js/tutorials)

# Documentation
&nbsp;&nbsp;View all API docs and tutorials at [anuv.tk/block.js?docs](http://anuv.tk/block.js/docs)

# Compatibility
&nbsp;&nbsp;&nbsp;&nbsp;[![jQuery](http://anuv.tk/block.js/img/logo/75/jQueryB.png)](https://jquery.com/) [![HTML5](http://anuv.tk/block.js/img/logo/75/html5.png)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) [![CSS3](http://anuv.tk/block.js/img/logo/75/css3.png)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3) [![EcmaScript6](http://anuv.tk/block.js/img/logo/75/js5.png)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla)
[![AngularJS](http://anuv.tk/block.js/img/logo/75/angular.png)](https://angularjs.org/)  
block.js is compatible with many libraries and frameworks.  
For more questions about compatibility, email me at [blockjs@anuv.tk](mailto:blockjs@anuv.tk?Subject=Compatibility%20Issue)  
&nbsp;  
&nbsp;  
## License
&nbsp;&nbsp;block.js is released under the [MIT License](https://github.com/anuvgupta/block.js/blob/v2/LICENSE.md)
