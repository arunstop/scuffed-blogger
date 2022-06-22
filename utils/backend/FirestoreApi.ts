import { ArticleModel } from "./../data/models/Article";
import { articleDb } from "./FirebaseClient";
import { doc, getDoc, getDocs, setDoc } from "firebase/firestore/lite";

async function getArticleAll() {
  const snapshot = await getDocs(articleDb);
  console.log(snapshot);
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return list;
}

async function getArticleById(id: string) {
  // Get the requested document
  const snapshot = await getDoc(doc(articleDb, id));
  // Check if it exists
  const article = snapshot.exists()
    ? { id: snapshot.id, ...snapshot.data() }
    : null;

  return article;
}

async function addArticle(article: ArticleModel) {
  // Create new document reference
  const newDocRef = doc(articleDb, Math.floor(Math.random() * 30) + "");
  // Add the data
  await setDoc(newDocRef, article);
}

export const firestore = { getArticleAll, getArticleById, addArticle };
