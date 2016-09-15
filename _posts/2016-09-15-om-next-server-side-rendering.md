---
layout: post
title: Om Next Server-Side Rendering
tags: clojure clojurescript om
---

Just recently, Om Next added support for server-side rendering. This is a very exciting
addition, which greatly improves Om's fullstack story, making it possible to add
considerable performance improvements to your app's initial render.

<!--more-->

<div style="margin:30px">
  <img style="max-width:45%;margin:0 auto" src="https://cloud.githubusercontent.com/assets/661909/18569433/75929366-7b9a-11e6-9e91-2d7b98cc1ac2.png">
</div>


A [recent change](https://github.com/omcljs/om/pull/764) to the Om project adds the
possibility to render Om Next components to a string. This feature resonates really
well with the fullstack story that Om Next aims to provide. Additionally, it has
great potential for making Om Next apps render much faster, by including all the
markup in initial server responses, which React would only render when the browser
loaded the app's JavaScript.

Om Next's approach to server-side rendering had been developed on the separate
[Cellophane repository](https://github.com/ladderlife/cellophane) for some time,
inspired by the concepts presented in the very insightful
["Optimizing ClojureScript Apps For Speed"](https://www.youtube.com/watch?v=fICC26GGBpg)
talk by [Allen Rohner](https://twitter.com/arohner), and his [Foam](https://github.com/arohner/foam)
project.

Everything that is necessary to render an entire Om Next application to a string
runs entirely in the JVM, via Clojure, without involving React or JavaScript at
any stage. What really is very exciting about Om Next server-side rendering (to me, at
least!) are the following:

- the returned markup gets picked up by React. This means that the
[DOM elements are preserved and React only attaches event handlers](https://facebook.github.io/react/docs/top-level-api.html#reactdomserver.rendertostring).
Pretty cool, huh?
- it's blazingly fast: at least 2x faster than [Hiccup](https://github.com/weavejester/hiccup).
There are some [performance benchmarks](https://github.com/ladderlife/cellophane/blob/master/perf/cellophane/perf.clj)
in the Cellophane repo.

What's more, and probably expected, is that the API is exactly the same. Here's a
very simple example:

```clojure
(ns my-project.core
  (:require [om.next :as om :refer [defui]]
            [om.dom :as dom]))

(defui SimpleComponent
  Object
  (render [this]
    (dom/div nil "Hello, world!")))

(def simple-factory (om/factory SimpleComponent))

(dom/render-to-str (simple-factory))
;; "<div data-reactroot=\"\" data-reactid=\"1\" data-react-checksum=\"1632637923\">Hello, world!</div>"
```

I've also put together a [repository](https://github.com/anmonteiro/om-next-fullstack)
with a fullstack example application that demonstrates how to hook up server-side
rendering in your own Om Next app. I encourage you try it out. To make sure it is
indeed working, go ahead and disable JavaScript! Meanwhile, server-side rendering
is now part of the `1.0.0-alpha45` release.

Hit me up with any questions you might have in the comments below or on Twitter,
[@anmonteiro90](https://twitter.com/anmonteiro90).

Thanks for reading!
