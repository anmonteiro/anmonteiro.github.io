module Link = {
  let makeProps =
      (
        ~href,
        ~as_=?,
        ~prefetch=?,
        ~replace=?,
        ~shallow=?,
        ~passHref=?,
        ~children,
        (),
      ) => {
    "href": href,
    "as": as_,
    "prefetch": prefetch,
    "replace": replace,
    "shallow": shallow,
    "passHref": passHref,
    "children": children,
  };

  /* https://nextjs.org/docs/api-reference/next/link#with-url-object *) (* */
  [@bs.module "next/link"]
  external make:
    {
      .
      "href": string,
      "as": option(string),
      "prefetch": option(bool),
      "replace": option(bool),
      "shallow": option(bool),
      "passHref": option(bool),
      "children": React.element,
    } =>
    React.element =
    "default";
};

module Error = {
  [@bs.module "next/error"] [@react.component]
  external make:
    (~title: string=?, ~statusCode: int, ~children: React.element) =>
    React.element =
    "default";
};

module Head = {
  [@bs.module "next/head"] [@react.component]
  external make: (~children: React.element) => React.element = "default";
};

module Router = {
  /*
      Make sure to only register events via a useEffect hook!
   */
  module Events = {
    type t;

    [@bs.send]
    external on:
      (
        t,
        [@bs.string] [
          | `routeChangeStart(string => unit)
          | `routeChangeComplete(string => unit)
          | `routeChangeError(({. "cancelled": bool}, string) => unit)
          | `hashChangeStart(string => unit)
          | `hashChangeComplete(string => unit)
          | `beforeHistoryChange(string => unit)
        ]
      ) =>
      unit =
      "on";

    [@bs.send]
    external off:
      (
        t,
        [@bs.string] [
          | `routeChangeStart(string => unit)
          | `routeChangeComplete(string => unit)
          | `routeChangeError(({. "cancelled": bool}, string) => unit)
          | `hashChangeStart(string => unit)
          | `hashChangeComplete(string => unit)
          | `beforeHistoryChange(string => unit)
        ]
      ) =>
      unit =
      "off";
  };

  type t = {
    pathname: string,
    query: Js.Dict.t(string),
    asPath: string,
    events: Events.t,
  };

  [@bs.module "next/router"] external singleton: t = "default";

  type options = {shallow: bool};

  [@bs.obj]
  external make:
    (~pathname: string=?, ~query: Js.Dict.t(string)=?, unit) => t;

  [@bs.send]
  external push: (t, string, ~as_: string=?, ~options: options=?) => unit =
    "push";
  let push = (t, ~as_=?, ~options=?, url) => {
    push(t, url, ~as_?, ~options?);
  };

  [@bs.send]
  external pushT: (t, t, ~as_: string=?, ~options: options=?) => unit = "push";
  let pushT = (t, ~as_=?, ~options=?, t') => {
    pushT(t, t', ~as_?, ~options?);
  };

  [@bs.send]
  external replace: (t, string, ~as_: string=?, ~options: options=?) => unit =
    "replace";
  let replace = (t, ~as_=?, ~options=?, url) => {
    replace(t, url, ~as_?, ~options?);
  };

  [@bs.send]
  external replaceT: (t, t, ~as_: string=?, ~options: options=?) => unit =
    "replace";
  let replaceT = (t, ~as_=?, ~options=?, t') => {
    replaceT(t, t', ~as_?, ~options?);
  };

  [@bs.send]
  external prefetch: (t, string, ~as_: string=?) => unit = "prefetch";
  let prefetch = (t, ~as_=?, url) => {
    prefetch(t, url, ~as_?);
  };

  [@bs.send]
  external prefetchT: (t, t, ~as_: string=?, ~options: options=?) => unit =
    "prefetch";
  let prefetchT = (t, ~as_=?, ~options=?, t') => {
    prefetchT(t, t', ~as_?, ~options?);
  };

  type popStateOptions = {
    url: string,
    [@bs.as "as"]
    as_: string,
    options,
  };

  [@bs.send]
  external beforePopState: (t, [@bs.uncurry] (popStateOptions => bool)) => unit =
    "beforePopState";

  [@bs.send] external back: t => unit = "back";

  [@bs.send] external reload: t => unit = "reload";
};

[@bs.module "next/router"] external useRouter: unit => Router.t = "useRouter";

module Config = {
  type t('a) = {publicRuntimeConfig: Js.t({..} as 'a)};

  [@bs.module "next/config"] external get: unit => t('a) = "default";
};

type dynamic = {ssr: bool};

[@bs.module "next/dynamic"]
external dynamic:
  ([@bs.uncurry] (unit => Js.Promise.t(React.component('props))), dynamic) =>
  React.component('props) =
  "default";

[@bs.val] external unsafeImport: string => Js.Promise.t('a) = "import";
