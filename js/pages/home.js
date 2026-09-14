/* ============================================================
   HOME PAGE
   ============================================================ */

import { getCollection } from '../db.js';

export default {
  title: null, // home uses default title

  async render(container) {
    let films = [];
    try { films = (await getCollection('films')).slice(0, 3); } catch(e) {}

    container.innerHTML = `
      <!-- HERO -->
      <section class="section section--hero">
        <div class="container">
          <h1 style="font-size:var(--fs-4xl);max-width:14ch">
            Film & Cinema <span style="color:var(--accent-gold)">Solutions</span>
          </h1>
          <p style="font-size:var(--fs-md);max-width:55ch;margin-top:var(--sp-5)">
            We are a Production House offering production assistance to Film
            producers and companies, as well as individual clients and organisations.
          </p>
          <div style="display:flex;gap:var(--sp-4);flex-wrap:wrap;margin-top:var(--sp-7)">
            <a href="#/quote" class="btn btn--primary">Get a Quote</a>
            <a href="#/gallery" class="btn btn--outline">View Our Work</a>
          </div>
        </div>
      </section>

      <!-- DISCOUNT OFFER -->
      <section class="section" style="background:var(--bg-secondary)">
        <div class="container container--narrow" style="text-align:center">
          <span class="badge">Limited Time Offer</span>
          <h2 style="margin-top:var(--sp-4)">Discounted Music Video Production</h2>
          <p>Professional music video visualizer, trailer, or animation from
             as low as <strong style="color:var(--accent-gold)">KSH 20,000</strong>.
             For upcoming artists.</p>
          <a href="#/quote" class="btn btn--primary" style="margin-top:var(--sp-3)">Sign Up Now</a>
        </div>
      </section>

      <!-- SERVICES -->
      <section class="section">
        <div class="container">
          <h2 class="section__title">Our Services</h2>
          <p class="section__subtitle">A wide range of film and cinema solutions for individuals, organisations, and studios.</p>
          <div class="grid grid--3">
            ${[
              ['Shooting Locations Scouting', 'Find the perfect backdrop for your production.'],
              ['Live Streaming & Event Coverage', 'Broadcast your event with cinematic quality.'],
              ['Pre/Post-Production', 'Full pipeline support from script to screen.'],
              ['Crew & Cast Sourcing', 'Vetted professionals matched to your needs.'],
              ['Film Equipment Rentals', 'Industry-standard gear at competitive rates.'],
              ['SFX, Stunts & Set Construction', 'Bring ambitious visions to life safely.'],
            ].map(([t, d]) => `
              <div class="card">
                <div class="card__body">
                  <h3 class="card__title">${t}</h3>
                  <p class="card__text">${d}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- FILMS PREVIEW -->
      <section class="section" style="background:var(--bg-secondary)">
        <div class="container">
          <h2 class="section__title">Films</h2>
          <p class="section__subtitle">View our selection of in-house films and movies.</p>
          <div class="grid grid--3">
            ${films.length ? films.map(f => `
              <div class="card">
                <div class="card__body">
                  <h3 class="card__title">${f.title || 'Untitled'}</h3>
                  <p class="card__text">${(f.synopsis || '').slice(0, 120)}…</p>
                  <div class="card__meta">
                    <span class="badge badge--muted">${f.age || 'PG'}</span>
                    <span class="badge">${f.price || 'Free'}</span>
                  </div>
                </div>
              </div>
            `).join('') : '<p style="grid-column:1/-1">Films coming soon.</p>'}
          </div>
          <div style="text-align:center;margin-top:var(--sp-7)">
            <a href="#/films" class="btn btn--outline">View All Films</a>
          </div>
        </div>
      </section>

      <!-- COLLABORATIONS -->
      <section class="section">
        <div class="container">
          <h2 class="section__title">Our Collaborations</h2>
          <div style="display:flex;flex-wrap:wrap;gap:var(--sp-3);margin-top:var(--sp-5)">
            ${['Neezo Montana','Noor Montreal','Willy Paul','Chef Ali Mandhri','John Frog','Mbuzi Gang','K Daddy Tachoni','Karole Kasita','Petrooz']
              .map(n => `<span class="badge badge--muted" style="font-size:var(--fs-sm);padding:var(--sp-2) var(--sp-4)">${n}</span>`).join('')}
          </div>
        </div>
      </section>
    `;
  }
};
