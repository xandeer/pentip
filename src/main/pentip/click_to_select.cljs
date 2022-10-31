(ns pentip.click-to-select)

(def ^:private disabled false)

(defn ^:private handler [e]
  (when-not disabled
    (-> (.getSelection js/window)
        (.selectAllChildren (.-currentTarget e)))
    (.stopPropagation e)))

(defn ^:private bind-click-to-select [selector]
  (.forEach (.querySelectorAll js/document selector)
           #(.addEventListener % "click" handler true)))

(defn ^:private unbind-click-to-select [selector]
  (.forEach (.querySelectorAll js/document selector)
            #(.removeEventListener % "click" handler )))

(js/chrome.storage.onChanged.addListener
 (fn [^js data]
   (when-let [enabled (.-enabled data)]
     (set! disabled (not (.-newValue enabled))))

   (when-let [selectors (.-selectors data)]
     (.forEach (.-oldValue selectors) unbind-click-to-select)
     (.forEach (.-newValue selectors) bind-click-to-select))))

(js/chrome.storage.sync.get
 "selectors"
 (fn [^js data]
   (if-let [selectors (.-selectors data)]
     (.forEach selectors bind-click-to-select)
     (js/chrome.storage.sync.set #js {:selectors ["p"]}))))

(js/chrome.storage.sync.get
 "enabled"
 (fn [^js data]
   (let [enabled (.-enabled data)]
     (if (undefined? enabled)
       (js/chrome.storage.sync.set #js {:enabled true})
       (set! disabled (not enabled))))))
