---
layout: post
title: The State of ClojureScript Compilation in Lumo
tags: clojure clojurescript lumo
---

Lumo has shipped with experimental support for
[compiling ClojureScript projects]({% post_url 2017-02-21-compiling-clojurescript-projects-without-the-jvm %})
entirely without the JVM since the beginning of 2017. Starting with the newly released
version, the Lumo build API has been greatly enhanced and much more stable! Read
on for a rundown of the state of ClojureScript compilation in Lumo.

<!--more-->

<div style="margin:30px">
  <img style="max-width:80%;margin:0 auto" src="https://user-images.githubusercontent.com/661909/30517192-6cdaee3e-9b0c-11e7-90de-453670244e1e.jpg">
</div>

I recently gave the first public talk about Lumo at [ClojuTRE](http://clojutre.org/2017/#anmonteiro)
in Finland ([video](https://www.youtube.com/watch?v=jH1oJiLV7_0)). Meeting people
who are using Lumo daily, either in their day jobs or simply to play with Clojure(Script)
always does a really good job at keeping me motivated me to continue working on Lumo.

## Current state of affairs

The current Lumo build API is mostly a prototype that I put together demonstrating
that we could have a JVM-less ClojureScript compiler. A great number of features is
lacking, and it can only compile very simple projects.

## Today!

Since ClojuTRE, I've been hard at work, and today I'm proud to announce that Lumo's
build API is, with one exception<sup id="fnref:1"><sub><a href="#fn:1">1</a></sub></sup>,
at feature parity with the ClojureScript JVM compiler.

Most notably, it also features the ability to process
[JavaScript modules](https://clojurescript.org/news/2017-07-12-clojurescript-is-not-an-island-integrating-node-modules),
including those from NPM (in a `node_modules` installation).

I encourage you to update Lumo to the newly released 1.8.0-beta<sup id="fnref:2"><sub><a href="#fn:2">2</a></sub></sup>
version and try out the revamped build API. Feedback is most welcome!

## The road ahead

The key to unlocking feature parity with the JVM ClojureScript compiler has been
the [JavaScript port](https://github.com/google/closure-compiler-js)
of the [Google Closure Compiler](https://github.com/google/closure-compiler). Without
it, neither JS module processing nor sophisticated optimizations would be possible
in Lumo. However, it is also there that lies the last hurdle to truly achieving
feature parity with ClojureScript on the JVM: the ability to perform code splitting
and dynamic chunk loading through [Google Closure modules](https://clojurescript.org/news/2017-07-10-code-splitting).

In the next few months, we'll be working hard to iron out some internal details,
as well as research the possibility of adding code splitting support to the Google
Closure Compiler JavaScript port.

Thanks for reading!

---

**P.S.**: Lumo is built on my personal time, without the backing of a big corporation.
Its development and [long term sustainability]({% post_url 2017-05-01-on-lumos-growth-and-sustainability %})
rely on financial support from the community. If you or your company are using Lumo,
please consider supporting the project in its [OpenCollective page](https://opencollective.com/lumo).
We would like to thank [JUXT](https://juxt.pro/index.html) for their recent
[sponsorship](https://twitter.com/juxtpro/status/905471197323735040) of Lumo.

---

<div id="fn:1">
  <sup><sub>1</sub></sup> <sub>At the time of this writing, the JavaScript port
of the Google Closure Compiler can't yet handle Google Closure Modules (Code Splitting).
  <a href="#fnref:1"><img draggable="false" class="emoji" alt="↩" src="/public/img/top.svg"></a></sub>
</div>

<div id="fn:2">
  <sup><sub>2</sub></sup> <sub>The beta version can be installed normally from NPM.
If you're using Homebrew, this beta version can be installed with
<code>brew install --devel lumo</code>.
  <a href="#fnref:2"><img draggable="false" class="emoji" alt="↩" src="/public/img/top.svg"></a></sub>
</div>
