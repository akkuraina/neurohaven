import admin from "firebase-admin";

/**
 * Call after dotenv.config(). Set FIREBASE_SERVICE_ACCOUNT_JSON to the full
 * JSON of a Firebase service account (single line in .env) for Google sign-in verification.
 */
export function initFirebaseAdmin() {
  if (admin.apps.length) return true;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw?.trim()) return false;
  try {
    const cred = JSON.parse(raw);
    admin.initializeApp({ credential: admin.credential.cert(cred) });
    console.log("Firebase Admin initialized");
    return true;
  } catch (err) {
    console.error("Firebase Admin init failed:", err.message);
    return false;
  }
}

export function isFirebaseAdminReady() {
  return admin.apps.length > 0;
}

export async function verifyFirebaseIdToken(idToken) {
  if (!admin.apps.length) {
    const err = new Error("firebase_admin_not_configured");
    err.code = "firebase_admin_not_configured";
    throw err;
  }
  return admin.auth().verifyIdToken(idToken);
}

export { admin };
