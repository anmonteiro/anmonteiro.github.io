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

(defn- dom-node* [node-fn]
  (fn [data-atom owner]
     (js/React.createElement dc/DomComponent
                             #js {:node_fn   node-fn
                                  :data_atom data-atom})))


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
(comment
(declare component)

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

(defn composite-component-card []
  (dom-node*
    (fn [_ node]
      (om/add-root! composite-reconciler CompositeApp node))))

(defcard CompositeCard
  "Composite"
  (composite-component-card))
)

;; =============================================================================
;; Decorator

(def undecorated-data
  {:decorator/app {:id 0
                   :width 300
                   :height 300
                   :color "#DBD639"}})

(def decorated-data
  {:decorator/app {:id 1
                   :decorator/text "I am a text message"
                   :next {:id 2
                          :decorator/image "/public/img/cljs.svg"
                          :image/max-width 200
                          :next (:decorator/app undecorated-data)}}})

(declare component)

(defui ImageDecorator
  static om/IQuery
  (query [this]
    '[:id :decorator/image :image/max-width {:next ...}])
  Object
  (render [this]
    (let [{:keys [id decorator/image image/max-width next] :as props} (om/props this)]
      (component next
        (om/children this)
        (dom/img #js {:src image
                      :style #js {:maxWidth max-width
                                  :display "block"
                                  :margin "15px auto"}})))))

(def image-decorator (om/factory ImageDecorator))

(defui TextDecorator
  static om/IQuery
  (query [this]
    '[:id :decorator/text {:next ...}])
  Object
  (render [this]
    (let [{:keys [id decorator/text next] :as props} (om/props this)]
      (component next
        (om/children this)
        (dom/p #js {:style #js {:margin "15px 0"
                                :textAlign "center"}} text)))))

(def text-decorator (om/factory TextDecorator))

(defui ConcreteComponent
  static om/IQuery
  (query [this]
    '[:id :width :height :color])
  Object
  (render [this]
    (common-div (om/props this)
      (om/children this))))

(def concrete-component (om/factory ConcreteComponent))

(defui Component
  static om/Ident
  (ident [this {:keys [id decorator/text decorator/image]}]
    (cond
      (not (nil? text)) [:text id]
      (not (nil? image)) [:image id]
      :else [:component id]))
  static om/IQuery
  (query [this]
    {:text (om/get-query TextDecorator)
     :image (om/get-query ImageDecorator)
     :component (om/get-query ConcreteComponent)})
  Object
  (render [this]
    (let [{:keys [id] :as props} (om/props this)
          [type id] (om/get-ident this)]
      (({:text text-decorator
         :image image-decorator
         :component concrete-component} type) props
         (om/children this)))))

(def component (om/factory Component))

(defui DecoratorApp
  static om/IQuery
  (query [this]
    [{:decorator/app (om/get-query Component)}])
  Object
  (render [this]
    (let [{:keys [decorator/app]} (om/props this)]
      (dom/div #js {:style #js {:margin "0 auto"
                                :display "table"}}
        (component app)
        (dom/div #js {:style #js {:clear "both"}})))))

(defmulti decorator-read om/dispatch)

(defmethod decorator-read :default
  [{:keys [data] :as env} k _]
  {:value (get data k)})

(defmethod decorator-read :next
  [{:keys [parser data union-query state] :as env} k _]
  (let [st @state
        f #(parser (assoc env :data (get-in st %)) ((first %) union-query))]
    {:value (f (:next data))}))

(defmethod decorator-read :decorator/app
  [{:keys [state parser query ast] :as env} k _]
  (let [st @state
        [type id :as entry] (get st k)
        data (get-in st entry)
        new-env (assoc env :data data :union-query query)]
    {:value (parser new-env (type query))}))

(def undecorated-reconciler
  (om/reconciler {:state undecorated-data
                  :parser (om/parser {:read decorator-read})}))

(def decorator-reconciler
  (om/reconciler {:state decorated-data
                  :parser (om/parser {:read decorator-read})}))

(defn undecorated-data-card []
  (:decorator/app undecorated-data))

(defcard UndecoratedData
  "Undecorated data"
  (undecorated-data-card))

(defn decorated-data-card []
  decorated-data)

(defcard DecoratedData
  "Undecorated data"
  (decorated-data-card))

(defn undecorated-component-card []
  (dom-node*
    (fn [_ node]
      (om/add-root! undecorated-reconciler DecoratorApp node))))

(defcard UndecoratedComponentCard
  "Undecorated component"
  (undecorated-component-card))

(defn decorated-component-card []
  (dom-node*
    (fn [_ node]
      (om/add-root! decorator-reconciler DecoratorApp node))))

(defcard DecoratedComponentCard
  "Decorated Component"
  (decorated-component-card))
