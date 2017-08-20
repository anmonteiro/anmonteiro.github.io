---
layout: post
title: Shipping a (very simplistic) ReasonReact app
tags: reason ocaml
---

_I used [Reason](https://reasonml.github.io/) and [React](https://reasonml.github.io/reason-react/)
to build a simple example app: [ReKeys](https://anmonteiro.com/rekeys/). Here's
what I learned._

<!--more-->

<div style="margin:20px 0 25px">
  <img style="margin:0 auto;width: 60%" src="https://user-images.githubusercontent.com/661909/29498875-552e41b8-85b9-11e7-857a-6740824fc13c.png">
</div>

I've been enamored with [ML family](https://en.wikipedia.org/wiki/ML_(programming_language))
of programming languages for a while. However, and aside from the occasional Kata,
I had never really _shipped_ anything using an ML language.

Given the recent activity in the Ocaml community, however – mostly due to the
communication efforts behind [Facebook's Reason](https://github.com/facebook/reason) –
I felt compelled to give it another try (after a very short incursion during my undergrad),
and I was in for a treat!

# Getting Started & Reading Material

I went through Reason's [initial setup](https://reasonml.github.io/guide/javascript/quickstart)
right around the time [Jared Forsyth](https://twitter.com/jaredforsyth) published
a very detailed [tutorial](https://jaredforsyth.com/2017/07/05/a-reason-react-tutorial/)
about getting started with [ReasonReact](https://reasonml.github.io/reason-react/)
and compiling Reason for the browser using [BuckleScript](https://bucklescript.github.io/bucklescript).

Despite its young age, BuckleScript is an incredible piece of technology that
will (_instantly_, if I may add) compile Ocaml code (with built-in) support for
Reason, to JavaScript. The [BuckleScript manual](https://bucklescript.github.io/bucklescript/Manual.html),
though somewhat terse in the beginning, is an amazing reference to working with
the compiler and has become a pinned tab on my browser right after I started this
journey.

# Next steps & Troubleshooting

But after the initial setup I was on my own, and I had to start somewhere.
[`reason-scripts`](https://github.com/reasonml-community/reason-scripts),
a custom template for [`create-react-app`](https://github.com/facebookincubator/create-react-app/),
turned out to be a great way to bootstrap my project without the hassle of
writing boilerplate code, setting up tooling and spending hours figuring out
the tiniest of mistakes.

As any beginner going through the hurdles of unfamiliar paradigms, it wasn't
long until I hit some difficulties. What follows is an attempt to document the
pitfalls that trapped me at first, which I hope will be useful for others trying
to figure out rookie mistakes as they get started with Reason(React).

## The dreadful `type variable cannot be generalized`

In his tutorial, Jared describes making a
[stateful component](https://jaredforsyth.com/2017/07/05/a-reason-react-tutorial/#13-making-a-stateful-component),
but when I attempted to migrate my stateless component to a stateful one, I was
immediately greeted by the following, somewhat cryptic, error message:

```ocaml
Module build failed: Error: File "/path/to/src/app.re", line 5, characters 16-51:
Error: The type of this expression,
       ('_a, ReasonReact.stateless, ReasonReact.noRetainedProps,
        ReasonReact.noRetainedProps)
       ReasonReact.componentSpec,
       contains type variables that cannot be generalized
```

The solution was simply to use state somewhere in any function of my component. Even
just destructuring state from the _e.g._ the single argument to `render` solves
the problem.

Now the reason why this happens is quite interesting: if you look at the
[type of `ReasonReact.statefulComponent`](https://github.com/reasonml/reason-react/blob/8aa30ae63cc3bf7bef7bfc373c3a09a671dca267/src/reasonReact.re#L592),
there's one type variable `'state`. That's the variable that the error is referring to:
when `state` is not used _within_ the component definition, the compiler can't
infer what we want its type to be. If used explicitly, then we're literally telling
what that type variable should be.

An interesting note here is that `ReasonReact.statelessComponent` doesn't have
this problem. If we look at its [type definition](https://github.com/reasonml/reason-react/blob/8aa30ae63cc3bf7bef7bfc373c3a09a671dca267/src/reasonReact.re#L590),
it's almost immediately obvious why: there are no type variables in sight. The
compiler _always_ knows that it will take a `stateless` argument (which is
defined above in the file as being the `unit` type).

The team behind ReasonReact is well aware of this error and some other edge
cases in the library, and actively working to fix them in the near future. For
more information, there's a section about this pitfall in the
[Ocaml FAQ](http://caml.inria.fr/resources/doc/faq/core.en.html#weak-type-variables).

## Modules & Capitalization

Ocaml has a very interesting [module system](https://caml.inria.fr/pub/docs/manual-ocaml/moduleexamples.html).
In short, modules are used to group together related definitions, and can be
arbitrarily nested. Interestingly enough, files too become modules, and one of
my earliest mistakes was related to their capitalization when `open`ing a module
from a different file.

As part of ReKeys, I define a file called [`dom_utils.re`](https://github.com/anmonteiro/rekeys/blob/master/src/dom_utils.re)
for grouping certain definitions related to interaction with the DOM and events.
When trying to open this file for consumption in [another file](https://github.com/anmonteiro/rekeys/blob/9430b66f362989bbdfa6adc037485790b5ae1543/src/app.re#L1),
I couldn't get it to work.

The reason is that the module provided by a file is recognized by the compiler
with the first letter (and only the first letter) capitalized. So `domUtils.re`
becomes `DomUtils`, but `dom_utils.re` becomes `Dom_utils` and I was trying to
open `Dom_Utils`. This is one of those mistakes that I'll never make again, but
it was a head scratcher for a while there!

## Inline type signatures

Having tried other languages in the ML family such as Haskell, Elm or PureScript,
I struggled initially with how to annotate the types of my definitions. In
Haskell, for example, types can be annotated above a function's implementation,
like below:

```haskell
foo :: Int -> Int
foo x = x + 1
```

In Ocaml/Reason, however, annotating the `foo` function would either be done
inline, or in a `.rei` [interface file](https://reasonml.github.io/guide/language/module#signatures).
Example:

```rust
/* my_file.rei */
let foo: int => int;

/* inline, in a my_file.re file */
let foo: int => int = fun x => x + 1;
```

# Parting thoughts

Overall, my experience with Reason has been incredibly smooth. For a change, I
love how the compiler acts as someone constantly looking over my shoulder telling
me the amazing ways in which I can mess up what I'm doing.

The Reason community on [Discord](https://discord.gg/reasonml) is ultra helpful
and has been very patient with my constant newbie questions about anything Ocaml / Reason.

I'm excited to keep tinkering with Reason and eventually build something more serious.
In the meantime, I highly suggest you give it a try.

The code for ReKeys is free and open-source on [GitHub](https://github.com/anmonteiro/rekeys).
Please tweet [@anmonteiro90](https://twitter.com/anmonteiro90) with any questions/feedback
about the ReKeys code and/or this blog post!

Happy hacking!
