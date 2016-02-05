---
layout: post
title: An Exploration of Object Recursion Design Patterns with Om Next Recursive Queries - Part 2
tags: clojure clojurescript om
---

This is part two of a series of posts that aim to demonstrate how to build classical Software Engineering object recursion patterns in Om Next. In the [previous post]({% post_url 2016-01-07-exploration-patterns-om-next-part-1 %}), we explored the Om Next constructs of the Composite. This time around we will use the [Decorator](https://en.wikipedia.org/wiki/Decorator_pattern) design pattern to build a simple component hierarchy that provides runtime extensibility.

<!--more-->

## The Decorator design pattern

<div style="max-width:75%;margin:15px auto 0;">
  <img src="https://cloud.githubusercontent.com/assets/661909/12217911/81cb227e-b70f-11e5-814e-fa564fe5c021.png" alt="Decorator design pattern">
</div>

As with the Composite, the Decorator also appears in the [Gang of Four book](https://en.wikipedia.org/wiki/Design_Patterns). It can be viewed as a restricted form of the Composite (1-Recursion *vs* Composite's n-Recursion), although it serves a different purpose. The Decorator's aim is to add — or remove — functionality (*decorate*) to an object at runtime. The same can be achieved by subclassing, although that approach will only provide compile-time extensibility. As can be perceived by the diagram above, several decorators can form a chain, with each new decorator providing a new piece of functionality. The core object lies at the end of the decorator chain.


## The example

If you have read my [last post]({% post_url 2016-01-07-exploration-patterns-om-next-part-1 %}), you saw that we built an example that rendered squares inside other squares. The example we will build today will also have a geometric square — our core object — and we are going to add functionality that decorates it with pieces of text and/or images.
We adopt the nomenclature present in the pattern diagram, except for our concrete decorators, which we will call `TextDecorator` and `ImageDecorator`. Other than that, we need to define components for the `ConcreteComponent` and `Component`. The former implements the square rendering functionality, while the latter is responsible for combining the queries of both decorators and the core — `ConcreteComponent`.

### The data

The core object is just a representation of the square: its `width`, `height` and the `color`. Here's how it looks like:

<div style="margin-bottom: 20px;">
  <div id="dp-card-1"></div>
</div>

Now, the data in our decorators is quite similar to the Composite case, in the sense that it is recursive. However, since the Decorator pattern employs 1-ObjectRecursion, each data item in this example doesn't have a vector of children, but solely a "pointer" to the next decorator. As you can see below, we call this pointer `:next`. Notice how the data that represents the square is the end of the recursion.

<div style="margin-bottom: 20px;">
  <div id="dp-card-2"></div>
</div>

### The Om Next components (*or*: "Show me some code!")

We start by defining our `ConcreteComponent`. Its query is quite simple: the square's attributes.

{% highlight clojure %}
(defui ConcreteComponent
  static om/IQuery
  (query [this]
    '[:id :width :height :color]))
{% endhighlight %}

The concrete decorators are presented below. They each query for their own set of attributes; those represent the functionality they add to the core object. The only attributes our concrete decorators have in common are the `id` by which they are identified, and the recursion query (`{:next ...}`) which simply tells Om Next that we are expecting to find an object of the same type under that entry <sup><sub>1</sub></sup>.

{% highlight clojure %}
(defui ImageDecorator
  static om/IQuery
  (query [this]
    '[:id :decorator/image :image/max-width {:next ...}]))

(defui TextDecorator
  static om/IQuery
  (query [this]
    '[:id :decorator/text {:next ...}]))
{% endhighlight %}

How should `Component` be defined, then? Just like in the Decorator pattern diagram, it sits on top of our hierarchy, and delegates functionality to its child components. As such, it needs to aggregate the queries of all the children and define their identity. Our `Ident`s are defined using the following approach. We know that `TextDecorator`s have a `:decorator/text` attribute and `ImageDecorator`s have a `:decorator/image` attribute. If we find none in `props`, we are in the presence of the core object itself. `Component` is shown below.

{% highlight clojure %}
(defui Component
  static om/Ident
  (ident [this {:keys [id decorator/text decorator/image]}]
    (cond
      (not (nil? text)) [:text id]
      (not (nil? image)) [:image id]
      :else [:component id]))
  static om/IQuery
  (query [this]
    {:text (om/get-query TextDecorator)
     :image (om/get-query ImageDecorator)
     :component (om/get-query ConcreteComponent)}))
{% endhighlight %}

The last piece of our example is a component that contains the top-level query which finalizes the definition of the union query. This is also our root component. We will call it `DecoratorApp`.

{% highlight clojure %}
(defui DecoratorApp
  static om/IQuery
  (query [this]
    [{:decorator/app (om/get-query Component)}]))
{% endhighlight %}

## The end result

After we implement our Om parser and render methods, we see the final result. The card below shows the result of passing only the square data to the example we just built. Pretty boring, heh? Scroll down!

<div style="margin-bottom: 20px;">
  <div id="dp-card-3"></div>
</div>

However, if we pass the state that contains our decorators, we see that the previously boring square has been decorated with that data! One more thing: if you simply supply data that has more (or less, for that case) decorators to our example, those will be reflected in our core object. We have thus achieved runtime extensibility.

<div style="margin-bottom: 20px;">
  <div id="dp-card-4"></div>
</div>

The complete source code for this post is published in this [gist](https://gist.github.com/anmonteiro/2b282aa35380558a8b1d#file-decorator-cljs).

Thanks for reading!

---

<sup><sub>1</sub></sup> <sub>here, "an object of the same type" refers to any one that the union query satisfies (which might not share the same query). Simple recursion can also be specified in Om Next, which allows to strictly recurse into an object which has the exact same query. For tips on how to use that syntax, visit [my post]({% post_url 2016-01-04-om-next-query-syntax %}) on that topic</sub>

<script>
{% include  exploration-dp-2.js %}
</script>
