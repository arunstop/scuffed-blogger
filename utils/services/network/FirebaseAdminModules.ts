import { firebaseAdminAuth } from "./FirebaseAdminClient";

// validate
export async function fbaValidate(token: string) {
  return firebaseAdminAuth.verifyIdToken(token, true);
}
