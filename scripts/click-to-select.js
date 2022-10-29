function bindClickToSelect(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.addEventListener('click', handler, { capture: true });
  });
}

function unbindClickToSelect(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.removeEventListener('click', handler);
  });
}

let disabled = false;

function handler(e) {
  if (disabled) {
    return;
  }
  window.getSelection().selectAllChildren(e.currentTarget);
  e.stopPropagation();
}

chrome.storage.onChanged.addListener(({ selectors }) => {
  if (selectors) {
    selectors.oldValue.forEach(unbindClickToSelect);
    selectors.newValue.forEach(bindClickToSelect);
  }
});

chrome.storage.onChanged.addListener(({ enabled }) => {
  disabled = !enabled || !enabled.newValue;
});

chrome.storage.sync.get('selectors', ({ selectors }) => {
  if (selectors) {
    selectors.forEach(bindClickToSelect);
  } else {
    chrome.storage.sync.set({ selectors: ['p'] });
  }
});

chrome.storage.sync.get('enabled', ({ enabled }) => {
  if (enabled === undefined) {
    chrome.storage.sync.set({ enabled: true });
  } else {
    disabled = !enabled;
  }
});
