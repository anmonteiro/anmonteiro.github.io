(defproject anmonteiro-blog "0.1.0-SNAPSHOT"
  :description "Blog code examples"
  :url ""
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.8.0-RC4"]
                 [org.clojure/clojurescript "1.7.228"]
                 [org.omcljs/om "1.0.0-alpha29-SNAPSHOT"]
                 [devcards "0.2.1-3"]]

  :plugins [[lein-cljsbuild "1.1.2"]
            [lein-figwheel "0.5.0-2"]]
  :clean-targets ^{:protect false} [[:cljsbuild :builds 0 :compiler :output-dir]
                                    [:cljsbuild :builds 0 :compiler :output-to]]
  :cljsbuild {:builds [{:id "recursion-examples-dev"
                        :source-paths ["assets/cljs/recursion-examples"]
                        :figwheel true;{:devcards true}
                        :compiler {:output-to "resources/public/devcards/js/devcards-examples.js"
                                   :output-dir "resources/public/devcards/js/out"
                                   :main "recursion-examples.core"
                                   :asset-path "/resources/public/devcards/js/out";"/devcards/js/out"
                                   :parallel-build true
                                   :optimizations :none
                                   :source-map true}}
                       {:id "recursion-examples-prod"
                        :source-paths ["assets/cljs/recursion-examples"]
                        :compiler {:output-to "resources/public/devcards/js/devcards-examples-prod.js"
                                   :parallel-build true
                                   :optimizations :advanced}}]})
