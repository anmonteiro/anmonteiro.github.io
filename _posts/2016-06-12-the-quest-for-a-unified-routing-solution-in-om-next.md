---
layout: post
title: The quest for a unified routing solution in Om Next
tags: clojure clojurescript om
---

There are several different options to implement routing in an Om Next application. However, any  one of those approaches is not straightforward to accomplish, and often requires more time than one would like to get right. Until now.

<!--more-->

<div class="message">
  <strong>TL;DR</strong>: I've developed <a href="https://github.com/anmonteiro/compassus">Compassus</a>, a routing library for Om Next.
</div>

#### **Disclaimer**

The meaning that **routing** is intended to convey throughout this post is the ability to swap UI components in and out of an application's main view according to some parameter (the "selected route"). This is not to be confused with URL or path navigation, terms that I will use where appropriate.

## The problem

Although my [routing catalogue post]({% post_url 2016-02-22-routing-in-om-next-a-catalog-of-approaches %}) details a number of different ways one can implement routing in an Om Next application, adding such a feature — which has mandatory presence in the type of applications we are building today — comes at a cost. Firstly, it is most definitely not straightforward for beginner users to integrate into their apps (and let's face it, given how long Om Next has been around, we are all beginners). Moreover, we end up writing an unavoidable amount of boilerplate code that will easily be repeated across every project we have to provide routing for. Finally, writing the parser code is quite challenging and a very probable source of bugs, especially when integrating remote calls.

## Embracing tradeoffs

The fact that there are many different alternatives to approach routing implementations is at the same time a very good thing — it really shows how powerful Om Next is at providing enough building blocks that can be assembled in very flexible ways — and not such a great thing, exactly because there are so [many alternatives](https://en.wikipedia.org/wiki/The_Paradox_of_Choice).

Each choice comes with its own benefits, but is not short of tradeoffs. Routing with `om.next/subquery` is very concise, but it really only works for a bounded number of routes, provided each has its own React ref. Using `om.next/set-query!` is probably easier to implement due to simpler parser integration, but we lose the holistic view of the queries in our application. Routing via union queries is, in my personal opinion, the most powerful choice, but writing working parser code for every case is possibly much trickier than in every other scenario.

## Settling for a solution

Stemming from both the above motivation and my own struggle to implement a routing solution in the various projects I've been working on lately, I started thinking of ways to simplify all the work that needs to be put into integrating routing in an Om Next application. A usable solution for this problem would require working through several requirements:

<style>
ul li > ul {
  margin-bottom: 0;
}
</style>

- An idiomatic, **data-first representation** for application routes
- **Automatic routing** from the route representation
  - A route representation should be enough to have working routing in an application
- Seamless integration with Om Next
  - without *a priori* opinions about reconciler options
- Simplified (**not limiting**) parser code for library consumers
- Built-in support for URL navigation and HTML5 browser history
  - providing seamless integration with existing routing libraries such as [bidi](https://github.com/juxt/bidi) and [secretary](https://github.com/gf3/secretary)


After working through these requirements, I settled for a solution. [Compassus](https://github.com/compassus/compassus) is the product of this work, and you can find more information in its [GitHub repository](https://github.com/compassus/compassus). I've also made the API docs available in [this link](https://anmonteiro.com/compassus/doc/0.2.1), as well as some [devcards examples](https://compassus.github.io/compassus/devcards).

I hope it is as useful for your applications' routing needs as it has been for me. All feedback is appreciated. As always, thanks for reading!


---

*<small>Thanks to Tony Kay for reading a draft of this post.</small>*
