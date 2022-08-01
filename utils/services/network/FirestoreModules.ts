import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";
import _ from "lodash";
import { ArticleModel } from "../../data/models/ArticleModel";
import { UserModel } from "../../data/models/UserModel";
import { toJsonFriendly } from "../../helpers/MainHelpers";
import { firebaseClient } from "./FirebaseClient";

// =============================
// IMPORTANT : converting JSON stringify and then parse again
// is to bypass a type error that said firebase recognize custom type e.g. `ArticleModel`
// also to remove undefined on JSON format because firebase hates it
// this syntax =>
//
// =============================

const articleDb = firebaseClient.collections.article;
const userDb = firebaseClient.collections.user;

// Updates user's data
export async function fsUserUpdate(user: UserModel) {
  // Updating user in the database
  const editUserRef = doc(userDb, user.email || "");
  return await updateDoc(editUserRef, toJsonFriendly(user));
}

export async function fsUserGetByEmail(email: string): Promise<UserModel | null> {
  // Get user from database
  const snapshot = await getDoc(doc(userDb, email));
  // Check if exists
  return snapshot.exists() ? (snapshot.data() as UserModel) : null;
}

// @return all articles
export async function fsArticleGetAll(): Promise<ArticleModel[] | null> {
  const snapshot = await getDocs(articleDb);
  // console.log(snapshot);
  const list = snapshot.docs.map((doc) => doc.data() as ArticleModel);
  return list;
}

// @return an article based on `id`
export async function fsArticleGetById(
  id: string,
): Promise<ArticleModel | null> {
  // Get the requested document
  const snapshot = await getDoc(doc(articleDb, id));
  // Check if it exists
  const article = snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as ArticleModel)
    : null;

  return article;
}

// Adds an article to database
export async function fsArticleAdd(article: ArticleModel) {
  const ref = doc(articleDb, article.id);
  return await setDoc(ref, article);
}

// Updates an article in database
export async function fsArticleUpdate(
  article: ArticleModel,
  // only accept ArticleModel keys
  fields?: (keyof ArticleModel)[],
) {
  const ref = doc(articleDb, article.id);
  // check if fields are valid and specified
  // if YES, then update only the fields
  if (fields) {
    // mapping `fields` param to the its matching data on the `article` param
    const filledFields = fields.map((key, idx) => ({ [key]: article[key] }));
    // turning the array into object
    const updatedFields = _.reduce(
      filledFields, // array
      (array, currentField) => ({ ...array, ...currentField }), // iterator
      {},
    );
    return await updateDoc(ref, updatedFields);
  }
  // if NO, then update the whole document
  return await updateDoc(ref, toJsonFriendly(article));
}


