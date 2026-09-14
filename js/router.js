/* ============================================================
   HASH-BASED CLIENT-SIDE ROUTER
   Pages are lazy-loaded modules. Add/remove routes here.
   ============================================================ */

const routes = {
  '/':           () => import('./pages/home.js'),
  '/quote':      () => import('./pages/quote.js'),
  '/gallery':    () => import('./pages/gallery.js'),
  '/sounds':     () => import('./pages/sounds.js'),
  '/marketplace':() => import('./pages/marketplace.js'),
  '/events':     () => import('./pages/events.js'),
  '/films':      () => import('./pages/films.js'),
  '/admin':      () => import('./pages/admin.js'),
};

let currentPage = null;

export async function navigate(path) {
  const route = routes[path] || routes['/'];
  const container = document.getElementById('main');

  // Show loading skeleton
  container.innerHTML = '<div class="container section"><div class="spinner"></div></div>';

  try {
    const module = await route();
    const page = module.default;

    // Cleanup previous page
    if (currentPage && currentPage.destroy) currentPage.destroy();

    // Render new page
    container.innerHTML = '';
    container.classList.remove('page-enter');
    void container.offsetWidth; // force reflow
    container.classList.add('page-enter');

    page.render(container);
    currentPage = page;

    // Update document title
    document.title = page.title
      ? `${page.title} — Epic Cinematic Films`
      : 'Epic Cinematic Films';

    // Update active nav link
    document.querySelectorAll('.nav__link').forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '') || '/';
      link.classList.toggle('nav__link--active', href === path);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

  } catch (err) {
    console.error('[Router] Failed to load page:', err);
    container.innerHTML = `
      <div class="container section">
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="#/" class="btn btn--primary">Go Home</a>
      </div>`;
  }
}

export function initRouter() {
  window.addEventListener('hashchange', () => {
    const path = location.hash.replace('#', '') || '/';
    navigate(path);
  });

  // Initial route
  const path = location.hash.replace('#', '') || '/';
  navigate(path);
}

export function getCurrentPath() {
  return location.hash.replace('#', '') || '/';
}
