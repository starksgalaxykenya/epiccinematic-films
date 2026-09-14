/* ============================================================
   FOOTER COMPONENT
   ============================================================ */

export function renderFooter(footer) {
  footer.innerHTML = `
    <div class="container">
      <div class="footer__grid">
        <div>
          <div class="nav__brand" style="font-size:var(--fs-lg);margin-bottom:var(--sp-3)">
            EPIC <span>CINEMATIC</span>
          </div>
          <p style="font-size:var(--fs-sm)">
            A Stark's Galaxy Group subsidiary. Film & cinema solutions,
            music video production, and creative talent.
          </p>
        </div>
        <div>
          <h4 class="footer__heading">Explore</h4>
          <a class="footer__link" href="#/gallery">Gallery</a>
          <a class="footer__link" href="#/films">Films</a>
          <a class="footer__link" href="#/events">Events</a>
          <a class="footer__link" href="#/marketplace">Marketplace</a>
        </div>
        <div>
          <h4 class="footer__heading">Services</h4>
          <a class="footer__link" href="#/quote">Quote Estimate</a>
          <a class="footer__link" href="#/sounds">Epic Sounds R.L</a>
          <a class="footer__link" href="#/quote">Location Scouting</a>
          <a class="footer__link" href="#/quote">Post-Production</a>
        </div>
        <div>
          <h4 class="footer__heading">Contact</h4>
          <a class="footer__link" href="tel:+254715150894">+254 7 151 5 0894</a>
          <a class="footer__link" href="mailto:contact@filmsepiccinematic.com">contact@filmsepiccinematic.com</a>
          <a class="footer__link" href="mailto:starksgalaxykenya@gmail.com">starksgalaxykenya@gmail.com</a>
          <span class="footer__link">Nairobi, Kenya</span>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} Starks Galaxy Africa. All Rights Reserved.</span>
        <span>EPIC CINEMATIC FILMS — A Stark's Galaxy Group Subsidiary</span>
      </div>
    </div>
  `;
}
