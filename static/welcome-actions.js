/* Welcome screen actions: bind directly to DOM controls instead of relying on inline handlers. */
(function () {
  'use strict';

  function bind() {
    const modal = document.getElementById('welcomeModal');
    if (!modal || !window.App) return false;

    const buttons = Array.from(modal.querySelectorAll('button'));
    const findButton = (text) => buttons.find((b) => (b.textContent || '').trim().replace(/\s+/g, ' ').includes(text));
    const blank = findButton('New Blank Paper');
    const open = findButton('Open Paper File');
    const mine = findButton('My Templates');
    const input = document.getElementById('projectImportInput');

    if (!blank || !open || !mine || !input) return false;

    // Override the old inline handlers so the welcome screen has one deterministic event path.
    blank.onclick = function (event) {
      event.preventDefault();
      event.stopPropagation();
      try {
        if (App.templates && typeof App.templates.load === 'function') {
          App.templates.load('blank_a4');
        } else {
          throw new Error('Template engine is unavailable.');
        }
      } catch (error) {
        console.error('[Joes Studio] New Blank Paper failed:', error);
        if (window.Utils && typeof Utils.toast === 'function') Utils.toast(error.message || 'Unable to create a blank paper.', 'error');
      }
      return false;
    };

    open.onclick = function (event) {
      event.preventDefault();
      event.stopPropagation();
      input.click();
      return false;
    };

    // Rebind the project picker as well, ensuring the selected .paper file reaches the existing loader.
    input.onchange = function () {
      const file = input.files && input.files[0];
      if (!file) return;
      try {
        if (App.io && typeof App.io.loadProject === 'function') {
          App.io.loadProject(file);
        } else {
          throw new Error('Project loader is unavailable.');
        }
      } catch (error) {
        console.error('[Joes Studio] Open Paper File failed:', error);
        if (window.Utils && typeof Utils.toast === 'function') Utils.toast(error.message || 'Unable to open the project.', 'error');
      } finally {
        input.value = '';
      }
    };

    mine.onclick = function (event) {
      event.preventDefault();
      event.stopPropagation();
      try {
        if (App.ui && typeof App.ui.showModal === 'function') {
          App.ui.showModal('myTemplatesModal');
        } else {
          throw new Error('Template dialog is unavailable.');
        }
      } catch (error) {
        console.error('[Joes Studio] My Templates failed:', error);
        if (window.Utils && typeof Utils.toast === 'function') Utils.toast(error.message || 'Unable to open My Templates.', 'error');
      }
      return false;
    };

    return true;
  }

  function waitForApp(attempts) {
    if (bind()) return;
    if (attempts > 0) setTimeout(() => waitForApp(attempts - 1), 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForApp(80), { once: true });
  } else {
    waitForApp(80);
  }
})();
