/* ============================================================
   EPIC CINEMATIC FILMS — App Entry Point
   ============================================================ */

import { initRouter, getCurrentPath } from './router.js';
import { renderNav } from './components/nav.js';
import { renderFooter } from './components/footer.js';
import { auth } from './firebase-config.js';

async function init() {
  // Render shell components
  renderNav(document.getElementById('site-header'));
  renderFooter(document.getElementById('site-footer'));

  // Init router
  initRouter();

  // Auth state listener (for admin route protection)
  auth.onAuthStateChanged(user => {
    window.__epicUser = user;
    // Re-render current page if on admin
    if (getCurrentPath() === '/admin') {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  });
}

// Boot
document.addEventListener('DOMContentLoaded', init);
