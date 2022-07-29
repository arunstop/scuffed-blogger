import { doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore/lite";
import { ArticleModel } from "../../data/models/ArticleModel";
import { UserModel } from "../../data/models/UserModel";
import { firebaseClient } from "./FirebaseClient";


// =============================
// IMPORTANT : converting JSON stringify and then parse again 
// is to remove undefined on JSON format because firebase hates it
// this syntax => JSON.parse(JSON.stringify(article))
// 
// =============================

const articleDb = firebaseClient.db.article;
const userDb = firebaseClient.db.user;

// Updates user's data
export async function fsUpdateUser(user: UserModel) {
  // Updating user in the database
  const editUserRef = doc(userDb, user.email || "");
  await updateDoc(editUserRef, JSON.parse(JSON.stringify(user)));
}

export async function fsGetUser(email: string): Promise<UserModel | null> {
  // Get user from database
  const snapshot = await getDoc(doc(userDb, email));
  // Check if exists
  return snapshot.exists() ? (snapshot.data() as UserModel) : null;
}

// @return all articles
export async function fsGetArticleAll(): Promise<ArticleModel[] | null> {
  const snapshot = await getDocs(articleDb);
  // console.log(snapshot);
  const list = snapshot.docs.map((doc) => doc.data() as ArticleModel);
  return list;
}

// @return an article based on `id`
export async function fsGetArticleById(id: string): Promise<ArticleModel | null> {
  // Get the requested document
  const snapshot = await getDoc(doc(articleDb, id));
  // Check if it exists
  const article = snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as ArticleModel)
    : null;

  return article;
}

// Adds an article to database
export async function fsArticleAdd(article: ArticleModel){
  const ref = doc(articleDb,article.id);
  await setDoc(ref,article);
}

// Updates an article in database
export async function fsArticleUpdate(article: ArticleModel){
  const ref = doc(articleDb,article.id);
  await updateDoc(ref,JSON.parse(JSON.stringify(article)));
}