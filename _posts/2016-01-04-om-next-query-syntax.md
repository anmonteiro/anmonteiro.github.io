---
layout: post
title: Om Next Query Syntax Explained
tags: clojure clojurescript om
---

As more people start tinkering with Om Next, similar questions keep popping up increasingly often. While this is a natural thing given any new learning efforts, there can never be too many resources when we start learning something new. This write-up is an attempt to get people up and running with Om Next's query syntax by providing comprehensive examples and a quick syntax reference for the future.

<!--more-->

## **Read queries**

This section covers the syntax for read queries, which are the ones we put into components that implement the `IQuery` protocol. The examples start out with the simplest form, progressing to more complex use cases as more syntax is revealed.

### Property read

The simplest, self-explanatory case of reading a single property.

{% highlight clojure %}
[:some/key]
{% endhighlight %}

### Parameterized property read

A property read that takes in one or more parameters (possibly defined in a component's implementation of the `IQueryParams` protocol). These parameters are passed as the third argument to the `read` parsing function.

{% highlight clojure %}
[(:some/key {:some/param 42})]

;; Using it in IQuery & IQueryParams
(defui SomeComponent
  static om/IQueryParams
  (params [this]
    {:some/param 42})
  static om/IQuery
  (query [this]
    '[(:some/key {:some/param ?some/param})]))
{% endhighlight %}

### Join query

A join refers to reading a property of the state, e.g. a vector of elements, while specifying the exact (sub-)set of sub-properties that should be read for each item in that vector.

{% highlight clojure %}
;; given this state
(def state {:some/key [{:subkey/one 1
                        :subkey/two 2
                        :subkey/three 3}
                       {:subkey/one 1
                        :subkey/two 2
                        :subkey/three 3}]})

;; this query will yield the elements of `:some/key`
;; containing only the properties `:subkey/one` and `:subkey/two`
[{:some/key [:subkey/one :subkey/two]}]

;; this one reads every sub-key
'[{:some/key [*]}]
{% endhighlight %}

### Parameterized join query

As with property query, we can also parameterize joins. The syntax for a parameterized join follows.

{% highlight clojure %}
[({:some/key [:subkey/one :subkey/two]} {:some/param 42})]
{% endhighlight %}

### Reference (Idents & Links) queries

When working with normalized data, using an `Ident` reference in a query will direct the Om Next parser to lookup the element with that reference at the root of the application state.

{% highlight clojure %}
;; using an `ident` will yield (get-in state [:item/by-id 0])
[[:item/by-id 0]]

;; Using a `_` will produce (get-in state [:active/panel])
'[[:active/panel _]]
{% endhighlight %}

### Union query

Certain types of applications require us to handle heterogeneous data that share the same parent. Union queries provide the basis to handle such heterogeneity by allowing us to define just that — there might live different pieces of data under a certain application state key.

{% highlight clojure %}
;; Given the following app state:
(def state {:items/list [{:item/id 0 :item/type :foo :foo/value 42}
                         {:item/id 1 :item/type :bar :bar/value 43}]})

;; Foo has property `:foo/value`
(defui Foo
  static om/Ident
  (ident [this {:keys [item/type item/id]}]
    [type id])
  static om/IQuery
  (query [this]
    [:item/id :item/type :foo/value]))

;; Bar has property `:bar/value`
(defui Bar
  static om/Ident
  (ident [this {:keys [item/type item/id]}]
    [type id])
  static om/IQuery
  (query [this]
    [:item/id :item/type :bar/value]))

;; An item can be either Foo or Bar
(defui Item
  static om/IQuery
  (query [this]
    {:foo (om/get-query Foo)
     :bar (om/get-query Bar)}))

;; The item list contains items (either Foo items or Bar items)
(defui ItemList
  static om/IQuery
  (query [this]
    [{:items/list (om/get-query Item)}]))

;; the entire (ItemList) query will then be:
[{:items/list {:foo [:item/id :item/type :foo/value]
               :bar [:item/id :item/type :bar/value]}}]
{% endhighlight %}

### Recursive query

You can also specify Om Next queries that recurse into themselves. This is useful when your components can host themselves. The following example illustrates this.

{% highlight clojure %}
;; say we have the following app state. notice that each
;; node can contain children of its type. this is where
;; recursion is useful
(def state {:tree {:id 0 :value 42
                   :children [{:id 1 :value 43
                               :children [{:id 2 :value 99
                                           :children []}]}
                              {:id 3 :value 101
                               :children []}]}})

;; We would need 2 components. One which expresses a node:
;; (the new thing here is the symbol '... — it represents
;; the recursion)
(defui Node
  static om/IQuery
  (query [this]
    '[:id :value {:children ...}]))

;; One that expresses the node tree
(defui Tree
  static om/IQuery
  (query [this]
    `[{:tree ~(om/get-query Node)}]))

;; the entire query would be:
'[{:tree [:id :value {:children ...}]}]
;; we can also specify a recursion limit by specifying
;; a number instead of '... .
;; the query below will only allow 5-depth recursion
[{:tree [:id :value {:children 5}]}]
{% endhighlight %}


### Recursive union query

Our last example is a composition of the last two. What if we have heterogeneous recursive components? That almost makes my brain hurt! Let's get into it:

{% highlight clojure %}
;; heterogeneous recursive state
(def state
  {:tree {:id 0 :node/type :node/foo
          :foo/value 42
          :children [{:id 1 :node/type :node/foo
                      :bar/value 43
                      :children [{:id 2 :node/type :node/bar
                                  :bar/value 99
                                  :children []}]}
                     {:id 3 :node/type :node/bar
                                 :bar/value 101
                                 :children []}]}})

;; ':node/bar' nodes contain `:bar/value`
(defui BarNode
  static om/IQuery
  (query [this]
    '[:id :node/type :bar/value {:children ...}]))

;; ':node/foo' nodes contain `:foo/value`
(defui FooNode
  static om/IQuery
  (query [this]
    '[:id :node/type :foo/value {:children ...}]))

;; An ItemNode can be either FooNode or BarNode
(defui ItemNode
  static om/Ident
  (ident [this {:keys [node/type id]}]
    [type id])
  static om/IQuery
  (query [this]
    `{:node/foo ~(om/get-query FooNode)
      :node/bar ~(om/get-query BarNode)}))

(defui Tree
  static om/IQuery
  (query [this]
    `[{:tree ~(om/get-query ItemNode)}]))

;; the complete query:
'[{:tree {:node/foo [:id :node/type :foo/value {:children ...}]
          :node/bar [:id :node/type :bar/value {:children ...}]}}]

;; again, expressing a recursion limit
[{:tree {:node/foo [:id :node/type :foo/value {:children 5}]
         :node/bar [:id :node/type :bar/value {:children 5}]}}]
{% endhighlight %}

## **Mutations**

Mutation syntax is pretty simple in the sense that there aren't so many combinations one can compose. The cases of a simple mutation and a mutation with parameters are shown below. Thanks for reading!

### Simple mutation

{% highlight clojure %}
[(do/something!)]

;; it would look like this in a call to `transact!`
(om/transact! c [(do/something!)])
{% endhighlight %}


### Parameterized mutation

Now, in order to pass parameters to a mutation, one can use the following syntax:

{% highlight clojure %}
[(do/something! {:some/param 42})]

;; which would look like this when calling `transact!`
(om/transact! c [(do/something! {:some/param 42})])
{% endhighlight %}


## **Everything in one place**

For future (and quick) reference, a single list with every example from this post follows. As a freebie, here's a reference card ([light](https://cloud.githubusercontent.com/assets/661909/12114476/81a8a37e-b3aa-11e5-9c3f-2986e2eaee78.png), [dark](https://cloud.githubusercontent.com/assets/661909/12114475/81a710b8-b3aa-11e5-9ece-78bdafb9af64.png)) with the contents below.

{% highlight clojure %}
;; Reads
[:some/key] ;; property read
[(:some/key {:some/param 42})] ;; parameterized property read

[{:some/key [:subkey/one :subkey/two]}] ;; join
'[{:some/key [*]}] ;; join (read all subkeys)
[({:some/key [:subkey/one :subkey/two]} {:some/param 42})] ;; parameterized join

[[:item/by-id 0]] ;; ident reference
'[[:active/panel _]] ;; link reference

[{:items/list {:foo [:item/id :item/type :foo/value]
               :bar [:item/id :item/type :bar/value]}}] ;; union query

'[{:tree [:id :value {:children ...}]}] ;; recursive query
[{:tree [:id :value {:children 5}]}] ;; recursive query with recursion limit

'[{:tree {:node/foo [:id :node/type :foo/value {:children ...}]
          :node/bar [:id :node/type :bar/value {:children ...}]}}] ;; recursive union query
[{:tree {:node/foo [:id :node/type :foo/value {:children 5}]
         :node/bar [:id :node/type :bar/value {:children 5}]}}] ;; recursive union query with recursion limit


;; Mutations

[(do/something!)] ;; simple mutation

[(do/something! {:some/param 42})] ;; parameterized mutation
{% endhighlight %}

### References

- [Official query expression grammar](https://github.com/omcljs/om/blob/9ea96efc0367d6b49a7aeb8eef5014fb55f3ba6e/src/main/om/next/impl/parser.cljc#L15-L22)
- [Datomic Pull Syntax Docs](http://docs.datomic.com/pull.html)
- [Om Wiki](https://github.com/omcljs/om/wiki)
