---
layout: post
title: Jekyll related posts revamped
tags: jekyll
---

[Jekyll](http://jekyllrb.com/) hosted in [Github Pages](https://pages.github.com) features a simple "Related posts" variable per post page, which contains the 10 most recent posts. As one might think, these most *recent* posts might not quite correspond, at all, to any *related* posts. So I devised a way to show recent **and** related posts in this blog using solely [Liquid](https://github.com/Shopify/liquid/wiki) tags.

<!--more-->

It works by going through the related posts collection and selecting the posts that contain any tags in common with the current post, up to a defined limit. If there are enough posts to fill that limit, fine, it stops there. Otherwise, it goes again through the most recent, possibly unrelated posts, and outputs them until the limit is finally reached.

It can also be easily adapted to work with Jekyll's categories instead of tags, by changing at most 3 or 4 lines of code.
The full gist is presented below.

{% gist anmonteiro/e471cc7a491d4069636a %}

If you have any questions or suggestions, don't hesitate to drop me a line, either on [Twitter](https://twitter.com/{{ site.author.twitter_username }}) or by [email](mailto:{{ site.author.email }}).
