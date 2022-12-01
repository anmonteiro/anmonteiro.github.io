{ pkgs }:

let
  inherit (pkgs) lib callPackage;
in
with pkgs;

mkShell {
  OCAMLRUNPARAM = "b";
  buildInputs = with ocamlPackages; [
    # mel
    # melange
    merlin
    dot-merlin-reader
    reason
    ocamlformat
    dune
    findlib
    ocaml
    utop
    nodejs
    yarn
    nodePackages.prettier
  ];

  # MELANGE_PATH = "${ocamlPackages.melange}/lib/melange/runtime";
  MELANGE_PATH = "/Users/anmonteiro/projects/melange";

  shellHook = ''
    PATH=$MELANGE_PATH/bin:$PATH
  '';

  NEXT_TELEMETRY_DISABLED = "1";
  NIX_NODE_MODULES_POSTINSTALL = ''
    ln -sfn $MELANGE_PATH node_modules/melange;
  '';
}
