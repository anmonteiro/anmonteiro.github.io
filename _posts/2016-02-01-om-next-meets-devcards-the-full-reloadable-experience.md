---
layout: post
title: Om Next meets Devcards — the full reloadable experience
tags: clojure clojurescript om
---

In a recent post, I've put together a checklist covering the steps involved in [writing reloadable Om Next code]({% post_url 2016-01-21-writing-om-next-reloadable-code-a-checklist %}). If you are trying to use them in your devcards, however, you might find that current [Devcards helpers for Om Next](https://github.com/bhauman/devcards/pull/85) are still lacking full support for a pleasant, out-of-the-box reloadable experience, even when sticking to every recommendation in that list. Enter [\`devcards-om-next\`](https://github.com/anmonteiro/devcards-om-next).

<!--more-->

## The state of Om Next helpers for Devcards

As mentioned in the [checklist]({% post_url 2016-01-21-writing-om-next-reloadable-code-a-checklist %}), Om Next's own `add-root!` will unmount any components currently mounted on the target DOM node before actually mounting the component in question. In a reloadable scenario, this behavior is undesirable because it will result in components losing their local state. Unfortunately, the current Devcards `om-next-root` and `defcard-om-next` helpers employ this exact approach, which although simple, makes impossible to set up an actual interactive programming environment.

## The full experience: [`devcards-om-next`](https://github.com/anmonteiro/devcards-om-next)

`devcards-om-next` is a small Devcards extension that aims to replace the current helpers with ones that know the dynamics of Om Next components. By being aware of how exactly to mount and reload components, these new `om-next-root` and `defcard-om-next` helpers enable the creation of fully reloadable Om Next component cards. For now, they are in their own library, but are expected to be [integrated in Devcards](https://github.com/bhauman/devcards/pull/91#issuecomment-173391945) itself going forward. Read on for an example of how to use them in your code. Also refer to the [devcards demos](https://github.com/anmonteiro/devcards-om-next/blob/master/src/devcards/devcards_om_next/devcards/core.cljs) in the [repository](https://github.com/anmonteiro/devcards-om-next) itself for more information.

## Examples / How-tos

-  Start by adding the `devcards-om-next` dependency information to your project:

{% highlight clojure %}
;; for Leiningen:
[devcards-om-next "0.3.0"]
{% endhighlight %}


-  Require the `devcards-om-next` namespace, as well as the macros you intend to use:

{% highlight clojure %}
(ns my-ns.core
  (:require [devcards-om-next.core :as don
             :refer-macros [om-next-root defcard-om-next]]
            [om.next :as om :refer-macros [defui]]))
{% endhighlight %}

-  Write your cards in the normal reloadable manner. `om-next-root` is the simplest of the two. `defcard-om-next` is a shortcut for `defcard` plus `om-next-root`. Both take an Om Next component and a reconciler, but they can also take a state map or atom instead. Below is a small example. I encourage you to run it with [Figwheel](https://github.com/bhauman/lein-figwheel), increment the counter, modify e.g. the button label and watch your changes being pushed to the browser as the component's local state remains unchanged <sup><sub>1</sub></sup>. Pretty cool!

{% highlight clojure %}
;; use ^:once meta in `defui`
(defui ^:once Counter
  Object
  (initLocalState [this]
    {:val 1})
  (render [this]
    (let [{:keys [val]} (om/get-state this)]
      (dom/div nil
        (str "val: " val)
        (dom/button
          #js {:onClick #(om/update-state! this update :val inc)}
          "inc!")))))

;; defonce the reconciler
(defonce counter-reconciler
  (om/reconciler {:state {}
                  :parser {:read (fn [] {:value {}})}}))

;; the usual `defcard` calls `om-next-root`
(defcard om-next-root-example
  "`om-next-root` takes a component class and (optionally)
   a map with the state or a reconciler"
  (om-next-root Counter))

;; `defcard-om-next` takes every normal `defcard` argument
;; (documentation, devcard, options, etc.), and the arguments of `om-next-root`
(defcard-om-next defcard-om-next-example
  "`defcard-om-next` example with a Component class and a reconciler"
  Counter
  counter-reconciler)
{% endhighlight %}

I hope these new helpers are useful in your journey writing reloadable Om Next cards. Thanks for reading!

---

<sup><sub>1</sub></sup> keep in mind that you must still follow the recommendations in the [reloadable code checklist]({% post_url 2016-01-21-writing-om-next-reloadable-code-a-checklist %}) to see this in action *i.e.*, you must supply a reconciler that has been defined with `defonce` for it to work. The `(om-next-root Component)` or `(defcard-om-next my-card Component)` shortcuts don't count as reloadable (they define a reconciler under the hood everytime) and will therefore reset the component's local state.
