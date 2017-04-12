---
layout: post
title: Requiring Node.js modules from ClojureScript namespaces
tags: clojure clojurescript node nodejs
---

Node.js module support has been greatly enhanced in the upcoming release of the
ClojureScript compiler. This post explains how to seamlessly require Node.js packages
from any ClojureScript namespace. Read on!

<!--more-->

<div class="message">
  <strong style="text-decoration:underline">Update:</strong> This has been released
  as part of ClojureScript version 1.9.518.
</div>

<div style="margin:30px">
  <img style="max-width: 70%;margin:0 auto" src="https://cloud.githubusercontent.com/assets/661909/23828334/9eedc8b0-0683-11e7-89bb-45afc0da79fd.jpg">
</div>

## What's new

The ClojureScript compiler added basic support for
[Node.js module resolution](https://clojurescript.org/guides/javascript-modules#node-modules)
in version 1.9.456. However, it didn't allow requiring those modules from ClojureScript
namespaces, relying instead on shim JavaScript sources that would import them. The next
version of the compiler fixes that problem by including
[significant enhancements](https://github.com/clojure/clojurescript/wiki/Enhanced-Node.js-Modules-Support)
around this behavior, effectively making it possible to seamlessly
[require Node.js modules](https://github.com/clojure/clojurescript/commit/777d41b9b6fe83c3d29fc51ee3ddbdfeff4f803b)
as if they were regular ClojureScript namespaces.

## How we made it work

To make all this possible, a new compiler option has been introduced. When compiling
your projects, the ClojureScript compiler will now read the `:npm-deps` option and
take care of installing the specified dependencies for you. This option takes a map
of package name to version. It goes without saying that you'll need to have both
Node.js and NPM installed for dependencies to be installed.

What's better, there are no changes necessary to downstream tooling. The NPM package
source files are computed and effectively become
[foreign libraries](https://clojurescript.org/reference/compiler-options#foreign-libs),
which have long been supported.

## Example

Let's look at a specific example: say we want to use the
[immensely popular](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)
`left-pad` library in a ClojureScript project. Given the following directory structure:

```
project
├─ src
│  ├─ example
│  │   └─ core.cljs
```

and our `src/example/core.cljs` file,

```clojure
;; src/example/core.cljs
(ns example.core
  (:require left-pad))

(enable-console-print!)

;; pad the number 42 with five zeros
(println (left-pad 42 5 0))
```

the following script would successfully compile this project:

```clojure
;; build.clj
(require '[cljs.build.api :as b])

(b/build "src"
  {:optimizations :none
   :main 'example.core
   :npm-deps {:left-pad "1.1.3"} ;; NEW
   :output-to "main.js"})
```

It's interesting to note how `left-pad` is both a namespace and a function. This
is due to it being the only export of the `left-pad` CommonJS module. Support for
this resolution is also part of a
[recent development](https://github.com/clojure/clojurescript/commit/1d38f73a86081ad54cb230c507fbae183d768d6b)
in the ClojureScript compiler.

If a module, e.g. the widely used `react` package, exports an object, we would
be able to refer to functions in that object as if they were Vars in a Clojure(Script) namespace.
Here's an example:

```clojure
(ns example.core
  (:require react))

;; react/DOM.div is equivalent to (react/createElement "div"), and that is
;; made clear in the h1 element.
(def title
  (react/DOM.div nil
    (react/createElement "h1" nil "Page title")))
```

## But there's more

### Packaged ClojureScript libraries benefit too

ClojureScript libraries that
[package foreign dependencies](https://clojurescript.org/reference/packaging-foreign-deps)
can also benefit from these enhancements. Ticket [CLJS-1973](http://dev.clojure.org/jira/browse/CLJS-1973)
adds support for the `:npm-deps` option in `deps.cljs` files, allowing library
authors to develop and distribute libraries that directly depend on Node.js modules.

### This does **not** obviate the need for externs

Even though the Google Closure Compiler can now consume Node.js modules, externs
are still very much necessary. This is a consequence of the fact that the Google
Closure Compiler doesn't support much of the dynamic programming employed in writing
some, if not most Node.js packages.

Fortunately, the ClojureScript compiler has
recently introduced [externs inference](https://clojurescript.org/guides/externs)
functionality, which makes it much easier to generate externs from JavaScript interop.
Additionally, ClojureScript will agressively index every externs file in the classpath,
so you can still add [CLJSJS packages](http://cljsjs.github.io/) to your project
and benefit from their externs, even though you don't require the namespaces they
export.

### Node.js module consumption is not only for Node.js apps

Consuming Node.js modules from NPM doesn't solely benefit ClojureScript projects
that target Node.js. NPM is currently also the _de facto_ way to consume JavaScript
packages that target the browser. This means that ClojureScript browser-based apps
can also take advantage of this functionality.

### Dead-code elimination on Node.js modules

To me, the greatest benefit of the new module support is dead-code elimination on
these (not so) foreign libraries. Previously, foreign libraries included in a ClojureScript
project would just get appended after Google Closure compilation. Because the Closure
Compiler can now consume Node.js modules, we get elimination of unused code for
free in our optimized builds!

## Final remarks

It has been really satisfying to work on enhancing the Node.js module support in
the ClojureScript compiler. My hope is that these developments go a long way closing
the gap between ClojureScript and JavaScript libraries published to NPM. More
importantly, I believe enhanced Node.js module support will make it much easier
to maintain codebases that share both ClojureScript and JavaScript code, as well
as make ClojureScript more appealing to JavaScript developers that rely on NPM
published packages every day.

Please note that Node.js module consumption is currently in alpha status. All
feedback is appreciated, and if you find an issue please report in the
[ClojureScript JIRA](http://dev.clojure.org/jira/browse/CLJS).

Tweet [@anmonteiro90](https://twitter.com/anmonteiro90) with any questions or
suggestions. Thanks for reading!

---

<br>
*<small>Thanks to <a href="https://twitter.com/ShaunMahood">Shaun Mahood</a>
for reading a draft of this post.</small>*
