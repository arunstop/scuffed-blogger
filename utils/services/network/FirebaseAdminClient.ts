import { getAuth } from "firebase-admin/auth";
import "dotenv/config";
import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

const firebaseAdminConfig = {
  credential: credential.cert(
    JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON || ""),
  ),
  databaseURL:
    "https://tuturku-3e16b-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseAdminConfig, "FIREBASE_ADMIN");

export const firebaseAdminAuth = getAuth(app);
