[@bs.config {flags: [|"-w", "-102"|]}];

module Layout = {
  [@bs.module "./layout.js"] [@react.component]
  external make: (~children: React.element) => React.element = "default";
};

module React = Std__react;

type renderInfo = {
  pendingTransition: bool,
  component: React.component({.}),
  props: {.},
  route: string,
};

/* let remoteConfig = SWR.Config.create(~suspense=true, ()); */

type props = {
  [@bs.as "Component"]
  component: React.component({.}),
  pageProps: {.},
  router: Next.Router.t,
};

let default = ({component, pageProps, _}) => {
  <RescriptReactErrorBoundary
    fallback={({error, info}) => {
      Js.log3("error", error, Js.Exn.message(error));
      <>
        <strong> "An error occurred"->React.string </strong>
        <pre> info.componentStack->React.string </pre>
      </>;
    }}>

      <React.Suspense fallback={React.string("LOADING")}>
        <Layout> {React.createElement(component, pageProps)} </Layout>
      </React.Suspense>
    </RescriptReactErrorBoundary>;
    /* </SWR.Config> */
    /* <SWR.Config value=remoteConfig> */
};

let init = () => {
  Random.init(Belt.Int.fromFloat(Js.Date.now()));
};

let () = init();
