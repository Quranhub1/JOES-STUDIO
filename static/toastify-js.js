/* Joes Studio bootstrap: preserve Toastify and load Pro activation modules before the main app initializes. */
(function () {
  'use strict';
  document.write('<script src="./static/toastify-core.js"><\\/script>');
  document.write('<script src="./static/joes-studio-pro.js"><\\/script>');
  document.write('<script src="./static/joes-studio-premium.js"><\\/script>');
})();