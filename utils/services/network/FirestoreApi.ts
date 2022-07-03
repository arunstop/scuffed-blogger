import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";
import { netCreateSuccessResponse } from "../../data/Main";
import { ArticleModel } from "../../data/models/ArticleModel";
import { createUserModel, UserModel } from "../../data/models/UserModel";
import { RegisterFields } from "./../../../components/auth/AuthRegisterForm";
import {
  MainNetworkResponse,
  netCreateErrorResponse,
  netCreateLoadingResponse,
} from "./../../data/Main";
import { firebaseAuth, firebaseClient } from "./FirebaseClient";

const articleDb = firebaseClient.db.article;
const userDb = firebaseClient.db.user;

export interface UserAuth {
  email: string;
  password: string;
}

type AuthUserProps = UserModel | null | FirebaseError;
// auth
async function authRegisterUser({
  fields,
  callback,
}: {
  fields: RegisterFields;
  callback?: (resp: MainNetworkResponse<AuthUserProps>) => void;
}): Promise<AuthUserProps> {
  let data: AuthUserProps = null;

  try {
    // Show a loading state still,
    // because the system need to add yet another data to the `USER DB`

    // Adding the user
    data = await addUser({
      user: createUserModel({
        email: fields.email,
      }),
      callback: (resp) => {
        // Show success
        if (resp.status === "error") {
          callback?.(
            netCreateErrorResponse<FirebaseError>(
              resp.message,
              resp.data as FirebaseError,
            ),
          );
        }
        // Show error
        else if (resp.status === "success") {
          callback?.(
            netCreateSuccessResponse<UserModel>(
              "User has been registered to the database",
              data as UserModel,
            ),
          );
        }
      },
    });

    // Do not proceed if failed/
    // mostly because of existing user
    if (data === null) return null;

    callback?.(
      netCreateLoadingResponse("Getting your data from our database...", null),
    );

    let authData: User | null = null;

    try {
      const userCred = await createUserWithEmailAndPassword(
        firebaseAuth,
        fields.email,
        fields.password,
      );
      authData = userCred.user;
    } catch (error) {
      authData = null;
      callback?.(
        netCreateErrorResponse<FirebaseError>(
          error + "",
          error as FirebaseError,
        ),
      );
    }

    if (authData === null) return null;

    // Adding the complete user information to user database
    const editUserRef = doc(userDb, authData?.email || "");
    data = {
      ...(data as UserModel),
      firebaseUser: authData as User,
    };
    await updateDoc(
      editUserRef,
      JSON.parse(
        JSON.stringify(data),
      ),
    );

    // data = ;

    // creating user in `AUTH DB`
    // const userCred = await createUserWithEmailAndPassword(
    //   firebaseAuth,
    //   fields.email,
    //   fields.password,
    // );
  } catch (error) {
    callback?.(
      netCreateErrorResponse<FirebaseError>(error + "", error as FirebaseError),
    );
  }
  return data;
}

async function authLoginUser({
  fields,
  callback,
}: {
  fields: RegisterFields;
  callback?: (resp: MainNetworkResponse<AuthUserProps>) => void;
}): Promise<AuthUserProps> {
  let data: AuthUserProps = null;

  try {
    // sign in the user
    const userCred = await signInWithEmailAndPassword(
      firebaseAuth,
      fields.email,
      fields.password,
    );

    // Show a loading state still,
    // because the system need to add yet another data to the `USER DB`
    callback?.(
      netCreateLoadingResponse("Getting your data from our database...", null),
    );

    data = await getUser({
      uid: userCred.user.uid,
      callback: (resp) => {
        // Show success
        if (resp.status === "error") {
          callback?.(
            netCreateErrorResponse<FirebaseError>(
              resp.message,
              resp.data as FirebaseError,
            ),
          );
        }
        // Show error
        else if (resp.status === "success") {
          callback?.(
            netCreateSuccessResponse<UserModel>(
              "Successfully signed in",
              data as UserModel,
            ),
          );
        }
      },
    });
    // await waitFor(1000);
    // Adding the user
  } catch (error) {
    callback?.(
      netCreateErrorResponse<FirebaseError>(error + "", error as FirebaseError),
    );
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

type AddUserCallbackProps = UserModel | null | FirebaseError;
type AddUserProps = UserModel | null;
async function addUser({
  user,
  callback,
}: {
  user: UserModel;
  callback?: (resp: MainNetworkResponse<AddUserCallbackProps>) => void;
}): Promise<AddUserProps> {
  let data: AddUserProps = null;
  try {
    // Create new data with its id
    const newUserRef = doc(userDb, user.email);
    // Adding to the database
    await setDoc(newUserRef, JSON.parse(JSON.stringify(user)));
    data = user;
    // Show success
    callback?.(
      netCreateSuccessResponse<AddUserCallbackProps>(
        "User has been added to the database",
        user,
      ),
    );
  } catch (error) {
    // Show error
    // console.log(error);
    callback?.(
      netCreateErrorResponse<AddUserCallbackProps>(
        error + "",
        error as FirebaseError,
      ),
    );
  }
  return data;
}

type GetUserCallbackProps = UserModel | null | FirebaseError;
type GetUserProps = UserModel | null;
async function getUser({
  uid,
  callback,
}: {
  uid: string;
  callback?: (resp: MainNetworkResponse<GetUserCallbackProps>) => void;
}): Promise<UserModel | null> {
  let data: GetUserProps = null;
  try {
    // Get user from database
    const snapshot = await getDoc(doc(userDb, uid));
    // Check if exists
    const user = snapshot.exists() ? (snapshot.data() as UserModel) : null;

    data = user;
    // Show success
    callback?.(
      netCreateSuccessResponse<GetUserCallbackProps>(
        "User has been added to the database",
        user,
      ),
    );
  } catch (error) {
    // Show error
    // console.log(error);
    callback?.(
      netCreateErrorResponse<GetUserCallbackProps>(
        error + "",
        error as FirebaseError,
      ),
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
