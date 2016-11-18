# block.js
block.js is a lightweight JavaScript library for designing responsive web pages by generating reusable and customizable HTML blocks.  
&nbsp;&nbsp;&nbsp;&nbsp;<sub>*inspired by [techlab](https://github.com/techlabeducation)'s View.js*</sub>  
&nbsp;  
Tired of rewriting the same `<html>` tags? Lost and confused in a web of `#css` selectors?  
Just want to create *simple, aesthetic, responsive* web pages? **block.js is for you!**  
#### Visit [anuv.me/block.js](http://anuv.me/block.js)  

## Philosophy
block.js splits web design into three main divisions:

1. Block Layout
    - Defining tree of blocks
    - Presentation and Style
        - Modifying block appearance
        - Defining positions of blocks
2. Content Creation  
    - Adding text to fill blocks  
    - Linking images/icons for visuals
    - Manipulating blocks directly (no DOM)
        - Creating element and data events
3. Markup Generation
    - Binding layout and content
    - Generating HTML blocks


**Why block.js?**  
block.js's syntax is ridiculously basic, making it easy to learn, retain, and use consistently. Its minimalistic style simplifies your coding workflow, combining **layout** (CSS) and **content** (text/attributes) with event management to easily generate responsive web pages. Don't worry about **markup** anymore — web design has *never* been easier.

&nbsp;   
**But what is a "block" anyway?**  
A "block" is a JavaScript object returned by the library's `Block()` function.
- Blocks are essentially wrappers for DOM element objects
- Blocks provide many convenience functions for manipulating the appearance and content of their elements
- Blocks each have a name and a type, which can be either an HTML tag name (like `div`) or a custom block (which can be defined using methods outlined in the documentation)
- Blocks can be created with JavaScript, like so

    ```javascript
    var exampleBlock = Block('myType', 'myName'); // a block of type 'myType' and name 'myName'
    var mainBlock = Block('div', 'main'); // a block that wraps a `div` element and has name 'main'
    ```
- Blocks can also be created in the blockfile, a file with simple syntax outlining the data for creating blocks with different names, types and attributes/properties
    - If blockfile syntax does not suit your needs (unthinkable!) because it is *too* ***simple*** *and* ***straightforward*** *for you*, all the same features can be used in JavaScript (but you will need to type more) <sub>*HINT: use blockfiles!*</sub>
    - In addition JavaScript can be easily embedded into blockfiles (in both events, as callbacks, and as load time scripts) to create a hybrid markup/scripting language similar to [React.js](https://facebook.github.io/react/)'s [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html), but 100x simpler!
- Blocks can read CSS/attribute/custom data from JavaScript objects or from blockfiles
- Blocks listen for attached DOM events, custom events, and data events (events that occur when certain data is read or loaded)
- Custom blocks that are created (as well as normal blocks) can be instructed to react differently to different data

## Getting Started
*Get started in just* ***5*** *easy steps*  

1. Load this code into a web server
    1. ***Use a web server!*** It can be a simple [Apache](https://httpd.apache.org/) server, full-blown [XAMPP](https://www.apachefriends.org/index.html), [node.js](http://nodejs.org), ruby [WEBricks](http://ruby-doc.org/stdlib-2.0.0/libdoc/webrick/rdoc/WEBrick.html) or [Rails](http://rubyonrails.org/), or even a tiny python [SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html). Any web server should work.
        - Copy/clone the repository into your server's equivalent of a `www` or `htdocs` directory
        - Example URL to access the demo with a web server: `localhost/block.js/demo/demo.html`
    2. "Why do I need web server?"
        - Block content/layout data is stored in "blockfiles", and loading them with AJAX GET requests is a best practice for enhanced user experience
        - Pure JavaScript XHR (XMLHTTPRequest) and jQuery AJAX (including both asynchronous/synchronous requests) are supported
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
        - See [caniuse.com](http://caniuse.com/#feat=xhr2) for more info on XHR cross-browser support
        - Newer versions of IE7+ support XHR, and block.js supports XHR for IE5 and IE6
        - However, we recommend that you don't worry about browser support before IE7 (usage is globally low past that point, and capability in terms of CSS and event management is low)
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
    - `block.js` - the base code for the block.js library
    - `demo/demo.html` - the basic HTML markup that loads all scripts
    - `demo/blocks.js` - the JavaScript for defining and loading custom blocks
    - `demo/demo.js` - the JavaScript for starting block generation
    - `demo/demo.block` - the blockfile, which contains block/content/layout data
4. See how block.js translates your blockfile into HTML/CSS
    - Start your web server
        - Open your favorite web browser (Chrome) and go to `http://` (your IP/hostname+port, ie. `localhost:80` or `127.0.0.1:8000`) `/block.js/demo/demo.html` in your browser
    - See `Hello World`, a Cavalier King Charles Spaniel, and an input box on the screen!
    - Type in the input box for some cool stuff
5. Explanation (for further explanation of the code, read the comments in each file):
    - `demo/blocks.js` tells `block.js` how to create and load data into custom blocks
        - The types of custom blocks in this file: `break`, `text`, and `image`
        - One might not be satisfied with constructing pages with basic HTML tags
        - block.js allows designers to wrap basic elements (i.e. line breaks, spans of text, or images) in reusable, customizable blocks
            - A `<br/>` tag creates one line break. A block of type `break`, as defined in this file, is a `span` tag filled with a customizable amount of line breaks. Better, right?
            - A `<span></span>` tag creates a simple span of text/HTML. A block of type `text`, as defined in this file, is a `span` tag filled with a customizable text node (XSS safe), rather than raw HTML (XSS unsafe). Safer, right?
            - An `<img/>` tag creates a basic image. A block of type `image`, as defined in this file, is a `div` tag with a background image, and can be customized further to fade in once it has loaded. Smoother, right?
            - There is one block, of type `block`, that is built into block.js. It is a combination of two `div` tags and certain CSS display properties that centers anything placed within, both vertically and horizontally. Amazing!
    - `demo/demo.js` tells `block.js` (when the window has loaded) to create a main block, load into it the blockfile, and add it to the page
    - `demo/demo.block` tells `block.js` to not only create blocks based on markings (names) and types but also load the content/layout data (text/attributes and CSS) into the created blocks
    - For more information on creating and manipulating blocks, blocks of type `block`, defining custom blocks, blockfile syntax, content binding, and much more, refer below to further tutorials and documentation

## Further Tutorials
View this tutorial and others at [anuv.me/block.js/tutorials](http://anuv.me/block.js/tutorials)

## Documentation
View all API docs and tutorials at [anuv.me/block.js/docs](http://anuv.me/block.js/docs)
&nbsp;  
&nbsp;  

# Compatibility
&nbsp;&nbsp;&nbsp;&nbsp;[![jQuery](http://anuv.me/block.js/img/logo/jQueryB_75.png)](https://jquery.com/) [![HTML5](http://anuv.me/block.js/img/logo/html5_75.png)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) [![CSS3](http://anuv.me/block.js/img/logo/css3_75.png)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3) [![EcmaScript6](http://anuv.me/block.js/img/logo/js5_75.png)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla)
[![AngularJS](http://anuv.me/pocketjs/img/logo/node_75.png)](https://nodejs.org/)  
block.js is compatible with many libraries and frameworks.  
For more questions about compatibility, email me at [blockjs@anuv.me](mailto:blockjs@anuv.me?Subject=Compatibility%20Issue)  
&nbsp;  
# License
block.js is released under the [MIT License](https://github.com/anuvgupta/block.js/blob/v3/LICENSE.md)
