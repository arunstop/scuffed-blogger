import { createErrorResponse, MainNetworkResponse } from "./../../data/Main";
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { doc, getDoc, getDocs, setDoc } from "firebase/firestore/lite";
import { createSuccessResponse } from "../../data/Main";
import { ArticleModel } from "../../data/models/ArticleModel";
import { firebase } from "./FirebaseClient";

const articleDb = firebase.db.article;
const auth = firebase.auth;

export interface UserAuth {
  email: string;
  password: string;
}

// auth
async function registerUser({
  email,
  password,
}: UserAuth): Promise<MainNetworkResponse<User | null>> {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return createSuccessResponse<User>(
      "User has been registered to the database",
      userCred.user,
    );
  } catch (error) {
    return createErrorResponse(error + "");
  }
}

// article
async function getArticleAll(): Promise<ArticleModel[] | null> {
  const snapshot = await getDocs(articleDb);
  // console.log(snapshot);
  const list = snapshot.docs.map((doc) => doc.data() as ArticleModel);
  return list;
}

async function getArticleById(id: string): Promise<ArticleModel | null> {
  // Get the requested document
  const snapshot = await getDoc(doc(articleDb, id));
  // Check if it exists
  const article = snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as ArticleModel)
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
export const firebaseAuth = { registerUser };
