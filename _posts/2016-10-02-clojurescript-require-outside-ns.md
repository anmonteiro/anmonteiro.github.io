---
layout: post
title: ClojureScript `require` outside `ns`
tags: clojure clojurescript
---

The next version of the ClojureScript compiler adds support for using `require`
outside of the `ns` form. Owing to ClojureScript's compilation model, however, there
exist subtle differences with respect to the behavior that Clojure provides. Read
on to learn more.

<!--more-->

<div class="message">
  <strong style="text-decoration:underline">Update:</strong> This has been released
  as part of ClojureScript version 1.9.293.
</div>

<div style="margin:20px">
  <img style="max-width: 70%;margin:0 auto" src="https://cloud.githubusercontent.com/assets/661909/19021756/7a918376-88c0-11e6-9449-dc8a595e3b20.jpg">
</div>

## Background

Ever since its inception, ClojureScript has always required files to provide a namespace
declaration at the top. A hard requirement like that is sometimes counterproductive
when we just want to try something out quickly. Besides, it doesn't mimic Clojure's
behavior very well, where it assumes you're in the default `user` namespace when
a namespace declaration is not provided. In addition, forms like `require`, `use`
and `import` were never supported outside of the ClojureScript REPL, and even those
were implemented as a hack on top of `ns`.

A number of tickets ([1](http://dev.clojure.org/jira/browse/CLJS-1277), [2](http://dev.clojure.org/jira/browse/CLJS-1346))
had been lying around in ClojureScript's issue tracker to address these shortcomings.
Now, a [recent addition](https://github.com/clojure/clojurescript/commit/b5147bfeb1e8034e93014e35bb27c9fb4d9c10de)
to the compiler (coming in the next release) fixes these issues, paving the way for
a number of enhancements coming to ClojureScript in the near future.

## Differences from Clojure

In Clojure, you can `require` namespaces dynamically into your namespace, load code
conditionally and at arbitrary nesting levels. In ClojureScript, this is not the
case, mostly due to the static nature of namespaces in the Google Closure Library.
Consequently, there are couple of rules to abide by when calling `require` and similar
forms (`use`, `use-macros`, etc.) in ClojureScript:

1. A file can have one of:
  - a namespace declaration, **or**
  - (possibly several) `require` forms, **or**
  - none of the above, in the case it doesn't depend on any other namespace.
2. when present, `require` forms must appear at the top of a file.
3. All the definitions in a file without a namespace declaration are interned in
the `cljs.user` namespace <sup id="fnref:1"><sub><a href="#fn:1">1</a></sub></sup>.

## Example

Because this new feature is currently unreleased, the only way you can try it out
today is by [building the compiler](https://github.com/clojure/clojurescript/wiki/Building-the-compiler)
uberjar (with `script/uberjar`). Below is an example you can use to guide you through
this new addition.

Create a project with the following structure:

{% highlight shell %}
project
├─ src
│  └─ foo.cljs
└─ cljs.jar
{% endhighlight %}

In `foo.cljs`, place the contents below. As an aside, note that we're taking advantage
of [Clojure namespace aliasing](http://blog.fikesfarm.com/posts/2016-07-03-clojurescript-clojure-namespace-aliasing.html)
([JIRA ticket](http://dev.clojure.org/jira/browse/CLJS-1692)) and
[implicit macro loading](http://dev.clojure.org/jira/browse/CLJS-1507). This too —
as one might expect — works outside the namespace declaration.

{% highlight clojure %}
;; src/foo.cljs
(require '[clojure.test :refer [deftest is run-tests]])

(deftest failing-test
  (is false))

(run-tests)
{% endhighlight %}

With the `cljs.jar` uberjar in place, running the following command will land you
directly in a ClojureScript Node.js REPL (*note*: requires a Node.js installation).

{% highlight shell %}
$ java -cp src:cljs.jar clojure.main -e "(require 'cljs.repl) (require 'cljs.repl.node) (cljs.repl/repl (cljs.repl.node/repl-env))"
{% endhighlight %}

Then you can load the file into the REPL and see it execute!

{% highlight clojure %}
ClojureScript Node.js REPL server listening on 53518
To quit, type: :cljs/quit

cljs.user=> (load-file "src/foo.cljs")

Testing cljs.user

FAIL in (failing-test) (at .cljs_node_repl/cljs/test.js:432:14)
expected: false
  actual: false

Ran 1 tests containing 1 assertions.
1 failures, 0 errors.
nil
cljs.user=>
{% endhighlight %}

I've also captured all the above in a [gist](https://gist.github.com/anmonteiro/478fc609c297cfd1217ebb9890ceba08)
that you can refer back to later.

## Parting thoughts

This addition unlocked a number of new possibilities for ClojureScript, which are
already bearing fruits. First of all, it already allowed us to
[delete a ton of hacky code](https://github.com/clojure/clojurescript/commit/c9c122)
that made `require` work in REPLs. In a very near future, it will allow ClojureScript
to add a number of new exciting features, one of which is support for
[extensible tagged literals](http://dev.clojure.org/jira/browse/CLJS-1194).

Thanks for reading!

---

<div id="fn:1">
  <sup><sub>1</sub></sup> <sub>If a <code class="highlighter-rouge">ns</code> form
  is not present, a generated namespace will be provided in the form of
  <code class="highlighter-rouge">cljs.user.file_nameXXXX</code>, where
  <code class="highlighter-rouge">XXXX</code> are the first characters of the filenames's
  SHA1 hash. This implementation detail effectively works around the fact that the
  Google Closure Library requires files to provide different namespaces.
  <a href="#fnref:1"><img draggable="false" class="emoji" alt="↩" src="/public/img/top.svg"></a></sub>
</div>

<br>
*<small>Thanks to <a href="https://twitter.com/mfikes">Mike Fikes</a> for reading a draft of this post.</small>*
