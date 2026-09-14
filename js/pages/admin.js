/* ============================================================
   ADMIN DASHBOARD — Auth-gated CRUD for all collections
   ============================================================ */

import { auth } from '../firebase-config.js';
import {
  getCollection, addDocument, updateDocument, deleteDocument
} from '../db.js';
import { openModal, closeModal } from '../components/modal.js';
import { showToast } from '../utils/toast.js';

const COLLECTIONS = [
  { key: 'films',       label: 'Films',       fields: ['title','synopsis','age','price','topic','length'] },
  { key: 'gallery',     label: 'Gallery',     fields: ['title','category','description','imageUrl'] },
  { key: 'events',      label: 'Events',      fields: ['title','date','description','imageUrl'] },
  { key: 'artists',     label: 'Artists',     fields: ['name','genre','bio','imageUrl','rate'] },
  { key: 'quotes',      label: 'Quote Requests', fields: ['name','email','phone','service','budget','message'] },
  { key: 'pages',       label: 'Pages',       fields: ['slug','title','order','nav'] },
];

export default {
  title: 'Admin',

  async render(container) {
    const user = auth.currentUser;

    if (!user) {
      container.innerHTML = `
        <section class="section container container--narrow">
          <h1>Admin Login</h1>
          <p>Sign in to manage content.</p>
          <form id="login-form" style="margin-top:var(--sp-6);max-width:400px">
            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input class="form-input" type="email" id="email" required autocomplete="email" />
            </div>
            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input class="form-input" type="password" id="password" required autocomplete="current-password" />
            </div>
            <button class="btn btn--primary" type="submit" style="width:100%">Sign In</button>
            <p id="login-error" class="form-error" style="margin-top:var(--sp-3)"></p>
          </form>
        </section>
      `;

      container.querySelector('#login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
          await auth.signInWithEmailAndPassword(email, password);
          showToast('Signed in successfully', 'success');
          this.render(container);
        } catch (err) {
          container.querySelector('#login-error').textContent = err.message;
        }
      });
      return;
    }

    // --- Logged in: dashboard ---
    container.innerHTML = `
      <section class="section container">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--sp-4)">
          <div>
            <h1>Admin Dashboard</h1>
            <p style="margin:0">Signed in as <strong style="color:var(--accent-gold)">${user.email}</strong></p>
          </div>
          <button class="btn btn--ghost" id="logout-btn">Sign Out</button>
        </div>

        <div id="admin-content" style="margin-top:var(--sp-8)">
          <div class="spinner"></div>
        </div>
      </section>
    `;

    container.querySelector('#logout-btn').addEventListener('click', async () => {
      await auth.signOut();
      showToast('Signed out', 'info');
      this.render(container);
    });

    this.renderDashboard(container.querySelector('#admin-content'));
  },

  async renderDashboard(el) {
    let html = '';

    for (const col of COLLECTIONS) {
      let docs = [];
      try { docs = await getCollection(col.key); } catch(e) {}

      html += `
        <div class="card" style="margin-bottom:var(--sp-6);overflow:visible">
          <div class="card__body">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--sp-3);margin-bottom:var(--sp-4)">
              <h3 class="card__title" style="margin:0">${col.label} <span class="badge badge--muted">${docs.length}</span></h3>
              <button class="btn btn--primary" data-add="${col.key}" style="padding:var(--sp-2) var(--sp-4);font-size:var(--fs-xs)">+ Add</button>
            </div>
            <div style="overflow-x:auto">
              <table style="width:100%;border-collapse:collapse;font-size:var(--fs-sm)">
                <thead>
                  <tr style="border-bottom:1px solid var(--border-subtle);text-align:left">
                    <th style="padding:var(--sp-2)">ID</th>
                    ${col.fields.slice(0, 4).map(f => `<th style="padding:var(--sp-2);text-transform:capitalize">${f}</th>`).join('')}
                    <th style="padding:var(--sp-2)">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${docs.map(d => `
                    <tr style="border-bottom:1px solid var(--border-subtle)">
                      <td style="padding:var(--sp-2);color:var(--text-secondary);font-family:var(--font-mono);font-size:var(--fs-xs)">${d.id.slice(0,6)}…</td>
                      ${col.fields.slice(0, 4).map(f => `
                        <td style="padding:var(--sp-2)">${String(d[f] ?? '').slice(0, 40)}</td>
                      `).join('')}
                      <td style="padding:var(--sp-2);white-space:nowrap">
                        <button class="btn btn--ghost" data-edit="${col.key}" data-id="${d.id}" style="font-size:var(--fs-xs)">Edit</button>
                        <button class="btn btn--ghost" data-delete="${col.key}" data-id="${d.id}" style="font-size:var(--fs-xs);color:var(--error)">Delete</button>
                      </td>
                    </tr>
                  `).join('') || `<tr><td colspan="${col.fields.length + 2}" style="padding:var(--sp-4);color:var(--text-secondary)">No records.</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    el.innerHTML = html;
    this.bindAdminEvents(el);
  },

  bindAdminEvents(el) {
    // Add
    el.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', () => {
        const colKey = btn.dataset.add;
        const col = COLLECTIONS.find(c => c.key === colKey);
        this.openFormModal(col, null);
      });
    });

    // Edit
    el.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const colKey = btn.dataset.edit;
        const id = btn.dataset.id;
        const col = COLLECTIONS.find(c => c.key === colKey);
        const doc = await getCollection(colKey).then(docs => docs.find(d => d.id === id));
        this.openFormModal(col, doc);
      });
    });

    // Delete
    el.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const colKey = btn.dataset.delete;
        const id = btn.dataset.id;
        if (!confirm('Delete this record? This cannot be undone.')) return;
        try {
          await deleteDocument(colKey, id);
          showToast('Deleted successfully', 'success');
          this.renderDashboard(document.querySelector('#admin-content'));
        } catch (err) {
          showToast('Delete failed: ' + err.message, 'error');
        }
      });
    });
  },

  openFormModal(col, doc) {
    const isEdit = !!doc;
    const formHtml = col.fields.map(f => `
      <div class="form-group">
        <label class="form-label">${f}</label>
        <input class="form-input" name="${f}" value="${doc?.[f] ?? ''}" />
      </div>
    `).join('');

    openModal({
      title: `${isEdit ? 'Edit' : 'Add'} ${col.label.slice(0, -1)}`,
      content: `
        <form id="crud-form">
          ${formHtml}
          <div style="display:flex;gap:var(--sp-3);margin-top:var(--sp-5)">
            <button type="submit" class="btn btn--primary" style="flex:1">${isEdit ? 'Save Changes' : 'Create'}</button>
            <button type="button" class="btn btn--ghost" id="modal-cancel">Cancel</button>
          </div>
        </form>
      `,
      onClose: () => {}
    });

    document.querySelector('#modal-cancel')?.addEventListener('click', closeModal);

    document.querySelector('#crud-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      try {
        if (isEdit) {
          await updateDocument(col.key, doc.id, data);
          showToast('Updated successfully', 'success');
        } else {
          await addDocument(col.key, data);
          showToast('Created successfully', 'success');
        }
        closeModal();
        this.renderDashboard(document.querySelector('#admin-content'));
      } catch (err) {
        showToast('Error: ' + err.message, 'error');
      }
    });
  }
};
