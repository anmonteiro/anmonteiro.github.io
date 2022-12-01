include (
          React:
             (module type of {
              include React;
            }) with
              module Uncurried := React.Uncurried
        );

module Uncurried = {
  include React.Uncurried;

  let reactUseState = useState;

  let useState: (unit => 'state) => ('state, (. ('state => 'state)) => unit) =
    initState => {
      let (state, setState) = React.Uncurried.useState(initState);
      (
        state,
        (. f) => {
          let f' = oldState => {
            let newState = f(oldState);
            newState != oldState ? newState : oldState;
          };
          setState(. f');
        },
      );
    };
};

module U = Uncurried;

/* Use this for the original version. Useful if your state contains e.g.
 * functions, which can't be compared functionally in OCaml. */
let reactUseState = useState;

let useState: (unit => 'state) => ('state, ('state => 'state) => unit) =
  initState => {
    let (state, setState) = React.useState(initState);
    (
      state,
      f => {
        let f' = oldState => {
          let newState = f(oldState);
          newState != oldState ? newState : oldState;
        };
        setState(f');
      },
    );
  };

module Utils = {
  let a = array;
  let i = int;
  let f = float;
  let s = string;
};

[@bs.module "react"]
external useTransition:
  (~config: React.transitionConfig=?, unit) =>
  (React.callback(React.callback(unit, unit), unit), bool) =
  "unstable_useTransition";

module Resource = {
  type status =
    | Pending
    | Resolved
    | Error;

  type t('a) = {
    mutable status,
    mutable value: option(result('a, string)),
    suspender: Promise.t(unit),
  };

  let create = promise => {
    let rec t =
      lazy({
        status: Pending,
        value: None,
        suspender:
          Promise.map(
            promise,
            v => {
              let t = Lazy.force(t);
              switch (v) {
              | Ok(v) =>
                t.status = Resolved;
                t.value = Some(Ok(v));
              | Error(e) =>
                t.status = Error;
                t.value = Some(Error(e));
              };
            },
          ),
      });

    Lazy.force(t);
  };

  let read = t =>
    switch (t.status) {
    | Resolved
    | Error => Option.get(t.value)
    | Pending =>
      let suspender = t.suspender;
      [@ocaml.warning "-20"]
      [%bs.raw "function(suspender) {throw suspender}"](suspender);
    };

  let write = (t, value) => {
    t.status = Resolved;
    t.value = Some(value);
  };
};

module Hooks = {
  let useInitialRender = () => {
    let isFirstRender = React.useRef(true);

    React.useEffect0(() => {
      isFirstRender.current = false;
      None;
    });

    isFirstRender.current;
  };

  let usePrevious = value => {
    let ref = React.useRef(value);

    React.useEffect(() => {
      ref.current = value;
      None;
    });

    ref.current;
  };

  /* Doesn't fire when mounting. */
  let useDidUpdate0 = cb => {
    let didMountRef = useRef(false);

    useEffect0(() =>
      if (didMountRef.current) {
        cb();
      } else {
        didMountRef.current = true;
        None;
      }
    );
  };

  let useDidUpdate1 = (cb, deps) => {
    let didMountRef = useRef(false);

    useEffect1(
      () =>
        if (didMountRef.current) {
          cb();
        } else {
          didMountRef.current = true;
          None;
        },
      deps,
    );
  };

  let useDidUpdate2 = (cb, deps) => {
    let didMountRef = useRef(false);

    useEffect2(
      () =>
        if (didMountRef.current) {
          cb();
        } else {
          didMountRef.current = true;
          None;
        },
      deps,
    );
  };
};

module Scheduler = {
  type priority;

  [@bs.module "scheduler"]
  external userBlockingPriority: priority = "unstable_UserBlockingPriority";

  [@bs.module "scheduler"]
  external runWithPriority: (priority, [@bs.uncurry] (unit => unit)) => unit =
    "unstable_runWithPriority";
};
