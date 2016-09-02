---
layout: post
title: Om Next and Bootstrapped ClojureScript
tags: clojure clojurescript om
---

A small number of changes to Om Next makes it possible to use it from self-hosted
ClojureScript environments. Read on!

<!--more-->

<div style="margin:20px">
  <img style="max-width:50%;margin:0 auto" src="https://cloud.githubusercontent.com/assets/661909/17913293/e86948ba-6990-11e6-8b7d-ba5586d60b12.png">
</div>

Something that doesn't cease to amaze me, even after more than a year now, is that
[ClojureScript can compile itself](http://swannodette.github.io/2015/07/29/clojurescript-17).
The possibilities are immense, and so far we have only touched the tip of the iceberg.
There are however some caveats to it, which means that not every library out there
can work with [Bootstrapped ClojureScript](http://blog.fikesfarm.com/posts/2015-07-17-what-is-bootstrapped-clojurescript.html).
But achieving compatibility is usually not troublesome, and there even exists a
[`core.async` fork](http://blog.fikesfarm.com/posts/2016-05-15-bootstrap-core-async.html)
which works in self-hosted environments.

With this in mind, I set out to discover what changes would be required for
Om Next to work in bootstrapped Clojurescript environments such as [Planck](http://planck-repl.org/).

I was set for a surprise. As it turns out, only a very small number of [changes](https://github.com/omcljs/om/pull/752)
are required for Om Next to work in Planck. I've prepared a [simple script](https://gist.github.com/anmonteiro/4bf3982a0c301535b022709d58a1e94a)
which you can run to try out all this goodness right now. It only requires that
you have Planck 1.12 or higher installed.

Below is an example of running Om Next in bootstrapped ClojureScript. Obviously
we can't use actual DOM rendering as Planck doesn't run in a browser context, but
React server rendering comes to the rescue!

{% gist anmonteiro/4bf3982a0c301535b022709d58a1e94a planck-out.cljs %}

While I currently only envision myself using Om Next in self hosted environments
to try out the casual snippet or clarify a user question, I suspect it will start
being used in an unforeseen number of cases in the foreseeable future.

Thanks for reading!
