import { doc, getDoc } from "firebase/firestore/lite";
import { UserModel } from "../../../data/models/UserModel";

import { firebaseClient } from "../FirebaseClient";

function getUserDb() {
  return firebaseClient.collections.users;
}

export async function fsUserGetByEmail(
  email: string,
): Promise<UserModel | null> {
  // Get user from database
  const snapshot = await getDoc(doc(getUserDb(), email));
  // Check if exists
  return snapshot.exists() ? (snapshot.data() as UserModel) : null;
}
