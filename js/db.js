/* ============================================================
   FIRESTORE DATA ACCESS LAYER
   ============================================================ */

import { db } from './firebase-config.js';

/* --- Generic CRUD --- */
export async function getCollection(name, orderByField = null, direction = 'asc') {
  let ref = db.collection(name);
  if (orderByField) ref = ref.orderBy(orderByField, direction);
  const snap = await ref.get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getDocument(collection, id) {
  const doc = await db.collection(collection).doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

export async function addDocument(collection, data) {
  const ref = await db.collection(collection).add({
    ...data,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  return ref.id;
}

export async function updateDocument(collection, id, data) {
  await db.collection(collection).doc(id).update({
    ...data,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

export async function deleteDocument(collection, id) {
  await db.collection(collection).doc(id).delete();
}

/* --- Real-time listener --- */
export function onCollectionChange(name, callback, orderByField = null) {
  let ref = db.collection(name);
  if (orderByField) ref = ref.orderBy(orderByField);
  return ref.onSnapshot(snap => {
    callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
}

/* --- Specific helpers --- */
export const getPages      = () => getCollection('pages', 'order');
export const getGallery    = () => getCollection('gallery', 'order');
export const getFilms      = () => getCollection('films', 'title');
export const getEvents     = () => getCollection('events', 'date', 'desc');
export const getArtists    = () => getCollection('artists', 'name');
export const getQuotes     = () => getCollection('quotes', 'createdAt', 'desc');
