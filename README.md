# block.js
block.js is a lightweight JavaScript library for generating reusable and customizable HTML blocks.  
&nbsp;&nbsp;&nbsp;&nbsp;<sub>*inspired by [techlab](https://github.com/techlabeducation)'s View.js*</sub>  
&nbsp;  
Tired of rewriting the same `<html>` tags? Lost and confused in a web of `#css` selectors?  
Just want to create *simple, aesthetic, responsive* web pages? **block.js is for you!**  
#### Visit [anuv.me/block.js](http://anuv.me/block.js)  

## Philosophy
block.js splits web design into three main divisions:

1. Block Layout
    - Defining tree of blocks
    - Creating DOM and data events
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

**But why block.js?**  
block.js's syntax is ridiculously basic, making it easy to learn, retain, and use consistently. Its minimalistic style simplifies your coding workflow, combining **layout** (CSS) and **content** (text/attributes) with event management to easily generate responsive web pages. Don't worry about markup anymore — web design has *never* been easier.  

## Getting Started
*Get started in just* ***5*** *easy steps*  

1. Load this code into a web server
    1. ***Use a web server!*** It can be a simple [Apache](https://httpd.apache.org/) server, full-blown [XAMPP](https://www.apachefriends.org/index.html), [node.js](http://nodejs.org), ruby [WEBricks](http://ruby-doc.org/stdlib-2.0.0/libdoc/webrick/rdoc/WEBrick.html) or [Rails](http://rubyonrails.org/), or even a tiny python [SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html). Any web server should work.
        - Example URL: `localhost/block.js/demo/demo.html`
        - Copy/clone the repository into your server's equivalent of a `www` or `htdocs` directory
    2. "Why do I need web server?"
        - Block content/layout data is stored in "blockfiles", and loading them with AJAX GET requests is a best practice for enhanced user experience
        - Pure JavaScript XHR and jQuery AJAX (including both asynchronous/synchronous requests) are supported
        - Example blockfile (taken from `demo/demo.block`):

            ```
                *
            demo
                text text1
                    val Hello World
                    css
                        font 30px Helvetica, Arial, sans-serif
                        color blue
            ```

    3. Works with all modern and most old browsers
        - [See caniuse.com for more info](http://caniuse.com/#feat=xhr2) on XMLHTTPRequest cross-browser support
        - Newer versions of IE7+ support AJAX, and block.js supports AJAX for IE5 and IE6
2. With your favorite text editor (Atom), open `demo/demo.html` - it should have following contents:

    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <title>block.js demo</title>
            <script src = '../block.js'></script>
            <script src = 'blocks.js'></script>
            <script src = 'demo.js'></script>
        </head>
        <body>
            <!-- blocks are placed here -->
        </body>
    </html>
    ```

    A fun fact: **This is all the HTML that you will ever need!** &nbsp; <sub>goodbye, `<tags>`!</sub>
3. A quick rundown of the purpose each file in the repository:
    - `demo/demo.html` - the basic HTML markup that loads all scripts
    - `block.js` - the base code for the block.js library
    - `demo/blocks.js` - the JavaScript for defining and loading custom blocks
    - `demo/demo.js` - the JavaScript for starting block generation
    - `demo/demo.block` - the blockfile, which contains block initialization and content/layout data
4. See how block.js translates your blockfile
    - Start your web server
        - Open your favorite web browser (Chrome) and go to `http://` (your IP/hostname+port, ie. `localhost:80` or `127.0.0.1:8000`) `/block.js/demo/demo.html` in your browser
    - See `Hello World`, a Cavalier King Charles Spaniel, and an input box on the screen!
        - If you don't see the dog, the image was probably removed. Open `demo/demo.block` and change image1's src to an image you know exists
5. Explanation (for further explanation of the code, read the comments in each file):
    - `demo/blocks.js` tells `block.js` how to create and load data into custom blocks
        - The types of custom blocks in this file: `break`, `text`, and `image`
        - One might not be satisfied with constructing pages with basic HTML tags
        - block.js allows designers to wrap basic elements (i.e. line breaks, spans of text, or images) in reusable, customizable blocks
            - A `<br/>` tag creates one line break. A block of type `break`, as defined in this file, is a `span` tag filled with a customizable amount of line breaks.
            - A `<span></span>` tag creates a simple span of text/HTML. A block of type `text`, as defined in this file, is a `span` tag filled with a customizable text node (XSS safe), rather than raw HTML (XSS unsafe).
            - An `<img/>` tag creates a basic image. A block of type `image`, as defined in this file, is a `div` tag with a background image, and can be customized further to fade in once it has loaded.
            - There is one block, of type `block`, that is built into block.js. It is a combination of two `div` tags and certain CSS display properties that centers anything placed within, both vertically and horizontally.
    - `demo/demo.js` tells `block.js` (when the window has loaded) to create a main block, load into it the blockfile, and add it to the page
    - `demo/demo.block` tells `block.js` to not only create blocks based on markings (names) and types but also load the content/layout data (text/attributes and CSS) into the created blocks
    - For more information on creating and manipulating blocks, blocks of type `block`, defining custom blocks, blockfile syntax, content binding, and much more, refer below to further tutorials and documentation

## Further Tutorials
&nbsp;&nbsp;View this tutorial and others at [anuv.me/block.js/tutorials](http://anuv.me/block.js/tutorials)

## Documentation
&nbsp;&nbsp;View all API docs and tutorials at [anuv.me/block.js/docs](http://anuv.me/block.js/docs)
&nbsp;  
&nbsp;  

# Compatibility
&nbsp;&nbsp;&nbsp;&nbsp;[![jQuery](http://anuv.me/block.js/img/logo/jQueryB_75.png)](https://jquery.com/) [![HTML5](http://anuv.me/block.js/img/logo/html5_75.png)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) [![CSS3](http://anuv.me/block.js/img/logo/css3_75.png)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3) [![EcmaScript6](http://anuv.me/block.js/img/logo/js5_75.png)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla)
[![AngularJS](http://anuv.me/pocketjs/img/logo/node_75.png)](https://nodejs.org/)  
block.js is compatible with many libraries and frameworks.  
For more questions about compatibility, email me at [blockjs@anuv.me](mailto:blockjs@anuv.me?Subject=Compatibility%20Issue)  
&nbsp;  
# License
&nbsp;&nbsp;block.js is released under the [MIT License](https://github.com/anuvgupta/block.js/blob/v3/LICENSE.md)
