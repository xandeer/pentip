const selector = document.getElementById('selector');

selector.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addSelector();
  }
});

async function addSelector() {
  const { selectors: old } = await chrome.storage.sync.get('selectors');
  const selectors = old.length > 0 ? new Set(old) : new Set();

  selectors.add(selector.value);
  await chrome.storage.sync.set({ selectors: [...selectors] });

  layoutSelector(selector.value);
  selector.value = '';
}

document.getElementById('add').addEventListener('click', addSelector);

chrome.storage.sync.get('selectors', ({ selectors }) => {
  (selectors || []).forEach(layoutSelector);
});

function layoutSelector(sel) {
  const container = document.getElementById('container');
  const form = document.createElement('form');
  const input = document.createElement('input');
  input.type = 'text';
  input.value = sel;
  input.readOnly = true;
  const button = document.createElement('button');
  button.type = 'button';
  button.innerText = 'Remove';
  button.addEventListener('click', async () => {
    const { selectors: old } = await chrome.storage.sync.get('selectors');
    const selectors = old.length > 0 ? new Set(old) : new Set();

    selectors.delete(sel);
    await chrome.storage.sync.set({ selectors: [...selectors] });

    form.remove();
  });
  form.appendChild(input);
  form.appendChild(button);
  container.appendChild(form);
}

chrome.storage.sync.get('enabled', ({ enabled }) => {
  const checkbox = document.getElementById('enabled');
  checkbox.checked = enabled;
  checkbox.addEventListener('change', async () => {
    await chrome.storage.sync.set({ enabled: checkbox.checked });
  });
});
