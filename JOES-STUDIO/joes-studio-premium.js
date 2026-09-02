/* Joes Studio Pro activation — v3 unified Pro button mode. */
(function(){
  'use strict';

  const STORE = 'joes-studio-premium-v2';
  const UNIVERSAL_KEY_SHA256 = 'bc8c50933ed9245437f3f72babd57343a61d25c13b4f42c16a9d13c23f2f005b';
  const KEY_PATTERN = /^[A-Za-z0-9]+$/;

  const wait = (ok, fn, n = 80) => ok() ? fn() : n > 0 && setTimeout(() => wait(ok, fn, n - 1), 300);
  const active = () => localStorage.getItem(STORE) === 'activated';

  async function sha256(value) {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  }

  function normalize(raw) {
    return String(raw || '').trim();
  }

  async function activate(raw) {
    if (!window.crypto?.subtle) throw new Error('Secure activation is not supported by this browser.');
    const key = normalize(raw);
    if (!key) throw new Error('Enter your Pro activation key.');
    if (!KEY_PATTERN.test(key)) throw new Error('The activation key must contain letters and numbers only.');
    if (key.length < 24 || key.length > 64) throw new Error('Invalid Pro activation key.');

    const hash = await sha256(key);
    if (hash !== UNIVERSAL_KEY_SHA256) throw new Error('Invalid Pro activation key.');

    localStorage.setItem(STORE, 'activated');
    return true;
  }

  function dialog() {
    let m = document.getElementById('jspPremiumActivation');
    if (m) { m.classList.remove('hidden'); return; }

    m = document.createElement('div');
    m.id = 'jspPremiumActivation';
    m.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4';
    m.innerHTML = '<div class="absolute inset-0 bg-black/60"></div>' +
      '<div class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-5">' +
      '<h2 class="text-lg font-bold">Joes Studio Pro</h2>' +
      '<p class="text-sm text-gray-600 mt-1">Enter your Pro activation key to unlock Pro tools.</p>' +
      '<input id="jspPremiumKey" maxlength="64" autocapitalize="none" spellcheck="false" class="w-full border rounded-xl px-4 py-3 mt-4" placeholder="Enter Pro activation key" autocomplete="off">' +
      '<div id="jspPremiumStatus" class="hidden text-sm rounded-lg p-3 mt-3"></div>' +
      '<div class="flex justify-end gap-2 mt-4">' +
      '<button id="jspPremiumCancel" class="px-4 py-2 border rounded-lg">Cancel</button>' +
      '<button id="jspPremiumActivate" class="px-4 py-2 bg-slate-900 text-white rounded-lg">Activate Pro</button>' +
      '</div></div>';

    document.body.appendChild(m);
    const input = m.querySelector('#jspPremiumKey');
    const status = m.querySelector('#jspPremiumStatus');
    const button = m.querySelector('#jspPremiumActivate');

    m.querySelector('#jspPremiumCancel').onclick = () => m.classList.add('hidden');
    button.onclick = async () => {
      status.className = 'text-sm rounded-lg p-3 mt-3 bg-gray-100';
      status.textContent = 'Verifying activation key...';
      status.classList.remove('hidden');
      button.disabled = true;
      try {
        await activate(input.value);
        status.className = 'text-sm rounded-lg p-3 mt-3 bg-green-50 text-green-700';
        status.textContent = 'Pro activated successfully on this browser.';
        setTimeout(() => {
          m.classList.add('hidden');
          window.JoesStudioPremium.openPro();
        }, 500);
      } catch (e) {
        status.className = 'text-sm rounded-lg p-3 mt-3 bg-red-50 text-red-700';
        status.textContent = e.message || 'Activation failed.';
        button.disabled = false;
      }
    };

    input.oninput = () => { input.value = input.value.replace(/[^A-Za-z0-9]/g, ''); };
    input.onkeydown = e => { if (e.key === 'Enter') button.click(); };
    input.focus();
  }

  function findAuthorButton() {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => /support\s+author/i.test((b.textContent || '').trim()));
  }

  function installUnifiedButton() {
    const existing = findAuthorButton();
    const generated = document.getElementById('jspLauncher');
    const button = existing || generated;
    if (!button) return false;

    // The old Support Author control is the single permanent home for Pro.
    if (generated && generated !== existing) generated.remove();

    button.id = 'jspLauncher';
    button.removeAttribute('onclick');
    button.title = active() ? 'Open Pro Tools' : 'Activate Pro';
    button.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition text-xs font-bold mr-1';
    button.innerHTML = active()
      ? '<i class="ph ph-crown text-lg"></i><span>Pro Tools</span>'
      : '<i class="ph ph-crown text-lg"></i><span>Pro</span>';
    button.onclick = () => window.JoesStudioPremium.open();
    return true;
  }

  wait(() => window.JoesStudioPro && (document.getElementById('jspLauncher') || findAuthorButton()), () => {
    window.JoesStudioPremium = {
      isActivated: active,
      activate,
      openPro: window.JoesStudioPro.openPanel.bind(window.JoesStudioPro),
      open: async () => active() ? window.JoesStudioPro.openPanel() : dialog()
    };

    installUnifiedButton();
  });
})();
