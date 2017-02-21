---
layout: post
title: Om Next Study Material
tags: clojure clojurescript om
---

It has been a while since Martin Klepsch posted his [Om Next reading list](http://www.martinklepsch.org/posts/om-next-reading-list.html). If you're learning Om Next or planning to, there are a bunch more excellent resources that have recently appeared, and this post compiles a list of some of them.

<!--more-->

### **David Nolen's talks**

[David Nolen](https://twitter.com/swannodette) has recently given a few talks presenting Om Next. They are presented in this section in chronological order &mdash; some content from previous talks might already be slightly outdated, but they all contain very good content (you can always get updated content every next talk :-) ).


#### [**EuroClojure Om Next talk**](https://www.youtube.com/watch?v=ByNs9TG30E8)
This talk, which dates back to July 2015, presents the top-level concepts behind the general design of Om and the motivation for Om Next. It features a very small preview of Om Next, which wasn't still in alpha at the time.


#### [**ClojureNYC Meetup talk**](http://livestream.com/intentmedia/events/4386134)
David presented Om Next at a Clojure meetup in NYC back in the end of September. This talk presents more in-depth concepts about Om Next and a simple TodoMVC demo at the end.

#### [**"Hello Om Next!" talk at SoftwareGR**](https://www.youtube.com/watch?v=xz389Ek2eS8)
At the end of October, David gave a more comprehensive talk at [SoftwareGR](http://softwaregr.org/), a software development interest group in Michigan. This talk features some problems and their Om Next-flavored solutions, such as remoting, HTTP caching and UI testing.

#### [**Clojure/Conj talk**](https://www.youtube.com/watch?v=MDZpSIngwm4)
This is the most up-to-date talk about Om Next until now, dating back to November, and in it David presents a lot of content, at an incredible pace! Among other things, this is where `temp-id`s were talked about for the first time. Refer to this one for the most up-to-date content.

### **Tutorials!**

#### [**Om Wiki Tutorials**](https://github.com/omcljs/om/wiki#om-next)
Needless to say that you should definitely go through *every* Om Next tutorial on the Wiki page. There are plenty of tutorials already written, and some more to come, so keep checking back!

#### [**Tony Kay's Om Tutorial**](https://github.com/awkay/om-tutorial)
This [devcards-based](http://awkay.github.io/om-tutorial/) tutorial goes through every Om Next concept and features exercises for the reader to practice what they have learnt in every section.

### **Reading actual code**

Reading source code is my favorite way of learning how to use a certain language or framework, and these are some code resources that you definitely want to check:

- Om's [source code](https://github.com/omcljs/om/blob/master/src/main/om/next.cljc) and [tests](https://github.com/omcljs/om/blob/master/src/test/om/next/tests.cljc) are always a nice way to get more in-depth knowledge on how the internals work;
- Some gists have appeared [here](https://gist.github.com/anthgur/2cddf81e04ea78f372c6) and [there](https://gist.github.com/tomconnors/c1cceaae84fd059e37a3) with some example Om code. These two in particular show ways of achieving application routing with Om Next;
- Several people have also open-sourced their example apps. You can find some [here](https://github.com/swannodette/om-next-demo), [here](https://github.com/Jannis/om-next-kanban-demo) and [here](https://github.com/advancedtelematic/parking-visualization).

---

I hope all the above content is useful in your path learning Om Next. I'd love to hear your suggestions regarding any additional content that you have found helpful during your Om Next study path. Happy hacking!
