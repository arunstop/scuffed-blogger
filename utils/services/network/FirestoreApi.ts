import { FirebaseError } from "firebase/app";
import { RegisterFields } from "./../../../components/auth/AuthRegisterForm";
import { createErrorResponse, MainNetworkResponse } from "./../../data/Main";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { doc, getDoc, getDocs, setDoc } from "firebase/firestore/lite";
import { createSuccessResponse } from "../../data/Main";
import { ArticleModel } from "../../data/models/ArticleModel";
import { firebaseAuth, firebaseClient } from "./FirebaseClient";

const articleDb = firebaseClient.db.article;

export interface UserAuth {
  email: string;
  password: string;
}

// auth
async function authRegisterUser({
  fields,
  callback,
}: {
  fields: RegisterFields;
  callback?: (resp: MainNetworkResponse<User | FirebaseError | null>) => void;
}): Promise<User | FirebaseError | null> {
  let data: User | FirebaseError | null = null;

  try {
    const userCred = await createUserWithEmailAndPassword(
      firebaseAuth,
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
    callback?.(
      createErrorResponse<FirebaseError>(error + "", error as FirebaseError),
    );
  }
  return data;
}

async function authLoginUser({
  fields,
  callback,
}: {
  fields: RegisterFields;
  callback?: (resp: MainNetworkResponse<User | FirebaseError | null>) => void;
}): Promise<User | FirebaseError | null> {
  let data: User | FirebaseError | null = null;

  try {
    const userCred = await signInWithEmailAndPassword(
      firebaseAuth,
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
    // console.log((error as FirebaseError).code);
    // console.log((error as FirebaseError).message);
    callback?.(
      createErrorResponse<FirebaseError>(error + "", error as FirebaseError),
    );
  }
  return data;
}

// async function authCheckUserExistence({
//   email,
//   callback,
// }:{
//   email:string,
//   callback?:(resp:MainNetworkResponse<string|null>)=>void,
// }):Promise<string|null>{
//   let data: string | null = null;
//   try{
//     const existingUser = await
//   }catch(error){
//     callback?.(createErrorResponse(error+""))
//   }

//   return data;

// };

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

export const firebaseApi = {
  getArticleAll,
  getArticleById,
  addArticle,
  authRegisterUser,
  authLoginUser,
};
