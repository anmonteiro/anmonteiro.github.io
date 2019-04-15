---
layout: post
title: Compiling ClojureScript projects without the JVM
tags: clojure clojurescript
---

I have dreamed about being able to compile a ClojureScript project without installing
Java ever since coming to know that [ClojureScript can compile itself](http://swannodette.github.io/2015/07/29/clojurescript-17).
While projects like [Planck](https://github.com/mfikes/planck) and
[Lumo]({% post_url 2016-11-09-the-fastest-clojure-repl-in-the-world %}) can either
run arbitrary ClojureScript forms at the REPL or run ClojureScript scripts, none of
those efforts actually allowed to flat out compile an entire ClojureScript project.
Until now.

<!--more-->

## Wait... what?!

Starting with version 1.2.0, Lumo can compile ClojureScript projects, just like
the regular JVM compiler. And you know what? Thanks to
<code><a href="https://github.com/google/closure-compiler-js">google-closure-compiler-js</a></code>,
the generated JavaScript can be optimized and benefit from dead-code elimination too!



## Example

Take for example this [small section](https://clojurescript.org/guides/quick-start#running-clojurescript-on-node.js)
of the ClojureScript Quick Start guide. We can

Also, let's compile it with advanced optimizations so we can see the Google
Closure Compiler JS in action.

{% highlight clojure %}
(require 'lumo.build.api)

(lumo.build.api/build "src"
  {:main 'hello-world.core
   :output-to "main.js"
   :optimizations :advanced
   :target :nodejs})
{% endhighlight %}

Run the compilation script with Lumo. Don't forget to add the `src` folder to
the classpath so that Lumo knows how to find the project. This can be done with
the `-c` or `--classpath` command line option (hint: run `lumo -h` for all the
available options).

    $ lumo --classpath src build.cljs


## Caveats

- The Google Closure Compiler JS is a JavaScript port of the Java version, generated
using GWT, and that makes it [take longer](https://github.com/google/closure-compiler-js/issues/24)
to optimize code when compared to the Java version.

- no source maps (yet). Just because I didn't get to it yet, no technical difficulties to make it happen

## Conclusion

This Lumo release represents a lot.
But we have only began to touch the surface, and in its current state Lumo is by
no means at feature parity with the regular, JVM ClojureScript compiler. I decided
to release it nevertheless



Pre-alpha, just out there to gather feedback and contributors.


No JVMs were harmed during this process.
