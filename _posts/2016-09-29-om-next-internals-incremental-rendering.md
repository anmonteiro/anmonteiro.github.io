---
layout: post
title: "Om Next internals: Incremental Rendering"
tags: clojure clojurescript om
---

The phrase "incremental rendering" is frequently thrown around in the context of
Om Next's design. This post is an attempt to clarify what the concept of incremental rendering is
all about, what it does for your Om Next applications and how you can take advantage
of its properties.


<!--more-->


<div style="margin-bottom:30px">
  <img style="max-width:45%;margin:0 auto" src="https://cloud.githubusercontent.com/assets/661909/18785824/d4a58916-819a-11e6-8ed4-13165501e9b9.png">
</div>


## First things first

Some of the properties behind Om Next's design make it possible to perform a number
of optimizations under the hood. These optimizations are mostly driven by the fact
that components are annotated with query expressions and identity. One example of
such optimizations is behind the [solution](https://github.com/omcljs/om/pull/650)
for [issue #556](https://github.com/omcljs/om/issues/556): transacting large values
or reading large data sets is not slow anymore <sup id="fnref:1"><sub><a href="#fn:1">1</a></sub></sup>.

Incremental rendering is another such optimization in Om Next, based on its knowledge
about an application's data requirements. In plain React, re-rendering always initiates
at the **root component**, whether its children (in the tree) end up updating or
not. This means that each node in the component tree gets asked if it needs to update
— via the `shouldComponentUpdate` lifecycle method. Om Next, on the other hand, knows
exactly what data components need, which means it can always start diffing their
props at the root of the **concrete subtrees** that need the data related to transactions.
The next image compares React and Om Next's updating phases after a transaction that
originated at the red node.

<div style="display:table; margin: 30px 0">
  <figure style="display:table-cell">
    <img style="max-width:50%; margin: 0 auto" src="https://cloud.githubusercontent.com/assets/661909/18786506/87c5eb28-819e-11e6-8610-af5217738dee.png" alt="React rendering" />
    <figcaption class="caption">React's update phase</figcaption>
  </figure>
  <figure style="display:table-cell">
    <img style="max-width:50%; margin: 0 auto" src="https://cloud.githubusercontent.com/assets/661909/18786505/87a29114-819e-11e6-8aa5-c50ea811e06f.png" alt="Om Next rendering" />
    <figcaption class="caption">Om Next's update phase</figcaption>
  </figure>
</div>

## How can this work?

Astute readers might now be asking themselves — but how can incremental rendering
be made to work, if the Om Next parser dispatches on the top-level keys in a query?
Well, that's the entire purpose of path metadata and `om.next/full-query`. When
updating a subtree, Om Next does two things. Firstly, it calls the parser with the
`full-query` of the component rooted at that subtree — which is really just a fancy
way of saying "give me a query starting at the root of my application, but narrowly
focused at the current component's query". It then extracts the data relevant to
the component that is updating, which is located at its data path. Cool stuff, right?
Even better, this behavior is extensible through the `:ui->props` key in the reconciler!

If the above sounded too dense, here's a practical example:

- Say we have an application that shows 2 tabs. We might have the components below:

```clojure
(defui TabInfo
  static om/IQuery
  (query [this]
    [:info/id :info/name :info/items]))

(defui Tab
  static om/IQuery
  (query [this]
    [:tab/title {:tab/info (om/get-query TabInfo)}]))

(defui Root
  static om/IQuery
  (query [this]
    [{:tab1 (om/get-query Tab)}
     {:tab2 (om/get-query Tab)}]))
```

- Now let's imagine that the `TabInfo` component in tab #2 has performed a transaction
that adds more items to its `:info/items` list. Check out the differences below
between the application's root query and the `full-query` of the transacting component:

```clojure
;; Application's root query
[{:tab1 [:tab/title
         {:tab/info [:info/id :info/name :info/items]}]}
 {:tab2 [:tab/title
         {:tab/info [:info/id :info/name :info/items]}]}]

;; `om.next/full-query` of tab #2's `TabInfo`
[{:tab2 [{:tab/info [:info/id :info/name :info/items]}]}]
```

As you can see, the `full-query` is narrowly focused at the specific data requirements
that `TabInfo` declares. Two beneficial consequences follow: for one thing, it allows
the parser to dispatch on the same key as the root query; additionally, it makes
`om.next/db->tree`'s data denormalization perform faster, as we're only interested
in a specific subset of the data when compared to the application's root query.

- What about the "data path" mentioned above? What is that?

The data path of a given component is simply a vector of keywords that describe how
we can get to the query of a given component starting from the query of an applications'
root component. In our example above, the path of tab #2's `TabInfo` would be
`[:tab2 :tab/info]`. This means that Om Next can simply use `get-in` in the result
of parsing and pass the correct data to the updating component(s).

## Wrapping up

I hope this article helps you understand some of the inner workings that make Om
Next awesome :-) In a next post, I'll talk about how we can optimize incremental
rendering even further with "path optimization".

Stay tuned, and thanks for reading!


---

<div id="fn:1">
  <sup><sub>1</sub></sup> <sub>Om Next's props are annotated with their "path" for
various internal purposes. Before, we naively walked the data structure that resulted
from parsing. Now we follow the data along the query path and only annotate the
matches. <a href="#fnref:1"><img draggable="false" class="emoji" alt="↩" src="/public/img/top.svg"></a></sub>
</div>
