(ns pentip.popup
  (:require
   [reagent.dom :as rdom]
   [re-frame.core :as rf]))

(rf/reg-sub
 :name
 (fn [db]
   (:name db)))

(defn view []
  (let [name (rf/subscribe [:name])]
    [:div
     [:h2 "Hello, " @name "!" ]]))

(def db {:name "pentip's popup"})

(rf/reg-event-db
 :initialize-db
 (fn [_ _]
   db))

(defn ^:dev/after-load mount-root []
  (rf/clear-subscription-cache!)
  (let [root-el (.getElementById js/document "app")]
    (rdom/unmount-component-at-node root-el)
    (rdom/render [view] root-el)))

(defn init []
  (rf/dispatch-sync [:initialize-db])
  (mount-root))
