---
layout: post
title: The fastest Clojure REPL in the world
tags: clojure clojurescript lumo
---

One common complaint of Clojure REPLs is their [startup time](http://puredanger.github.io/tech.puredanger.com/2013/12/01/clj-problems/).
Although that complaint is often somewhat unfounded (and related to tooling), it
still takes the bare Clojure JAR about 1 second to start on new hardware. [Planck](http://planck-repl.org)
— through bootstrapped ClojureScript, and owing to the small latency exhibited by
JavaScript VMs — managed to improve the time that it takes to bootstrap a Clojure(Script)
REPL. A new kid on the block promises to perform even faster. Read on!

<!--more-->


## Motivation

Not long ago, [Craig Andera](https://twitter.com/craigandera) mentioned on Twitter
that he had succeeded in compiling a ClojureScript application to a standalone native
executable, using a tool called [Nexe](https://github.com/jaredallard/nexe):

<div style="display:table;margin:0 auto 20px;">
  <blockquote class="twitter-tweet" data-lang="en">
    <p lang="en" dir="ltr">Just got ClojureScript -&gt; Native EXE working via Node&#39;s nexe. Nice.</p>
    &mdash; Craig Andera (@craigandera)
    <a href="https://twitter.com/craigandera/status/778977347206864896">September 22, 2016</a>
  </blockquote>
  <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

Being a big fan of [Mike Fikes](https://twitter.com/mfikes)'s Planck, its instant
startup and scripting capabilities, I was intrigued to validate the idea that we
could have something similar for the [Node.js](http://nodejs.org/) platform. Whether
we like it or not, Node.js's [NPM](https://www.npmjs.com/) is the [largest and fastest growing](http://www.modulecounts.com/)
package ecosystem today. Seamless interoperability with NPM plays a huge part in
extending ClojureScript's reach even further. And as it turns out, this is possible
today.


## Introducing Lumo

[Lumo](https://github.com/anmonteiro/lumo) is a fast, standalone ClojureScript REPL
that runs on Node.js and [V8](https://developers.google.com/v8/). Thanks to V8's
[custom startup snapshots](http://v8project.blogspot.com/2015/09/custom-startup-snapshots.html),
Lumo starts up instantaneously, making it the fastest Clojure REPL in existence
<sup id="fnref:1"><sub><a href="#fn:1">1</a></sub></sup>. Here's a rundown comparison
of Clojure, Planck and Lumo's startup times.

<div style="margin:-20px auto">
  <img style="margin:0" src="https://cloud.githubusercontent.com/assets/661909/20039553/440a3554-a446-11e6-9478-91229ccc21ab.png">
</div>

Lumo employs some tricks to be extremely fast. Some of these ([caching](http://blog.fikesfarm.com/posts/2015-11-26-planck-caching.html),
[lazy analysis cache loading](http://blog.fikesfarm.com/posts/2016-01-04-planck-lazy-analysis-cache-loading.html)
and [AOT-compiled macros](http://blog.fikesfarm.com/posts/2016-02-03-planck-macros-aot.html))
were directly inspired by Planck. Others, such as the V8 startup snapshot feature
that is not present in JavaScriptCore, will be the focus of subsequent posts in
this blog.

Oh, and did I mention Lumo is cross-platform? Here's a screenshot of it happily
running on Windows:

<div style="margin:30px auto">
  <img style="max-width:80%;margin:20px auto" src="https://cloud.githubusercontent.com/assets/661909/20039745/71c051ce-a449-11e6-9ebb-c01d813c1980.png">
</div>


## Peeking into the future

Lumo is not complete by any means. The initial release has a substantial set of features
(while we work on setting up a documentation website, you can get a notion of these
by running `lumo -h` or `lumo --help`), but many more are expected to arrive in
the near future. Among these are ergonomic additions such as cursor hopping, pretty
printing and colored output, as well as idiomatic ClojureScript wrappers for Node's
APIs, such as performing I/O calls, spawning child processes and more.


## Wrapping up

Lumo is free and [open source](https://github.com/anmonteiro/lumo). I think it can
serve numerous purposes, many of which I'm unable to predict. I also think that's
a good thing. If you want to try it out, there are standalone binaries for Mac, Windows
and Linux [here](https://github.com/anmonteiro/lumo/releases/latest). Be sure to
let me know what you think! I'm [@anmonteiro90](https://twitter.com/anmonteiro90)
on Twitter.

I'm curious to learn how you will use Lumo. Thanks for reading!


---

<div id="fn:1">
  <sup><sub>1</sub></sup> <sub>or rather, the one with fastest startup. Lumo runs
bootstrapped ClojureScript, and compiling ClojureScript in JavaScript is generally
slower than compiling ClojureScript on the JVM.
  <a href="#fnref:1"><img draggable="false" class="emoji" alt="↩" src="/public/img/top.svg"></a></sub>
</div>

<br>
*<small>Thanks to <a href="https://twitter.com/mfikes">Mike Fikes</a> for reading a draft of this post.</small>*
