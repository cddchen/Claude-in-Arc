/**
 * Custom API Settings panel for the Options page.
 * Reads/writes chrome.storage.local["customApiConfig"].
 * sidepanel bundle reads the same key via window._customApiConfig
 * (with chrome.storage.onChanged live sync), so changes here take effect
 * without reloading the extension.
 */
(function () {
  'use strict';

  const DEFAULTS = {
    apiBaseUrl: 'http://localhost:8317',
    apiKey: 'sk-FPEVLUxNSxrEcZLU0bl1cXn0OBL5FjUBtxdDfMNZevMUK5GHfGlM',
    model: 'claude-sonnet-4-6',
    smallFastModel: 'deepseek-v4-flash',
  };

  const FIELDS = [
    { key: 'apiBaseUrl', label: 'API URL', type: 'text', placeholder: 'http://localhost:8317' },
    { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'sk-...' },
    { key: 'model', label: 'Model', type: 'text', placeholder: 'claude-sonnet-4-6' },
    { key: 'smallFastModel', label: 'Small Fast Model', type: 'text', placeholder: 'deepseek-v4-flash' },
  ];

  function buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'custom-api-panel';
    panel.style.cssText = [
      'max-width: 640px',
      'margin: 24px auto',
      'padding: 20px 24px',
      'border: 1px solid rgba(0,0,0,0.12)',
      'border-radius: 12px',
      'background: #f9f9f8',
      'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      'color: #1f1f1f',
    ].join(';');

    const title = document.createElement('h2');
    title.textContent = 'Custom API Settings';
    title.style.cssText = 'margin:0 0 4px;font-size:18px;font-weight:600';
    panel.appendChild(title);

    const hint = document.createElement('p');
    hint.textContent = 'Overrides the API endpoint, key and models used by the side panel. Saved values apply live.';
    hint.style.cssText = 'margin:0 0 16px;font-size:13px;color:#666';
    panel.appendChild(hint);

    const inputs = {};
    for (const f of FIELDS) {
      const row = document.createElement('div');
      row.style.cssText = 'margin-bottom:12px';

      const label = document.createElement('label');
      label.textContent = f.label;
      label.style.cssText = 'display:block;font-size:13px;font-weight:500;margin-bottom:4px';
      row.appendChild(label);

      const input = document.createElement('input');
      input.type = f.type;
      input.placeholder = f.placeholder;
      input.style.cssText = 'width:100%;padding:8px 10px;font-size:14px;border:1px solid #ccc;border-radius:8px;box-sizing:border-box;background:#fff;color:#1f1f1f';
      inputs[f.key] = input;
      row.appendChild(input);

      panel.appendChild(row);
    }

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;align-items:center;margin-top:8px';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.style.cssText = 'padding:8px 18px;font-size:14px;font-weight:600;border:none;border-radius:8px;background:#c15f3c;color:#fff;cursor:pointer';
    btnRow.appendChild(saveBtn);

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset to defaults';
    resetBtn.style.cssText = 'padding:8px 14px;font-size:13px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#333;cursor:pointer';
    btnRow.appendChild(resetBtn);

    const status = document.createElement('span');
    status.style.cssText = 'font-size:13px;color:#2a8f2a;margin-left:8px';
    btnRow.appendChild(status);

    panel.appendChild(btnRow);

    function fill(cfg) {
      const merged = { ...DEFAULTS, ...(cfg || {}) };
      for (const f of FIELDS) inputs[f.key].value = merged[f.key] ?? '';
    }

    function save() {
      const cfg = {};
      for (const f of FIELDS) cfg[f.key] = inputs[f.key].value.trim();
      chrome.storage.local.set({ customApiConfig: cfg }, () => {
        status.textContent = 'Saved ✓';
        setTimeout(() => (status.textContent = ''), 2000);
      });
    }

    function reset() {
      chrome.storage.local.set({ customApiConfig: { ...DEFAULTS } }, () => {
        fill(DEFAULTS);
        status.textContent = 'Reset ✓';
        setTimeout(() => (status.textContent = ''), 2000);
      });
    }

    saveBtn.addEventListener('click', save);
    resetBtn.addEventListener('click', reset);

    // load current values
    chrome.storage.local.get({ customApiConfig: null }, (r) => fill(r.customApiConfig));

    return panel;
  }

  function mount() {
    if (document.getElementById('custom-api-panel')) return;
    document.body.appendChild(buildPanel());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
