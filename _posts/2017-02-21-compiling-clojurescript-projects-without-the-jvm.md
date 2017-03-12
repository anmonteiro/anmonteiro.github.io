---
layout: post
title: Compiling ClojureScript Projects Without the JVM
tags: clojure clojurescript lumo
---

I have dreamed about being able to compile a ClojureScript project without installing
Java ever since coming to know that [ClojureScript can compile itself](http://swannodette.github.io/2015/07/29/clojurescript-17).
While projects like [Planck](https://github.com/mfikes/planck) and
[Lumo]({% post_url 2016-11-09-the-fastest-clojure-repl-in-the-world %}) can either
run arbitrary ClojureScript forms at the REPL or run ClojureScript scripts, none have
actually supported flat out compiling an entire ClojureScript project. Until now.

<!--more-->

<div style="margin:-20px auto">
  <img style="margin:0" src="https://cloud.githubusercontent.com/assets/661909/23149340/1bb1c70e-f7a0-11e6-9a5c-f598cd73e722.png">
</div>

## Wait... what?!

That's right. Starting with version 1.2.0, [Lumo](https://github.com/anmonteiro/lumo)
can compile ClojureScript projects, just like the regular JVM-based ClojureScript
compiler. And you know what? Thanks to
<code><a href="https://github.com/google/closure-compiler-js">google-closure-compiler-js</a></code>,
the generated JavaScript can be <span style="text-decoration:underline">optimized</span>
and benefit from dead-code elimination too! This is a huge step forward in being
able to compile ClojureScript source code ahead of time into optimized JavaScript
bundles using nothing but Lumo and Node.js.

Making this work meant porting the JVM-based code in the ClojureScript compiler to
work under Lumo and the Node.js platform. While most of it has been generally straightforward,
changing the synchronous JVM build API to the self-hosted ClojureScript asynchronous
API has represented the most amount of work so far.

Compiling ClojureScript projects with Lumo requires no external dependencies (such
as the Google Closure Library) apart from those required by the projects themselves,
as all the necessary compiler dependencies are bundled within the single Lumo executable.

Go ahead and [install](https://github.com/anmonteiro/lumo#installation) the latest
Lumo release to try this feature out. Make sure you get the [`1.2.0`](https://github.com/anmonteiro/lumo/releases/tag/1.2.0)
release <sup id="fnref:1"><sub><a href="#fn:1">1</a></sub></sup>.

## Example

Take for example this [small section](https://clojurescript.org/guides/quick-start#running-clojurescript-on-node.js)
of the ClojureScript Quick Start guide. By simply changing `cljs.build.api` to
`lumo.build.api`, we can start compiling the Quick Start guide sample project without
the JVM, today. Also, let's use advanced optimizations right away so we can see the
JavaScript version of the Google Closure Compiler in action. This is what our `build.cljs`
file will look like:

```clojure
(require '[lumo.build.api :as b])

(b/build "src"
  {:main 'hello-world.core
   :output-to "main.js"
   :optimizations :advanced
   :target :nodejs})
```

Let's now run the compilation script with Lumo. Don't forget to add the `src` folder
to the classpath so that Lumo knows where to find the project. This can be done with
the `-c`/`--classpath` command line option (hint: run `lumo -h` for all the
available options).

    $ lumo --classpath src build.cljs

After waiting a few moments, we should be able to run our newly compiled project
with `node main.js`. How cool is that?!

## Caveats

This new feature isn't short of tradeoffs. The most obvious, and also the harder to
solve in the short term are described below.

#### **ClojureScript version lock-in**

Lumo ships with its own version of the ClojureScript compiler. This means that, for
now, it is not possible to compile ClojureScript projects against versions of
ClojureScript different than the one that is bundled within Lumo. While this caveat
may be possible to circumvent in the future, it is what allows us to not require any
external dependencies when compiling ClojureScript projects with Lumo.

#### **Google Closure Compiler JS**

The Google Closure Compiler JS is a JavaScript port of the Java version, generated
using GWT. That makes it [take longer](https://github.com/google/closure-compiler-js/issues/24)
to optimize code when compared to the Java version. Furthermore, it also ships with
fewer features than its Java counterpart, both because not every feature included in
the Java version is portable to JavaScript, and also because it is a fairly new
project, only [announced](https://developers.googleblog.com/2016/08/closure-compiler-in-javascript.html)
in late August 2016.

## Conclusion

This Lumo release represents a lot. To my knowledge, there exists no other effort
to compile and optimize ClojureScript projects with the Google Closure Compiler without
requiring a JVM installation. But we have only began to scratch the surface, and
there's an equally large amount of work that remains to be done in order to achieve
feature parity with the current ClojureScript compiler on the JVM.

This feature of Lumo should be considered pre-alpha, and we will continue to improve
it over the coming releases. I decided to release it nevertheless, with the objective
of gathering initial feedback and hopefully attracting a few new contributors to
Lumo. Please report [issues](https://github.com/anmonteiro/lumo/issues), and
if you want to help, do get in touch (e.g. on [Twitter](https://twitter.com/anmonteiro90))!

As a final remark, no JVMs were spawned during the process of writing this blog post.

---

<div id="fn:1">
  <sup><sub>1</sub></sup> <sub>Lumo 1.2.0 is still not in Homebrew due to technical
issues. You can install from master with <code>brew install --HEAD lumo</code>.
  <a href="#fnref:1"><img draggable="false" class="emoji" alt="↩" src="/public/img/top.svg"></a></sub>
</div>

<br>
*<small>Thanks to <a href="https://twitter.com/mfikes">Mike Fikes</a> and
<a href="https://twitter.com/swannodette">David Nolen</a>
for reading a draft of this post.</small>*
