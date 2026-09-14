/* ============================================================
   FIREBASE CONFIGURATION
   Replace with your project's config from Firebase Console.
   ============================================================ */

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "epic-cinematic.firebaseapp.com",
  projectId: "epic-cinematic",
  storageBucket: "epic-cinematic.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialise Firebase (compat build)
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db   = firebase.firestore();

// Enable offline persistence
db.enablePersistence({ synchronizeTabs: true })
  .catch(err => {
    if (err.code === 'failed-precondition') {
      console.warn('[Firestore] Persistence failed: multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('[Firestore] Persistence not available in this browser');
    }
  });
