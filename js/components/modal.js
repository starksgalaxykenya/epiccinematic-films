/* ============================================================
   MODAL COMPONENT
   ============================================================ */

let overlay = null;

export function openModal({ title, content, onClose }) {
  if (overlay) closeModal();

  overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="modal__header">
        <h3 class="modal__title">${title}</h3>
        <button class="modal__close" aria-label="Close">&times;</button>
      </div>
      <div class="modal__content">${content}</div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('modal-overlay--open'));

  overlay.querySelector('.modal__close').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', escHandler);
  overlay._onClose = onClose;
}

export function closeModal() {
  if (!overlay) return;
  overlay.classList.remove('modal-overlay--open');
  document.removeEventListener('keydown', escHandler);
  if (overlay._onClose) overlay._onClose();
  setTimeout(() => { overlay?.remove(); overlay = null; }, 250);
}

function escHandler(e) {
  if (e.key === 'Escape') closeModal();
}
