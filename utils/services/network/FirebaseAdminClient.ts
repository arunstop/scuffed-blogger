import { getAuth } from 'firebase-admin/auth';
import "dotenv/config";
import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

const app = initializeApp({
  credential: credential.cert(
    process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON || "",
  ),
  databaseURL:
    "https://tuturku-3e16b-default-rtdb.asia-southeast1.firebasedatabase.app",
});

export const firebaseAdminAuth = getAuth(app);
