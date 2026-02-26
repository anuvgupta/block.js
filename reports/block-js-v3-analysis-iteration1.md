# block.js v4 — Library Analysis

## What It Does

block.js is a **DOM abstraction / UI component library** for building web interfaces. It provides a tree-based component model where each "block" wraps a DOM element and can have children, events, styles, and data bindings. Think of it as a lightweight, jQuery-era alternative to frameworks like React — components are nested, data flows down through `.data()`, and custom block types act like reusable component definitions.

## How It Works

### Core Concepts

#### 1. Block Creation

- `Block('div')` creates a block wrapping a `<div>`.
- `Block('block')` (the default) creates a centered table-cell layout container.
- `Block('button', initFn, loadFn)` registers a reusable custom component type.

#### 2. Tree Structure

Blocks maintain a parent/children hierarchy via `.add()`, `.child()`, `.parent()`, `.sibling()`. Children are keyed by "marking" (a string ID, auto-generated if not provided).

There is also a parallel "ghost tree" (`__add`, `__child`, `__parent`) for internal/hidden structure.

#### 3. Data Loading

`.data(obj)` is the main data-flow mechanism. It walks an object and dispatches values to children, CSS, HTML, events, custom blocks, data bindings, and DOM attributes based on key prefixes:

| Key Prefix | Behavior |
|---|---|
| *(plain key)* | Set as DOM attribute, or recurse into matching child block |
| `css` | Applies styles via `element.style` |
| `html` | Sets `innerHTML` |
| `__js` | Eval'd as inline JavaScript |
| `:eventName` | Registers event listener(s) |
| `@query ...` | Registers media/resize queries |
| `!typeName` | Declares custom block types inline |
| `#name` | Creates a data binding |
| `$key` | Sets key-value data via `.key()` |
| `"type marking"` *(space in key)* | Creates and adds a new child block |

#### 4. Block Data File Format

`.parse()` and `.load()` support a custom indentation-based file format (`.block` files) that gets parsed into the data objects above. It is essentially a whitespace-significant config language with JS blocks (`{ ... }`) and multiline strings (`` ` ... ` ``).

#### 5. Events

`.on()` handles both listening and dispatching (overloaded based on arguments). Named event handlers can be added/removed by ID via `.on(type, callback, id)` / `.off(type, id)`.

#### 6. Media Queries

`.query()` builds JavaScript-based resize listeners that eval condition strings against window properties (e.g. `window innerWidth > 600`).

#### 7. Static Utilities

| Utility | Purpose |
|---|---|
| `Block.is` | Type-checking helpers (`is.str`, `is.obj`, `is.func`, etc.) |
| `Block.node(tag)` | Wrapper around `document.createElement` |
| `Block.set(obj, path, val)` | Recursive object path setter |
| `Block.get(obj, path)` | Recursive object path getter |
| `Block.parse(data, indent)` | Blockfile parser |
| `Block.blocks` | Registry of custom block type definitions |
| `Block.queries(state)` | Controls global resize query listener |

## Bugs

### Definite Bugs

#### 1. `__empty()` iterates over the wrong collection (line 151)

It iterates `children` and calls `this.remove()` instead of iterating `__children` and calling `this.__remove()`.

```js
// Current (buggy):
__empty: function () {
    for (var $marking in children)
        this.remove($marking);
}

// Should be:
__empty: function () {
    for (var $marking in __children)
        this.__remove($marking);
}
```

#### 2. `remove()` condition is always false (line 123)

`Is.null($marking) && Is.undef($marking)` can never both be true simultaneously (`null` is not `undefined`). This should use `||` or `Is.unset()`.

```js
// Current (buggy):
if (Is.null($marking) && Is.undef($marking) && !Is.null(parent) && !Is.undef(parent))

// Should be:
if (Is.unset($marking) && !Is.unset(parent))
```

Same bug exists in `__remove()` at line 135.

#### 3. `__add()` delegates to the wrong variable (line 99)

When `__addblock` is set, it calls `addblock.__add()` instead of `__addblock.__add()`.

```js
// Current (buggy):
addblock.__add($block, $before);

// Should be:
__addblock.__add($block, $before);
```

#### 4. Missing `var` on `$marking` in `remove()` (line 122) and `__remove()` (line 134)

`$marking` is assigned without `var`, leaking it to the global scope.

#### 5. Missing `var` on `$dataToLoad` in `.data()` (line 531)

Inside the `@query` branch, `$dataToLoad` is assigned without `var`, leaking it to the global scope.

#### 6. `__child()` doesn't guard against missing children (line 330)

Unlike `child()` which checks `Is.set(children[$childName])` before recursing into a slash-separated path, `__child()` will throw a TypeError if the intermediate child doesn't exist.

#### 7. Unreachable code in `blockdata()` (line 232)

The `return this` at the end of the function is dead code — both branches of the `if`/`else` above it already return.

### Security Concern

#### 8. Heavy use of `eval()`

`eval()` is used throughout `.data()`, `.query()`, and `resizeQuery` (lines 486, 515, 555, 565, 579, 776). If any user-supplied data flows into blockdata keys like `__js`, `:event`, `@query`, `!type`, or `#binding`, it enables arbitrary code execution. This is by design for a declarative UI system, but worth being aware of if untrusted data is ever loaded.

### Minor Issues

#### 9. Stray second parameter in `Is.func` call (line 645)

`Is.func($callback, 'function')` — the `Is.func` function ignores the second argument, so it works correctly, but it is likely a leftover from an older API.

#### 10. Random marking collisions (line 46)

`Math.random() * 1000` only gives ~1000 possible values. The `while` loop prevents collisions, but this could be slow with many children. Consider using a counter or a larger range.
