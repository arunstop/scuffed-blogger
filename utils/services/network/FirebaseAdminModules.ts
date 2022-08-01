import { firebaseAdminAuth } from "./FirebaseAdminClient";

export async function fbaValidate(token: string) {
  return firebaseAdminAuth.verifyIdToken(token, true);
}
