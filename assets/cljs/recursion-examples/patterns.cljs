(ns recursion-examples.patterns
  (:require-macros [devcards.core :refer [defcard deftest dom-node]])
  (:require [devcards.core :as dc]
            [om.next :as om :refer-macros [defui]]
            [om.dom :as dom]))

;; =============================================================================
;; Composite

(def composite-data
  {:composite/item {:id 0
                   :width 400
                   :height 400
                   :color "#428BCA"
                   :children [{:id 1
                               :width 200
                               :height 200
                               :color "#9ACD32"
                               :children [{:id 3
                                           :width 100
                                           :height 100
                                           :color "#CD329A"}
                                          {:id 4
                                           :width 100
                                           :height 100
                                           :color "#32CD65"}]}
                              {:id 2
                               :width 200
                               :height 200
                               :color "#39DBBE"}]}})

(defn composite-data-card []
  composite-data)

(defcard CompositeData
  (composite-data-card))

(declare component)

(defn display-id [id]
  (dom/div #js {:style #js {:position "absolute"
                            :textAlign "right"
                            :bottom 0
                            :zIndex 1
                            :right 5}}
    (dom/span nil
      (str id))))

(defn common-div [props & children]
  (let [{:keys [id width height color]} props]
    (dom/div #js {:className (str id)
                  :style
                    #js {:position "relative"
                         :float "left"
                         :width width
                         :height height
                         :zIndex 2
                         :textAlign "center"
                         :backgroundColor color}}
      children
      (display-id id))))

(defui Composite
  static om/IQuery
  (query [this]
    '[:id :width :height :color {:children ...}])
  Object
  (render [this]
    (let [{:keys [children] :as props} (om/props this)]
      (common-div props (map component children)))))

(def composite (om/factory Composite))

(defui Leaf
  static om/IQuery
  (query [this]
    '[:id :width :height :color])
  Object
  (render [this]
    (common-div (om/props this))))

(def leaf (om/factory Leaf))

(defui Component
  static om/Ident
  (ident [this {:keys [id children]}]
    (if-not (nil? children)
      [:composite id]
      [:leaf id]))
  static om/IQuery
  (query [this]
    {:leaf (om/get-query Leaf)
     :composite (om/get-query Composite)})
  Object
  (render [this]
    (let [{:keys [id] :as props} (om/props this)
          [type id] (om/get-ident this)]
      (({:composite composite
         :leaf leaf} type) props))))

(def component (om/factory Component))

(defui CompositeApp
  static om/IQuery
  (query [this]
    [{:composite/item (om/get-query Component)}])
  Object
  (render [this]
    (let [{:keys [composite/item]} (om/props this)]
      (dom/div #js {:style #js {:margin "0 auto"
                                :display "table"}}
        (component item)
        (dom/div #js {:style #js {:clear "both"}})))))

(defmulti composite-read om/dispatch)

(defmethod composite-read :default
  [{:keys [data] :as env} k _]
  {:value (get data k)})

(defmethod composite-read :children
  [{:keys [parser data union-query state] :as env} k _]
  (let [st @state
        f #(parser (assoc env :data (get-in st %)) ((first %) union-query))]
    {:value (into [] (map f) (:children data))}))

(defmethod composite-read :composite/item
  [{:keys [state parser query ast] :as env} k _]
  (let [st @state
        [type id :as entry] (get st k)
        data (get-in st entry)
        new-env (assoc env :data data :union-query query)]
    {:value (parser new-env (type query))}))

(def composite-reconciler
  (om/reconciler {:state composite-data
                  :parser (om/parser {:read composite-read})}))

(defn- dom-node* [node-fn]
  (fn [data-atom owner]
     (js/React.createElement dc/DomComponent
                             #js {:node_fn   node-fn
                                  :data_atom data-atom})))

(defn composite-component-card []
  (dom-node*
    (fn [_ node]
      (om/add-root! composite-reconciler CompositeApp node))))

(defcard CompositeCard
  "Composite"
  (composite-component-card))


