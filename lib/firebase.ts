import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

// ─── Lazy singletons ──────────────────────────────────────────────────────────
// Imports are top-level (required for Firebase component registration),
// but initialization is deferred until first use to avoid build-time crashes.

let _app: FirebaseApp | undefined;
let _db: Firestore | undefined;
let _storage: FirebaseStorage | undefined;
let _auth: Auth | undefined;

function app(): FirebaseApp {
  if (!_app) {
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return _app;
}

export function getDb(): Firestore {
  if (!_db) _db = getFirestore(app());
  return _db;
}

export function getStorage_(): FirebaseStorage {
  if (!_storage) _storage = getStorage(app());
  return _storage;
}

export function getAuth_(): Auth {
  if (!_auth) _auth = getAuth(app());
  return _auth;
}
