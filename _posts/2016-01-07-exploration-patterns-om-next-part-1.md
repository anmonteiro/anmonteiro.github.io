---
layout: post
title: An Exploration of Object Recursion Design Patterns in Om Next - Part 1: Composite
tags: clojure clojurescript om
---

The recent [landing of recursive union queries](https://github.com/omcljs/om/pull/562) in Om Next allows for defining recursive, heterogeneous data in a simple, expressive way. In a series of posts, I will explore how this conjugates with well-known Software Engineering structural design patterns that are based on object recursion. In this part 1 we will put together a simple component hierarchy that uses the [Composite](https://en.wikipedia.org/wiki/Composite_pattern) design pattern. Let's dig into it.

<!--more-->

## The Composite design pattern

<div style="max-width:75%;margin:15px auto 0;">
  <img src="https://cloud.githubusercontent.com/assets/661909/12181450/8858f8ac-b582-11e5-99e2-3c11f1913801.png" alt="Composite design pattern">
</div>

The Composite is part of the design pattern collection in the [Gang of Four book](https://en.wikipedia.org/wiki/Design_Patterns). Its purpose is to **compose** trees of objects that fulfill the same contract by building and iterating over them. The secret weapon here is that, while iterating, there is no need to know if we're working on a leaf node or an inner node — we can simply treat every node in the same way. Inner nodes will take care of iterating over their children in the process.


## Our example

### The data

In our simplified example, we want to render a square that can arbitrarily contain other squares. Using the nomenclature in the above diagram, we need to define Om Next components for both the `Leaf` and the `Composite`. `Composite` components can have `children`, whereas `Leaf` components cannot. We will also have our version of `Component`, which aggregates the queries for both others, and dispatches rendering to them <sup><sub>1</sub></sup>.

We start with the data below. Each square contains attributes for its width, height and color. Each item also has an `id`; this reveals helpful in normalizing the data.

<div style="margin-bottom: 20px;">
  <div id="dp-card-1"></div>
</div>

### The Om Next components

Our `Leaf` and `Composite` components are shown below <sup><sub>2</sub></sup>. Their queries are trivial, in the sense that they just declare the attributes we have talked about before. The only exception, which you might have not seen before, is the `{:children ...}` part. This is how we declare recursion in Om Next. Refer to my post about Om Next's [query syntax]({% post_url 2016-01-04-om-next-query-syntax %}) where I explain this and other bits in detail.

```clj
(defui Leaf
  static om/IQuery
  (query [this]
    '[:id :width :height :color]))

(defui Composite
  static om/IQuery
  (query [this]
    '[:id :width :height :color {:children ...}]))
```

Now that we have declared our most concrete components, we need to declare the one that is analogous to the Component in the Composite pattern diagram. Our `Component` needs to aggregate the queries of the others, and declare its `Ident`, a unique key by which each data item is identified in our example. Besides defining an `id`, we could also have a the type of an item in our data; in our simple example this is not necessary as we know leaves can't have children. It looks like this:

```clj
(defui Component
  static om/Ident
  (ident [this {:keys [id children]}]
    (if-not (nil? children)
      [:composite id]
      [:leaf id]))
  static om/IQuery
  (query [this]
    {:leaf (om/get-query Leaf)
     :composite (om/get-query Composite)}))
```

We will need a root component, which we will call `CompositeApp`. This one helps define the union query in `Component`.

```clj
(defui CompositeApp
  static om/IQuery
  (query [this]
    [{:composite/item (om/get-query Component)}]))
```

Once we have properly implemented our parser and render methods, we get the following result, which is exactly what we intended. Squares that contain other squares.

<div style="margin-bottom: 20px;">
  <div id="dp-card-2"></div>
</div>


You can find the complete source code for this post [here](https://gist.github.com/anmonteiro/2b282aa35380558a8b1d).

In the next post we will talk about the [Decorator](https://en.wikipedia.org/wiki/Decorator_pattern) design pattern. Stay tuned!

---

<sup><sub>1</sub></sup> <sub>these components are not really heterogeneous in the sense that they only differ in the `children` attribute and we could get away with just one component (a leaf would be an item without children). However, the purpose here is to demonstrate the Composite design pattern and, as such, we'll be a little more verbose.</sub>

<sup><sub>2</sub></sup> <sub>render methods are omitted for brevity.</sub>

<sup><sub>3</sub></sup> <sub>at the time of this writing, you'll need to clone Om Next from master and install it in your local repository in order to run the example code</sub>

<script>
{% include  exploration-dp-1.js %}
</script>
