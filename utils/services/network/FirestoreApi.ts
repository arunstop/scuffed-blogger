import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, getDocs, setDoc } from "firebase/firestore/lite";
import { createSuccessResponse } from "../../data/Main";
import { ArticleModel } from "../../data/models/ArticleModel";
import { createUserModel, UserModel } from "../../data/models/UserModel";
import { RegisterFields } from "./../../../components/auth/AuthRegisterForm";
import {
  createErrorResponse,
  MainNetworkResponse,
  netCreateLoadingResponse
} from "./../../data/Main";
import { firebaseAuth, firebaseClient } from "./FirebaseClient";

const articleDb = firebaseClient.db.article;
const userDb = firebaseClient.db.user;

export interface UserAuth {
  email: string;
  password: string;
}

type AuthRegisterUserProps = UserModel | FirebaseError | null;
// auth
async function authRegisterUser({
  fields,
  callback,
}: {
  fields: RegisterFields;
  callback?: (resp: MainNetworkResponse<AuthRegisterUserProps>) => void;
}): Promise<AuthRegisterUserProps> {
  let data: AuthRegisterUserProps = null;

  try {
    // Show a loading state still,
    // because the system need to add yet another data to the `USER DB`
    callback?.(
      netCreateLoadingResponse(
        "Adding your information into our database...",
        null,
      ),
    );

    // creating user in `AUTH DB`
    const userCred = await createUserWithEmailAndPassword(
      firebaseAuth,
      fields.email,
      fields.password,
    );

    data = createUserModel({ firebaseUser: JSON.parse(JSON.stringify(userCred.user)) });
    // await waitFor(1000);
    // Adding the user
    await addUser({
      user: data,
      callback: (resp) => {
        // Show success
        if (resp.status === "error") {
          callback?.(
            createErrorResponse<FirebaseError>(
              resp.message,
              resp.data as FirebaseError,
            ),
          );
        }
        // Show error
        else if (resp.status === "success") {
          callback?.(
            createSuccessResponse<UserModel>(
              "User has been registered to the database",
              data as UserModel,
            ),
          );
        }
      },
    });
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
  callback?: (resp: MainNetworkResponse<AuthRegisterUserProps>) => void;
}): Promise<AuthRegisterUserProps> {
  let data: AuthRegisterUserProps = null;

  try {
    // Show a loading state still,
    // because the system need to add yet another data to the `USER DB`
    callback?.(
      netCreateLoadingResponse(
        "Adding your information into our database...",
        null,
      ),
    );

    // creating user in `AUTH DB`
    const userCred = await signInWithEmailAndPassword(
      firebaseAuth,
      fields.email,
      fields.password,
    );

    data = createUserModel({ firebaseUser: JSON.parse(JSON.stringify(userCred.user)) });
    // await waitFor(1000);
    // Adding the user
    await addUser({
      user: data,
      callback: (resp) => {
        // Show success
        if (resp.status === "error") {
          callback?.(
            createErrorResponse<FirebaseError>(
              resp.message,
              resp.data as FirebaseError,
            ),
          );
        }
        // Show error
        else if (resp.status === "success") {
          callback?.(
            createSuccessResponse<UserModel>(
              "User has been registered to the database",
              data as UserModel,
            ),
          );
        }
      },
    });
  } catch (error) {
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

type AddUserProps = UserModel | FirebaseError | null;
async function addUser({
  user,
  callback,
}: {
  user: UserModel;
  callback?: (resp: MainNetworkResponse<AddUserProps>) => void;
}): Promise<AddUserProps> {
  let data: AddUserProps = null;
  try {
    // Create new data with its id
    const newUserRef = doc(userDb, user.firebaseUser?.uid);
    // Adding to the database
    await setDoc(newUserRef, user); 
    data = user;
    // Show success
    callback?.(
      createSuccessResponse<AddUserProps>(
        "User has been added to the database",
        user,
      ),
    );
  } catch (error) {
    // Show error
    // console.log(error);
    callback?.(
      createErrorResponse<AddUserProps>(error + "", error as FirebaseError),
    );
  }
  return data;
}

export const firebaseApi = {
  getArticleAll,
  getArticleById,
  addArticle,
  addUser,
  authRegisterUser,
  authLoginUser,
};
