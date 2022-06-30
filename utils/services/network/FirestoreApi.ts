import { RegisterFields } from "./../../../components/auth/AuthRegisterForm";
import { createErrorResponse, MainNetworkResponse } from "./../../data/Main";
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { doc, getDoc, getDocs, setDoc } from "firebase/firestore/lite";
import { createSuccessResponse } from "../../data/Main";
import { ArticleModel } from "../../data/models/ArticleModel";
import { firebaseClient } from "./FirebaseClient";

const articleDb = firebaseClient.db.article;
const auth = firebaseClient.auth;

export interface UserAuth {
  email: string;
  password: string;
}

// auth
async function registerUser({
  fields,
  callback,
}: {
  fields: RegisterFields;
  callback?: (resp: MainNetworkResponse<User | null>) => void;
}): Promise<User | null> {
  let data: User | null = null;

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      fields.email,
      fields.password,
    );

    data = userCred.user;
    callback?.(
      createSuccessResponse<User>(
        "User has been registered to the database",
        data,
      ),
    );
  } catch (error) {
    callback?.(createErrorResponse(error + ""));
  }
  return data;
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

export const firebaseApi = { getArticleAll, getArticleById, addArticle,registerUser };

