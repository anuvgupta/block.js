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

There is also a parallel "ghost tree" (`__add`, `__child`, `__parent`) for internal/hidden structural elements that shouldn't be exposed as "real" children — the default `block` type uses this to add an inner content `<div>` without it appearing in the public children.

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

---

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

`Is.null($marking) && Is.undef($marking)` can never both be true simultaneously (`null` is not `undefined`). This should use `||` or `Is.unset()`. Note: due to `==` coercion `null == undefined` is true, so `Is.null` (which uses `==`) happens to pass for `undefined` inputs and vice versa — the bug is masked by loose equality, but the intent is clearly `||`.

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

#### 8. `parent()` setter is write-once (line 376)

The condition `Is.unset(parent)` means once a parent is set, it can never be changed. If you remove a block and re-add it elsewhere, it still points to the original parent.

#### 9. Memory leak with resize listeners (line 788)

Every block adds a window event listener for `blockjs_query` but never removes it — even when a block is removed from the tree. Over time with dynamic UIs, this accumulates orphaned listeners.

### Security Concern

#### 10. Heavy use of `eval()`

`eval()` is used throughout `.data()`, `.query()`, and `resizeQuery` (lines 486, 515, 555, 565, 579, 776). If any user-supplied data flows into blockdata keys like `__js`, `:event`, `@query`, `!type`, or `#binding`, it enables arbitrary code execution. This is by design for a declarative UI system, but worth being aware of if untrusted data is ever loaded. See the [eval() Deep Dive](#eval-deep-dive) section below for details and mitigation.

### Minor Issues

#### 11. Stray second parameter in `Is.func` call (line 645)

`Is.func($callback, 'function')` — the `Is.func` function ignores the second argument, so it works correctly, but it is likely a leftover from an older API.

#### 12. Random marking collisions (line 46)

`Math.random() * 1000` only gives ~1000 possible values. The `while` loop prevents collisions, but this could be slow with many children. Consider using a counter or a larger range.

---

## Bug Triage

### Low-Hanging Fruit (one-line fixes, do them now)

| Bug | Fix | Effort |
|---|---|---|
| #1 `__empty` copy-paste bug | Change `children` to `__children` and `this.remove` to `this.__remove` | 2 min |
| #3 `__add` references wrong variable | Change `addblock.__add` to `__addblock.__add` | 2 min |
| #4 `var` leak in `remove`/`__remove` | Add `var` before `$marking` | 2 min |
| #5 `var` leak in `.data()` | Add `var` before `$dataToLoad` | 2 min |
| #2 `&&` vs `||` in `remove`/`__remove` | Change to `Is.unset($marking)`. Works by accident today due to `==` coercion, but the intent is wrong and could break if `Is.null`/`Is.undef` are ever tightened to use `===` | 2 min |

**Total: ~10 minutes.** These are all typos or copy-paste errors.

### Quick Wins (small but require a bit of thought)

| Bug | Fix | Effort |
|---|---|---|
| #6 `__child` missing guard | Add `Is.set()` check before recursing, matching `child()` | 5 min |
| #7 Unreachable code in `blockdata()` | Remove dead `return this` | 2 min |
| #8 `parent()` setter is write-once | Decide on semantics — should `remove()` clear the parent reference? Probably yes. The fix itself is small (null out `parent` in `remove()`), but needs thought about whether anything relies on the current behavior, and whether `__parent` needs the same treatment | 15–30 min |
| #11 Stray `Is.func` parameter | Remove the extra argument | 2 min |
| #12 Random marking range | Increase range or use a counter | 5 min |

### Architectural Issues (need design decisions and broader refactoring)

| Bug | Description | Effort |
|---|---|---|
| #10 `eval()` everywhere | Woven deeply into `.data()`, `.query()`, the blockdata parser, event bindings, and custom block definitions. Replacing it means redesigning how callbacks are passed through the data/parse pipeline. See [eval() Deep Dive](#eval-deep-dive) below | Days |
| #9 Memory leak / no block lifecycle | Conceptually simple (remove the listener when a block is destroyed), but exposes a deeper issue: blocks don't have a proper lifecycle. There's no `destroy()` or `dispose()` method. Need to add one that cleans up the resize listener, removes DOM event listeners, nulls out parent/child references, and recursively destroys children. Then `remove()` should call it (or at least offer the option) | ~1 day |

**Recommended order:** Knock out the low-hanging fruit immediately, tackle the quick wins next, then plan the lifecycle/destroy method before touching the eval problem — since the lifecycle work will give you the cleanup infrastructure you'll need anyway.

---

## eval() Deep Dive

### Why eval() is Problematic

**Security.** `eval()` executes arbitrary strings as code. If any of that string content comes from user input, an API response, or a `.block` file you didn't write, it can run anything — read cookies, make network requests, modify the page. In this library, the `.data()` method will eval whatever is in `__js` keys, event bindings, and query callbacks. If someone loads untrusted blockdata, that's full code execution.

**Debugging.** When eval'd code throws an error, the stack trace points to something like `eval at data (block.js:247)` with no meaningful line number in the original source. The comment headers generated in the eval strings mitigate this somewhat, but it's still much harder to trace than normal function calls. Breakpoints in eval'd code are difficult to set.

**Performance.** The JS engine can't optimize eval'd code at compile time. Normally the engine parses and compiles code ahead of execution, inlining variables and optimizing hot paths. When it sees `eval()`, it has to assume the eval'd string could reference or modify any variable in the surrounding scope, so it bails out of those optimizations — not just for the eval'd code, but for **the entire enclosing function**.

**Tooling.** Minifiers, bundlers, linters, and type checkers can't analyze strings. They can't rename variables inside eval'd code, can't warn about typos, and can't tree-shake unused paths. The library becomes opaque to the JS tooling ecosystem wherever eval is used.

**Readability.** Building up code as string concatenation (like the `'var $callback = function (event, block, data) {\n\n' + $blockdata['__js'] + '\n\n};'` pattern) is hard to read and easy to get wrong — a missing quote or bracket in the string yields a cryptic runtime error instead of a syntax error at parse time.

### Mitigation: `new Function()` Instead of `eval()`

`new Function()` creates a function in the **global scope**, not the local scope. The JS engine doesn't need to pessimize the surrounding closure.

**With eval() (current — deoptimizes enclosing scope):**

```js
function data($blockdata) {
    var $callback;
    // Engine sees eval → can't optimize anything in this function
    // because the string could reference $blockdata, $callback, or anything else in scope
    eval('$callback = function(event, block, data) {\n' + $blockdata['__js'] + '\n};');
    return $callback;
}
```

The engine has to keep every local variable alive and unoptimized because the eval'd string might reference them.

**With new Function() (proposed — no scope deoptimization):**

```js
function data($blockdata) {
    // Engine can fully optimize this function — the constructed function
    // has no access to $blockdata or any other local variable
    var $callback = new Function('event', 'block', 'data',
        $blockdata['__js']
    );
    return $callback;
}
```

The arguments become named parameters of the new function, and its scope chain goes straight to global — it can't see `$blockdata`, `$callback`, or anything else in the enclosing function. The engine optimizes normally.

**Practical application to this library:** The current pattern in `.data()`:

```js
eval(
    'var $callback = function (event, block, data) {\n\n' + $eventCallback + '\n\n};'
);
```

would become:

```js
var $callback = new Function('event', 'block', 'data', $eventCallback);
```

Each `eval()` call should be audited for which variables the eval'd code actually needs — then pass those explicitly as named parameters instead of relying on scope leakage.

**Caveat:** `new Function()` does **not** solve the security problem. It still executes arbitrary strings, so untrusted blockdata remains dangerous. It solves the performance, scoping, and tooling issues only.

### The Core Tension

The `.block` file format is text-based, so behavior has to be represented as strings at some point. That's why this is an architectural issue rather than a quick fix — the DSL design itself pushes toward eval. Options:

1. **Move to a purely programmatic API** for defining behavior (real functions in JS) — eval goes away naturally
2. **Keep the DSL** but use `new Function()` with explicit scope — fixes performance, not security
3. **Keep the DSL** and add a sandboxed interpreter — fixes security but adds significant complexity
