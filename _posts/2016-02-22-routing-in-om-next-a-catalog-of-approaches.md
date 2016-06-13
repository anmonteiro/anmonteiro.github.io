---
layout: post
title: Routing in Om Next — a Catalog of Approaches
tags: clojure clojurescript om
---

Although a standard routing solution is an orthogonal concern to Om Next's design and, at the time of this writing, there is still [ongoing development](https://github.com/omcljs/om/wiki/Routing-Support) with the objective of introducing simpler routing hooks, there are already several ways in which one can add proper route navigation to an Om Next app. This post aims to decrease the general community confusion around this topic by introducing a variety of different approaches that can be used to integrate routing in an Om Next app.

<!--more-->


## **The end goal**

The example we will be working with throughout this post is presented below. It resembles a normal web application that has two routes: the **Home** page and an **About** page. Feel free to play with the links in the example's sidebar, and verify that the current route is updated, as well as the page's main content.

<div class="no-indent" style="margin-bottom: 20px;">
  <div id="dp-card-1"></div>
</div>


## **The Catalog**

This section will demonstrate different ways of accomplishing the behavior shown in the example above, namely using queries with unions, using `set-query!` and by leveraging the power of `subquery`. For each one, we will see the components, their queries and the parsing logic that is necessary to accomplish such behavior. The render logic falls out of the scope of this writing and is only shown when strictly necessary, for the sake of brevity. The `Home` and `About` components are common to all examples and are shown below. They each declare which properties they need from the state in their queries.

{% highlight clojure %}
(defui Home
  static om/IQuery
  (query [this]
    [:home/title :home/content]))

(defui About
  static om/IQuery
  (query [this]
    [:about/title :about/content]))
{% endhighlight %}

We also define helpers that map routes to their components and the factories that create instances of such components:

{% highlight clojure %}
(def route->component
  {:app/home Home
   :app/about About})

(def route->factory
  (zipmap (keys route->component)
    (map om/factory (vals route->component))))

{% endhighlight %}

Throughout these sections, we will use the same `app-state` and the same way of representing routes. The state is shown below. We keep the current route, which in our case is the **Home** route, and the data we present in this and the **About** route.

<div style="margin-bottom: 20px;">
  <div id="dp-card-2"></div>
</div>

Our routes are represented by Om Next `idents`. Since we don't have any route that refers to an element in a collection, the second element of our routes will always be the `_` character. However, if we had *e.g.* a list of people in our app, showing the profile of the person identified by the ID 3 would be denoted by the route `[:app/people 3]`.


### **Routing with Union Queries**

Our first example takes advantage of the expressiveness that union queries provide to declare hetereogenous user interfaces. Our `Root` component's query needs the current route, expressed by `:app/route` in its query, and the queries for all the components for which there is a route. Our simplistic case only has two routes, so the generated query for `Root` will be:

{% highlight clojure %}
[:app/route
{:route/data {:app/home [:home/title :home/content]
              :app/about [:about/title :about/content]}}]
{% endhighlight %}

The `Root` component chooses which sub-component to render based on the current route found in its props. A rather simplistic `render` method for our root component is included in the component definition below:

{% highlight clojure %}
(defui Root
  static om/IQuery
  (query [this]
    [:app/route
    {:route/data (zipmap (keys route->component)
                   (map om/get-query (vals route->component)))}])
  Object
  (render [this]
    (let [{:keys [app/route route/data]} (om/props this)]
      ((route->factory (first route)) data))))
{% endhighlight %}

The parser code has two responsibilites: the `read` function must return only the data for the current route, and the `mutate` function needs to know how to change the app's route. An example of how this could be achieved is presented in the snippet below.

{% highlight clojure %}
(defmulti read om/dispatch)
(defmulti mutate om/dispatch)

(defmethod read :route/data
   [{:keys [state query]} k _]
   (let [st @state
         route (get st :app/route)
         route (cond-> route
                 (= (second route) '_) pop)]
     ;; since the route is an `ident`, it could also
     ;; be passed as the second argument to `db->tree`
     ;; if our data was normalized
     {:value (get-in st route)}))

(defmethod read :app/route
   [{:keys [state query]} k _]
   (let [st @state]
     {:value (get st k)}))

(defmethod mutate 'change/route!
  [{:keys [state]} _ {:keys [route]}]
  {:value {:keys [:app/route]}
   :action #(swap! state assoc :app/route route)})
{% endhighlight %}

Nothing else is needed. Routing will work once you plumb everything together with the help of the reconciler.


### **Routing with `set-query!`**

In the previous example, we needed to include every subcomponent's query in the `Root`'s union query so that the query for the current route was already in a union branch when the route changed. In this example we will see that we can implement routing by including the current route's query on demand, only when the route changes.

A simplistic `Root` component for this case looks like the one below. We have the current route's query in the `:route/data` parameter, which is initially empty. Before the component first mounts, we swap in the query for the initial route.

{% highlight clojure %}
(defui Root
  static om/IQueryParams
  (params [this]
    {:route/data []})
  static om/IQuery
  (query [this]
    '[:app/route {:route/data ?route/data}])
  Object
  (componentWillMount [this]
    (let [{:keys [app/route]} (om/props this)
          initial-query (om/get-query (route->component (first route)))]
      (om/set-query! this {:params {:route/data initial-query}})))
  (render [this]
    (let [{:keys [app/route route/data]} (om/props this)
          active-component (get route->factory (first route))]
      (active-component data))))
{% endhighlight %}

Because the root component's query is now changed on demand, the only modification that we need to introduce in our parser code is a call to `set-query!` in the `change/route!` mutation, so that we change the root query to include the new route's needed information. The complete parser code is presented below.

{% highlight clojure %}
(defmulti read om/dispatch)
(defmulti mutate om/dispatch)

(defmethod read :route/data
  [{:keys [state] :as env} k _]
  (let [st @state
        route (first (:app/route st))]
    {:value (get-in st [route])}))

(defmethod read :app/route
   [{:keys [state query]} k _]
   (let [st @state]
     {:value (get st k)}))

(defmethod mutate 'change/route!
  [{:keys [state component]} _ {:keys [route]}]
  {:value {:keys [:app/route]}
   :action (fn []
             (swap! state assoc :app/route route)
             (om/set-query! component
               {:params {:route/data (om/get-query (route->component (first route)))}}))})
{% endhighlight %}


### **Routing with `subquery`**

`subquery` is a nice little function that has been receiving very little attention in Om Next. It is, however, a very powerful construct that solves the routing problem for a bounded number of subviews in a very clean way <sup><sub>1</sub></sup>. All you really have to do it attach a React `ref` to the subviews. `subquery` takes care of the rest.

Let's see an example. This approach pushes all the routing logic into the `query` function of the `Root` component. Our sub-components will be rendered with a `ref` which is exactly the keyword by which their route is identified. We use this knowledge in the `query` function to plug in the correct query at runtime.

{% highlight clojure %}
(defui Root
  static om/IQuery
  (query [this]
    (let [subq-ref (if (om/component? this)
                     (-> (om/props this) :app/route first)
                     :app/home)
          subq-class (get route->component subq-ref)]
      [:app/route {:route/data (om/subquery this subq-ref subq-class)}]))
  Object
  (render [this]
    (let [{:keys [app/route route/data]} (om/props this)]
      ((route->factory (first route)) (assoc data :ref (first route))))))
{% endhighlight %}

In this case, the parser code is exactly the same as in the example of routing using union queries, and is not included again.


## **Closing thoughts**

In this post, I've presented 3 different alternatives to approach routing in Om Next. I hope it helps you decide which one is the most useful for your use case. You can find the complete source code for the examples in this post [here](https://github.com/anmonteiro/anmonteiro.github.io/tree/master/assets/cljs/om_next_routing).

If you have any questions or suggestions, don't hesitate to contact me either on Twitter ([@anmonteiro90](https://twitter.com/anmonteiro90)) or by leaving a comment in the section below. As always, thanks for reading!


<script type="text/javascript" src="/public/js/om_next_routing.js"></script>



--- 

<sup><sub>1</sub></sup> <sub>Note that this method will not be a clean solution if you want to route to arbitrary elements in a list, since the logic of adding `ref`s to every element in a list will soon become complex enough.</sub>
