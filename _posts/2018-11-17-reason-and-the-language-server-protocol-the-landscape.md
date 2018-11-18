---
layout: post
title: "Reason and the Language Server Protocol: The Landscape"
tags: reason ocaml emacs editors
---

The state of editor tooling for programming languages has seen great change in
recent memory thanks to Microsoft's specification of a [Language Server
Protocol]( https://microsoft.github.io/language-server-protocol/overview) (LSP).

While some editors bundle LSP out of the box, making it a breeze to get up and
running, others take a little more tweaking. In a series of posts, I will detail
the state of LSP editor tooling in Reason / OCaml, as well as how to get set up
quickly in a variety of editors.

<!--more-->

<div style="margin:30px">
  <img style="max-width:30%;margin:0 auto" src="https://user-images.githubusercontent.com/661909/48664817-99be8d80-ea9c-11e8-84ad-f24eed85336f.png">
</div>

## Language Server Protocol Implementations

There are currently two alternative LSP server implementations for the OCaml
ecosystem. Despite what their names might suggest, all of them support both
OCaml and Reason. Their goals and tradeoffs are described below.

### 1. [`ocaml-language-server`](https://github.com/freebroccolo/ocaml-language-server)

[`ocaml-language-server`](https://github.com/freebroccolo/ocaml-language-server)
is the first implementation of an LSP server to have appeared for OCaml / Reason
and made a few compromises in the name of shipping quickly and iterating fast:

- It is implemented in TypeScript, and makes use of the upstream [LSP
  implementation
  library](https://github.com/Microsoft/vscode-languageserver-node) by Microsoft
  for Node.js
- It makes extensive use of existing tools for functionality such as code
  formatting, autocompletion and type information reporting.
    - These include, but are not limited to:
      -  [Merlin](https://github.com/ocaml/merlin)<sup id="fnref:1"><sub><a
         href="#fn:1">1</a></sub></sup> for code diagnostics, completion and
         type information reporting;
      - [`ocp-indent`](https://github.com/OCamlPro/ocp-indent) and
        [`refmt`](https://github.com/facebook/reason) for OCaml and Reason code
        formatting, respectively;
      - Calls to the underlying build systems and package managers, including
        [BuckleScript](https://github.com/bucklescript/bucklescript), the OCaml
        / Reason to JavaScript compiler.

### 2. [`reason-language-server`](https://github.com/jaredly/reason-language-server)

[`reason-language-server`](https://github.com/jaredly/reason-language-server) is
a new implementation of the Language Server Protocol that is implemented in
Reason and compiled to native code. It makes another set of trade-offs, which
are detailed below, and is the implementation that will be covered in this
series of posts.

- It reduces the reliance on external tools such as Merlin –
  `reason-language-server` implements its own type information reporting and
  source code diagnostics.
- Given it is written in Reason and compiled to native code,
  `reason-language-server` has implemented its own LSP protocol communication
  infrastructure because there wasn't one yet in the OCaml ecosystem.
- It also includes support for
  [`bsb-native`](https://github.com/bsansouci/bsb-native), a fork of
  BuckleScript that can build OCaml and Reason projects to OCaml bytecode and
  native assembly.

## Setting up Reason in [Visual Studio Code](https://code.visualstudio.com/)

The first editor that we are going to cover in this series is also the simplest
one to set up. The following instructions assume that you have a working [Visual
Studio Code](https://code.visualstudio.com/) installation.

1. Open VS Code and select the extensions panel.
2. Look for the `reason-vscode` package by [Jared
   Forsyth](https://twitter.com/jaredforsyth) as seen in the following image<sup
   id="fnref:2"><sub><a href="#fn:2">2</a></sub></sup>.

    <div style="margin:30px">
      <img style="max-width:50%;margin:0 auto" src="https://user-images.githubusercontent.com/661909/48666415-3e4ec880-eab9-11e8-84b9-1e0beb28f95e.png">
    </div>

3. Click "Install", wait until it finishes and click the "Reload" button to
   reload the workspace and apply your changes.

The above should be all you need! From now on, whenever you open a Reason or
OCaml file you'll see the Reason Language Server in action: beyond the syntax
highlighting provided by the extension, you'll see type hinting and error
information if that is the case. Please open an
[issue](https://github.com/jaredly/reason-language-server/issues/new/choose) in
Reason Language Server in case anything has gone wrong.

## Parting Thoughts and Next Posts

This post briefly covered the landscape of Language Server Protocol
implementations in OCaml and Reason, as well as the tradeoffs each one embraces
and the differences between them.

Next time we'll be covering how to set up the Reason LSP integration for Emacs.
Please tweet [@_anmonteiro](https://twitter.com/_anmonteiro) with any
questions or feedback about this post.

Happy hacking!

---

<div id="fn:1">
  <sup><sub>1</sub></sup> <sub>Merlin is an editor service that implements
  modern IDE features for OCaml and Reason. It solves the same problem as LSP,
  however there needs to be a specific implementation for every editor that
  intends to integrate with the Merlin protocol. LSP, however, only needs one
  implementation per editor in order to support every language that provides an
  LSP server.
  <a href="#fnref:1">
    <img draggable="false" class="emoji" alt="↩" src="/public/img/top.svg">
  </a></sub>
</div>

<div id="fn:2">
  <sup><sub>2</sub></sup> <sub>  Alternatively, you can install the second
  package shown in the picture, which will install `ocaml-language-server`. That
  won't, however, be covered in this post.
  <a href="#fnref:2">
    <img draggable="false" class="emoji" alt="↩" src="/public/img/top.svg">
  </a></sub>
</div>
