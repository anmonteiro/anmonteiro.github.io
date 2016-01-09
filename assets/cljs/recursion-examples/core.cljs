(ns recursion-examples.core
  (:require [devcards.core :as dc :include-macros true]
            [devcards.system :as dev]
            [recursion-examples.patterns :as pat]
            [devcards.util.utils :as utils :refer [html-env?]])
  (:require-macros [devcards.core :refer [defcard deftest dom-node]]))

(enable-console-print!)

(def host (.-host js/location))

(def path (.-pathname js/location))

(def dev-host? (partial = "localhost:3449"))

(def dev-blog-host? (partial = "localhost:4000"))

(def prod-host? (partial = "anmonteiro.com"))

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

(def cards-pt1
  {:composite-data-card (devcard "CompositeData" "" pat/composite-data-card {:heading false})
   ;:composite-component-card (devcard "Composite" "" pat/composite-component-card {:heading false})
   })

(def cards-pt2
  {:undecorated-data-card (devcard "Undecorated Data" "" pat/undecorated-data-card {:heading false})
   :decorated-data-card (devcard "Decorated Data" "" pat/decorated-data-card {:heading false})
   :undecorated-component-card (devcard "Undecorated Component" "" pat/undecorated-component-card {:heading false})
   :decorated-component-card (devcard "Decorated Component" "" pat/decorated-component-card {:heading false})})

(defn render-cards []
  (loop [idx 1 cards (vals cards-pt2)]
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
