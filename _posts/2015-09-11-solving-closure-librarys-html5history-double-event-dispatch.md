---
layout: post
title: Solving Closure Library's Html5history double event dispatch
tags: clojure clojurescript
---

Most Clojurescript apps that rely on browser routing are wired in some manner to either the Google Closure Library's [HTML5 History](https://closure-library.googlecode.com/git-history/docs/class_goog_history_Html5History.html) module or - in an increasingly lower number of cases - the [History](https://closure-library.googlecode.com/git-history/docs/class_goog_History.html) module. While both [`pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History_API)- and [fragment](https://en.wikipedia.org/wiki/Fragment_identifier)-based routing are supported, the module always dispatches two navigation events when opting for the latter, which can become a source of unexpected behavior. Here's how to fix it.

<!--more-->

### Understanding the problem

Opting for the hash based routing approach with Google Closure's Html5history module can be done with the following (simplistic) Clojurescript code:


```Clojure
;; instantiate an Html5History object
(let [history (goog.history.Html5History.)]
  ;; listen for navigation events
  (goog.events/listen history
                      goog.history.EventType.NAVIGATE
                      #(.log js/console "Navigate event fired"))
  ;; opt for fragment routing and start using the module
  ;; also returns the instance for practical purposes
  ;; (e.g. for use in a function)
  (doto history
    (.setUseFragment true)
    (.setEnabled true)))
```

Inspecting the (used above) [`setUseFragment`](https://github.com/google/closure-library/blob/master/closure/goog/history/html5history.js#L203) function internals reveals the following:

```javascript
if (useFragment) {
  goog.events.listen(this.window_, goog.events.EventType.HASHCHANGE,
      this.onHistoryEvent_, false, this);
} else {
      goog.events.unlisten(this.window_, goog.events.EventType.HASHCHANGE,
          this.onHistoryEvent_, false, this);
}
```

However, looking at the [object instantiation](https://github.com/google/closure-library/blob/master/closure/goog/history/html5history.js#L76) we see that the module also listens for the `goog.events.EventType.POPSTATE` event. On browsers that don't support the [`pushState` API](http://caniuse.com/#search=pushstate) this represents absolutely no problem, since one should use `goog.History` instead of `goog.History.Html5History` anyway. But on browsers in which pushState is supported, we end up receiving two `NAVIGATE` events. This can easily become the root of unexpected behavior.


### Applying a solution

Since our focus is on using fragment routing, we don't really need to be listening to the `popstate` browser event. On the other hand, we want to preserve `popstate` behavior in case we switch to the `pushState` API routing. To tackle this, I use the following approach:

```Clojure
;; only remove popstate event listener when using
;; fragment based routing
(if (.-useFragment_ history)
    (events/unlisten (.-window_ history)
                     goog.events.EventType.POPSTATE
                     (.-onHistoryEvent_ history)
                     false
                     history))
```

It allows to unsubscribe from `popstate` events while still preserving that behavior when not using fragments.

If you've got any feedback, don't hesitate to [contact me](https://twitter.com/{{ site.author.twitter_username }}) or post in the comments below. Happy coding!
