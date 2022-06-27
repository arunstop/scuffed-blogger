import { articleDb } from "./FirebaseClient";
import { doc, getDoc, getDocs, setDoc } from "firebase/firestore/lite";
import { ArticleModel } from "../../data/models/ArticleModel";

async function getArticleAll() {
  const snapshot = await getDocs(articleDb);
  console.log(snapshot);
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return list;
}

async function getArticleById(id: string): Promise<ArticleModel | null> {
  // Get the requested document
  const snapshot = await getDoc(doc(articleDb, id));
  // Check if it exists
  const article = snapshot.exists()
    ? { id: snapshot.id, ...snapshot.data() } as ArticleModel
    : null;

  return article;
}

async function addArticle(article: ArticleModel) {
  // Create new document reference
  const newDocRef = doc(articleDb, article.id);
  // Add the data
  await setDoc(newDocRef, article);
}

export const firestore = { getArticleAll, getArticleById, addArticle };
