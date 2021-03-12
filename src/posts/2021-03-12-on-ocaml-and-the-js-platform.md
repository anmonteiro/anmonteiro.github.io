---
layout: post
title: "On OCaml and the JS platform"
tags: reason ocaml rescript
---

[ReScript](https://rescript-lang.org/), née
[BuckleScript](https://bucklescript.netlify.app/), is a state-of-the-art
compiler that used to target OCaml (and Reason), but is fast moving away from
its parent language. OCaml compatibility is high on my list of desirable
features, and I've been disillusioned with the direction the project has veered
into. So I took matters into my own hands. Read on!

<!--more-->

## What ReScript looks like today

The BuckleScript project started out as an OCaml to JavaScript compiler. Last
year, after a surprising announcement and discussions that I'll choose not to
rehash in this space, ReScript [has made it
clear](https://rescript-lang.org/blog/bucklescript-is-rebranding) that they'll
be pursuing a new direction for the project, which includes:

- Not supporting newer versions of Reason
- Dropping support for OCaml features that are not deemed necessary for the
  success of ReScript
  - An example is the [recent
    move](https://github.com/rescript-lang/rescript-compiler/pull/4967) to
    really break away from OCaml by removing support for the OCaml object
    system (it's even
    [removed](https://github.com/rescript-lang/ocaml/commit/803c6e676d2be50b10e39a49e763cb8f1396c0e7)
    from the OCaml compiler in ReScript "mode" )
- [Dropping support for custom
  PPXes](https://github.com/rescript-lang/rescript-compiler/pull/4701) such as
  `ppx_deriving` (the `deriving` attribute is now exclusively interpreted as
  `bs.deriving`)
- Focusing almost excusively on the "ReScript syntax", which lacks many common
  features present in OCaml (e.g. custom infix operators, weird syntax for
  lists, and others)
- not staying up-to-date with the OCaml release cycle
  ([source](https://github.com/rescript-lang/rescript-compiler/wiki))

## So, what have I been up to?

I mentioned above that the direction of ReScript doesn't align with my personal
use cases. Specifically, I'm interested in as much compatibility as possible
with the OCaml ecosystem (after all, BuckleScript stands on the shoulders of
giants), and the possibility of sharing code with native OCaml projects — this
is extremely useful for sharing types and common business logic, and I use it
in all my projects.

### BuckleScript on OCaml 4.12

I've been maintaining my own fork of BuckleScript since the summer 2020. A few
days ago, I started exploring bumping the OCaml version. And you know what?
Turns out updating the compiler version isn't hard at all (it only took 3
days!).

The end result is a state of the art compiler for the JavaScript platform
(preserving all features of BuckleScript), that diverges from upstream in the
following ways:

- uses Dune as the build tool instead of (a very custom, patched, outdated version of)
  [ninja](https://ninja-build.org/)
  - Dune is used to build both the compiler and to build JS projects
- most tooling in the OCaml ecosystem just works (PPXes too!)
  - this is especially important as [`ocaml-lsp`](https://github.com/ocaml/ocaml-lsp)
    is dropping support for OCaml 4.06 soon.
- Reason is bundled as a library inside the compiler, instead of shelling out
  to `refmt`, which always made reason slower than it had to be in BuckleScript
  <sup id="fnref:1"><sub><a href="#fn:1">1</a></sub></sup>.
- we get all the cool enhancements made to OCaml in recent history _for free_,
  including `letop` bindings and many new and improved standard library
  modules.
- supports monorepos trivially, without the need for features like "pinned
  dependencies" <sup id="fnref:2"><sub><a href="#fn:1">2</a></sub></sup>

## Looking onwards

What does the future look like? I'm not sure. I built something that is useful to me,
and I'm planning on maintaining it for my own use cases. If more folks are interested,
there are some really interesting things that this could unlock:

- deeper dune integration (perhaps in Dune itself, if this project ends up
  being adopted)
- move away from an ad-hoc `bsconfig.json` way of specifying configuration,
  towards something more established in the OCaml community
- support for consuming OPAM packages directly (this is possible with some
  heavy lifting in userspace today)
- eventually release and distribute to OPAM as well

## Feedback

If any of this sounds useful to you, I'd love for you to reach out to me. I
think there's a opportunity here to make something really great that has the
best of both worlds: our favorite OCaml on the world's most popular platform.

The project lives
[here](https://github.com/anmonteiro/bucklescript/tree/fork-4.12.0+BS). At the
time of this writing, you need [`nix`](https://nixos.org/) to get the correct
packages in order to build the project. This limitation can be lifted as soon
as folks are interested in trying out the project.

Please send me a message on Twitter
[@_anmonteiro](https://twitter.com/_anmonteiro), or otherwise catch me on the
OCaml / Reason Discord servers.

Thanks for reading and happy hacking!

---

<div id="fn:1">
  <sup><sub>1</sub></sup> <sub>I'm going to avoid talking specifically about
  the Reason project in this post. However, rest assured that it'll keep being
  maintained going forward, as I'm one of the maintainers.
  <a href="#fnref:1">
    <img draggable="false" class="emoji" alt="↩" src="/img/top.svg">
  </a></sub>
</div>

<div id="fn:2">
  <sup><sub>2</sub></sup> <sub>which, in my opinion, was never needed in the
  first place, and could trivially have been implemented by checking mtime of
  the dependent files (which is also how I implemented monorepos last summer in
  BuckleScript)
  <a href="#fnref:2">
    <img draggable="false" class="emoji" alt="↩" src="/img/top.svg">
  </a></sub>
</div>
