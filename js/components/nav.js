/* ============================================================
   NAVIGATION COMPONENT
   Builds nav from Firestore 'pages' collection.
   ============================================================ */

import { getPages } from '../db.js';

export async function renderNav(header) {
  let pages = [];
  try {
    pages = await getPages();
  } catch (e) {
    // Fallback if Firestore not yet seeded
    pages = [
      { slug: '/',          title: 'Home',          order: 1 },
      { slug: '/quote',     title: 'Quote Estimate', order: 2 },
      { slug: '/gallery',   title: 'Gallery',        order: 3 },
      { slug: '/sounds',    title: 'Epic Sounds R.L',order: 4 },
      { slug: '/marketplace',title:'Artist Marketplace',order:5 },
      { slug: '/events',    title: 'Events',         order: 6 },
      { slug: '/films',     title: 'Films',          order: 7 },
    ];
  }

  const links = pages
    .filter(p => p.nav !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(p => `<a class="nav__link" href="#${p.slug}">${p.title}</a>`)
    .join('');

  header.innerHTML = `
    <nav class="nav" aria-label="Main navigation">
      <a class="nav__brand" href="#/">EPIC <span>CINEMATIC</span></a>
      <button class="nav__toggle" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <div class="nav__links">
        ${links}
        <a class="nav__link" href="#/admin" title="Admin">⚙</a>
      </div>
    </nav>
  `;

  // Mobile toggle
  const toggle = header.querySelector('.nav__toggle');
  const linksEl = header.querySelector('.nav__links');
  toggle.addEventListener('click', () => {
    const open = linksEl.classList.toggle('nav__links--open');
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click (mobile)
  linksEl.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      linksEl.classList.remove('nav__links--open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Header scroll effect
  window.addEventListener('scroll', () => {
    header.classList.toggle('site-header--scrolled', window.scrollY > 20);
  }, { passive: true });
}
