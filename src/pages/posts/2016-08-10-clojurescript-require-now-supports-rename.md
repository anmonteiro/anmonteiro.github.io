---
layout: post
title: ClojureScript `require` now supports `:rename`
tags: clojure clojurescript
---

There exist a [number of differences](https://github.com/clojure/clojurescript/wiki/Differences-from-Clojure) between Clojure and ClojureScript, especially concerning [namespace declarations](https://github.com/clojure/clojurescript/wiki/Differences-from-Clojure#namespaces) and `require` specifications. Some of these differences have recently been addressed with the introduction of [Clojure namespace aliasing](http://blog.fikesfarm.com/posts/2016-07-03-clojurescript-clojure-namespace-aliasing.html) ([JIRA ticket](http://dev.clojure.org/jira/browse/CLJS-1692)) and [implicit macro loading](http://dev.clojure.org/jira/browse/CLJS-1507). A further upcoming enhancement introduces the possibility to `:rename` referred symbols in dependency specifications.


<!--more-->

<div style="margin:20px">
  <img style="margin:0 auto" src="https://cloud.githubusercontent.com/assets/661909/17553842/d9429ecc-5eff-11e6-97b2-08fe95d4fef5.jpg">
</div>


Starting with the next version of Clojurescript, we'll be [able to use the `:rename` option](http://dev.clojure.org/jira/browse/CLJS-1508) when requiring dependencies. As with Clojure, `:rename` can be used under `:require`, `:use` and `:refer-clojure`. The following examples take us through the basics of how using `:rename` looks like in practice.

-  In `require` specifications, we can `:rename` referred symbols:

```clojure
cljs.user=> (require '[clojure.set :refer [intersection]
       #_=>                        :rename {intersection foo}])
nil
cljs.user=> (foo #{1 2} #{2 3})
#{2}
```

-  Such is the case with `:use`. It is possible to `:rename` symbols referred with `:only`:

```clojure
cljs.user=> (ns foo.core
       #_=>   (:use [clojure.string :only [lower-case]
       #_=>                         :rename {lower-case lc}]))
nil
foo.core=> (lc "FOO")
"foo"
```

- In `:refer-clojure`, `:rename` can be used with or without `:excludes`:

```clojure
cljs.user=> (ns foo.core
      #_ =>   (:refer-clojure :rename {map core-map}))
nil
foo.core=> (core-map inc [1 2 3])
(2 3 4)
```


At the time of this writing, this enhancement is currently unreleased. However, you can try it out in two ways:

1. [build the ClojureScript compiler](https://github.com/clojure/clojurescript/wiki/Building-the-compiler) from master, or

2. [build](https://github.com/mfikes/planck#building) the [Planck](http://planck-repl.org/) bootstrapped REPL — [Mike Fikes](https://twitter.com/mfikes) has promptly updated the repository to use the ClojureScript commit that includes support for `:rename`.


<p>
  <span style="font-weight:bold">Note:</span> This feature is now part of ClojureScript releases since version 1.9.183.
</p>

### Parting thoughts

While there will always exist differences between Clojure and ClojureScript, this enhancement further narrows that gap and eases code portability between the two platforms.

Thanks for reading!
