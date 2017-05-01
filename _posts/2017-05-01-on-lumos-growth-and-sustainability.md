---
layout: post
title: On Lumo's growth and sustainability
tags: clojure clojurescript lumo
---

This post reflects on Lumo's growth almost 6 months after its announcement,
shares the project's goals and communicates what you can do to help Lumo grow
into and even more full-featured ClojureScript environment. Read on!

<!--more-->

<a href="https://opencollective.com/lumo" target="_blank_">
  <img style="max-width: 70%;margin:0 auto" src="https://cloud.githubusercontent.com/assets/661909/25586993/d8239560-2e56-11e7-8f87-f6b9cbc2509f.png">
</a>

In less than 6 months, Lumo has by far outgrown every expectation I had created.
What started as a simple toy project has now become a tool that many of us use
daily, either as a Clojure playground or in some more intricate use cases such as
[Mach](https://github.com/juxt/mach), [Calvin](https://github.com/eginez/calvin),
[Unravel](https://github.com/pesterhazy/unravel) and some more.

<div class="message" style="font-size:1.5rem;font-style:italic;color:#8f5536">
  Today I'm launching an initiative to ensure the steady growth and long term
  viability of Lumo.
</div>

Lumo's demands are also already outgrowing what I had envisioned at first. And
while it may not sound like such, this is a very good thing. Going forward, I
predict the following are immediate needs that Lumo has.

## Project's goals

### Creating thorough documentation and develop a website

Lumo needs a website. And some documentation. This has been on my todo list for
a long time and I feel like we need to tackle it sooner rather than later. There
are costs associated with registering a domain name and hosting a website, along
with all the effort of developing the webpage and writing all the documentation.

### Have a logo designed

Given Lumo's current popularity, I believe having a logo designed aligns with the
project's direction and would love to have this done when launching a website.

### Sort out CI issues

Lumo has been having some [CI issues](https://twitter.com/anmonteiro90/status/852623330708410369).
While this has been solved short term, I'm fairly confident they will start showing
up again as more features are added, and that we will need to host our own continuous
integration service at some point in the future.

### Lumo build API

Lumo can currently build very simple
[ClojureScript projects with optimizations]({% post_url 2017-02-21-compiling-clojurescript-projects-without-the-jvm %}).
Bringing the Lumo build API and compiler toolchain to feature parity with the
regular JVM ClojureScript compiler is a goal that I believe warrants great benefits
to ClojureScript's reach.

### Even more

There is even more stuff in the pipes. Getting Lumo to work on the Raspberry Pi,
for one, is a big short term goal. Supporting more platforms and 32-bit architectures
is another that is potentially related to CI issues. Even more features are the
development of idiomatic ClojureScript I/O, shell and HTTP wrappers for Node.js's
APIs, getting Lumo on more package managers, and eventually tackling dependency
management and resolution.

## Today

Today I'm launching an initiative to ensure the steady growth and long term
viability of Lumo. I've opened an [OpenCollective](https://opencollective.com/lumo)
page for Lumo where you can pledge your support for the project. You can choose
to become a backer or a sponsor. Contributions can be one time, monthly or yearly,
and in the amount you choose (as little as $1!). Companies can become sponsors too.

Note that contributions are not meant to be for myself only. Any contributor that
devotes a substantial amount of time to working on a Lumo feature can choose to
submit an expense to the project's funding.

### Why Open Collective?

Open Collective' core value is transparency in contributions. This means that you
will always be able to see what the contributions your pledge are being used for.
Open Collective also lets project maintainers automatically issue invoices, so if
you need one (typically as a sponsor company) the process is very straightforward
for both parts. You can also cancel your sponsorship any time you'd like.

### What do sponsors get?

Now, as a potential sponsor to Lumo, you must be asking what is it that you get
for contributing to Lumo's Open Collective initiative. As a sponsor, you get
several benefits:

- as a sponsor, your company's logo displayed in the project's README for every visitor to see
- I will also take your input into consideration and you'll have a say in helping
steer Lumo's goals
- you will impact the speed at which new features are developed into Lumo's codebase.

## Parting thoughts

This initiative represents a lot to Lumo's viability going forward. I urge you to
consider backing or sponsoring Lumo to ensure its growth. Even if you don't back
the project, I would be extremely grateful if you could share this post and / or
the [Lumo Open Collective page](https://opencollective.com/lumo).

Thanks for reading!
