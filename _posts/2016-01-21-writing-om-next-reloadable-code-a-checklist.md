---
layout: post
title: Writing Om Next Reloadable Code — A Checklist
tags: clojure clojurescript om
---

It didn't take long since [Figwheel](https://github.com/bhauman/lein-figwheel) came into our ClojureScript environments for it to become a crucial part of our development workflow. Its code hot loading magic provides the basis for an easy, enjoyable [interactive programming](https://en.wikipedia.org/wiki/Interactive_programming) experience. The rest — writing code that can be repeatedly evaluated without disturbing our running program's state — is up to us. In this post I will go through what you need to know to start writing reloadable code in Om Next.

<!--more-->

<ul>
<li><h3><strong><code>defonce</code> your app-state and reconciler</strong></h3></li>

As stated in the <a href="https://github.com/bhauman/lein-figwheel#writing-reloadable-code">Figwheel docs</a>, top-level definitions that are defined with <code>def</code> will be redefined every time you hit the save button, possibly compromising the state of your components at that point in time. So remember to always <code>defonce</code> any top-level definitions that contain local state; this way the identifier won't be redefined and any changes to it won't be seen <sup><sub>1</sub></sup>.


<li><h3><strong><code>(defui ^:once MyComponent)</code> is also a thing</strong></h3></li>

Applying the <code>:once</code> metadata to your Om Next components is the equivalent of using <code>defonce</code> to define the top-level variables in your program. It will prevent the React components constructors from being redefined, while patching those components' JavaScript prototypes to use the newly written (and hotloaded) code <sup><sub>2</sub></sup>.


<li><h3><strong>only call <code>add-root!</code> on the initial load</strong></h3></li>
<code>add-root!</code> mounts an Om Next component in the DOM. The problem with calling <code>add-root!</code> on reload is that successive calls to this function will result in the Om Next reconciler unmounting any components currently mounted on the target node prior to actually performing the new mounting operation. Below is a simple code example of how to achieve what I've been describing. I imagine variations of it can be used as a <a href="https://github.com/bhauman/lein-figwheel#configure-your-builds">Figwheel reload hook</a>.
</ul>

```clj
(defonce root (atom nil))

(defn init []
  (if (nil? @root)
    (let [target (js/document.getElementById "app")]
      (om/add-root! reconciler RootComponent target)
      (reset! root RootComponent))
    (let [c (om/class->any reconciler RootComponent)]
      (om/force-root-render! reconciler))))
```

I hope the above advice will prove useful in your Om Next journey. Thanks for reading!

---

<sup><sub>1</sub></sup> also keep in mind that this might not be desirable if you change whatever that definition contains. A full reload will probably be necessary in that case.

<sup><sub>2</sub></sup> the advertised behavior doesn't quite work like that at the time of this writing as [a PR which fixes it](https://github.com/omcljs/om/pull/583) is waiting to make its way into Om master. Meanwhile, you can get away with using JavaScript's `Object.setPrototypeOf` in your reload hooks (e.g. `(js/Object.setPrototypeOf c (.-prototype RootComponent))`).
