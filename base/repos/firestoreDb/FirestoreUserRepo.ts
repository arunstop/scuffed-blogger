import {
  doc,
  getDoc, setDoc,
  updateDoc
} from "firebase/firestore/lite";
import { toJsonFriendly } from "../../../app/helpers/MainHelpers";
import { firebaseClient } from "../../clients/FirebaseClient";
import { UserModel } from "../../data/models/UserModel";

// =============================
// IMPORTANT : converting JSON stringify and then parse again
// is to bypass a type error that said firebase recognize custom type e.g. `ArticleModel`
// also to remove undefined on JSON format because firebase hates it
// this syntax =>
//
// =============================

const userDb = firebaseClient.collections.users;

// Updates user's data
export async function repoFsUserAdd(user: UserModel) {
  // Updating user in the database
  const newUserRef = doc(userDb, user.email || "");
  return setDoc(newUserRef, toJsonFriendly(user));
}

// Updates user's data
export async function repoFsUserUpdate(user: UserModel) {
  // Updating user in the database
  const editUserRef = doc(userDb, user.email || "");
  return updateDoc(editUserRef, toJsonFriendly(user));
}

export async function repoFsUserGetByEmail(
  email: string,
): Promise<UserModel | null> {
  // Get user from database
  const snapshot = await getDoc(doc(userDb, email));
  // Check if exists
  return snapshot.exists() ? (snapshot.data() as UserModel) : null;
}


