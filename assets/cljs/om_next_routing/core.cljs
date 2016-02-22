(ns om-next-routing.core
  (:require [devcards.core :as dc :include-macros true]
            [devcards.system :as dev]
            [om-next-routing.union :as ur]
            [om-next-routing.query :as qr]
            [om-next-routing.subquery :as subqr]
            [devcards.util.utils :as utils :refer [html-env?]])
  (:require-macros [devcards.core :refer [defcard dom-node]]))

(enable-console-print!)

(def host (.-host js/location))

(def path (.-pathname js/location))

(def dev-host? (partial = "localhost:3449"))

(def dev-blog-host? (partial = "localhost:4000"))

(def prod-host? (partial = "anmonteiro.com"))

; (print (dev-blog-host? host))
; (print "Yeahaw")

(when (dev-host? host)
  (dc/start-devcard-ui!))

(defn make-card [card-body]
  (if (satisfies? dc/IDevcardOptions card-body)
    card-body
    (reify dc/IDevcardOptions
      (-devcard-options [this opts]
        (assoc opts :main-obj card-body)))))

(defn devcard [name doc main-obj & [opts]]
  (let [card (cond-> {:name name
                      :documentation doc
                      :main-obj (make-card (main-obj))}
               (not (nil? opts)) (merge {:options opts}))]
    (dc/card-base card)))

(def cards
  {:example-page-card (devcard "Final Example" "" ur/example-page-card {:heading false})
   :app-state-card (devcard "App state" "" ur/app-state-card {:heading false})})

(defn render-cards []
  (loop [idx 1 cards (vals cards)]
    (when (seq cards)
      (js/ReactDOM.render (first cards)
        (js/document.getElementById (str "dp-card-" idx)))
      (recur (inc idx) (rest cards)))))

(when (dev-blog-host? host)
  (dev/add-css-if-necessary!)
  (render-cards))

(when (prod-host? host)
  (dev/add-css-if-necessary!)
  (render-cards))
