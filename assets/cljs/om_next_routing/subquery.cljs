(ns om-next-routing.subquery
  (:require [goog.dom :as gdom]
            [om.next :as om :refer-macros [defui]]
            [om.dom :as dom]))


(enable-console-print!)

(defmulti read om/dispatch)
(defmulti mutate om/dispatch)

(defmethod read :route/data
   [{:keys [state query]} k _]
   (let [st @state
         route (get st :app/route)
         route (cond-> route
                 (= (second route) '_) pop)]
     {:value (get-in st route)}))

(defmethod read :app/route
   [{:keys [state query]} k _]
   (let [st @state]
     {:value (get st k)}))

(defmethod mutate 'change/route!
  [{:keys [state]} _ {:keys [route]}]
  {:value {:keys [:app/route]}
   :action #(swap! state assoc :app/route route)})

(defui Home
  static om/IQuery
  (query [this]
    [:home/title :home/content])
  Object
  (render [this]
    (let [{:keys [home/title home/content]} (om/props this)]
      (dom/div nil
        (dom/h3 nil title)
        (dom/p nil (str content))))))

(defui About
  static om/IQuery
  (query [this]
    [:about/title :about/content])
  Object
  (render [this]
    (let [{:keys [about/title about/content]} (om/props this)]
      (dom/div nil
        (dom/h3 nil title)
        (dom/p nil (str content))))))

(def route->component
  {:app/home Home
   :app/about About})

(def route->factory
  (zipmap (keys route->component)
    (map om/factory (vals route->component))))

(def route->query
  (zipmap (keys route->component)
    (map om/get-query (vals route->component))))

(defn- change-route [c route e]
  (.preventDefault e)
  (om/transact! c `[(~'change/route! {:route ~route})]))

(defui Root
  static om/IQuery
  (query [this]
    (let [subq-ref (if (om/component? this)
                     (-> (om/props this) :app/route first)
                     :app/home)
          subq-class (get route->component subq-ref)]
      [:app/route {:route/data (om/subquery this subq-ref subq-class)}]))
  Object
  (render [this]
    (let [{:keys [app/route route/data]} (om/props this)]
      (dom/div #js {:style #js {:margin "0 auto"
                                :height 250
                                :width 500
                                :backgroundColor "oldlace"}}
        (dom/div #js {:style #js {:minWidth "100%"
                                  :minHeight "48px"
                                  :lineHeight "48px"
                                  :verticalAlign "middle"
                                  :textAlign "center"}}
          (dom/h2 #js {:style #js {:margin 0
                                   :borderBottomWidth "2px"
                                   :borderBottomStyle "solid"}}
            "Om Next Routing"))
        (dom/div #js {:style #js {:display "inline-block"
                                  :width "25%"
                                  :minHeight "80%"
                                  :verticalAlign "top"
                                  :backgroundColor "gainsboro"}}
          (dom/ul nil
            (dom/li nil
              (dom/a #js {:href "#"
                          :style (when (= (first route) :app/home)
                                   #js {:color "black"
                                        :cursor "text"})
                          :onClick #(change-route this '[:app/home _] %)}
                "Home"))
            (dom/li nil
              (dom/a #js {:href "#"
                          :style (when (= (first route) :app/about)
                                   #js {:color "black"
                                        :cursor "text"})
                          :onClick #(change-route this '[:app/about _] %)}
                "About")))
          (dom/p #js {:style #js {:textAlign "center"
                                  :textDecoration "underline"
                                  :marginBottom "5px"
                                  :marginTop "30px"
                                  :fontWeight "bold"}}
            "Current route:")
          (dom/p #js {:style #js {:textAlign "center"
                                  :margin 0
                                  :color "red"}}
            (str (pr-str route))))
        (dom/div #js {:style #js {:display "inline-block"
                                  :width "70%"
                                  :minHeight "70%"
                                  :verticalAlign "top"
                                  :padding "12.5px 12.5px 12.5px 10.5px"
                                  :borderLeftWidth "2px"
                                  :borderLeftStyle "solid"}}
          ((route->factory (first route)) (assoc data :ref (first route))))))))

(defonce app-state
  {:app/route '[:app/home _]
   :app/home {:home/title "Home page"
              :home/content "This is the homepage. There's not a lot to see here."}
   :app/about {:about/title "About page"
               :about/content "This is the about page, the place where one might write things about their own self."}})

(def reconciler (om/reconciler {:state (atom app-state)
                                :parser (om/parser {:read read :mutate mutate})}))

;(om/add-root! reconciler Root (gdom/getElement "app"))

