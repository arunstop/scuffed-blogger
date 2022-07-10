import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User
} from "firebase/auth";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc
} from "firebase/firestore/lite";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot
} from "firebase/storage";
import { nanoid } from "nanoid";
import { LoginFields } from "../../../components/auth/AuthLoginForm";
import {
  MainNetworkResponse,
  netError, netLoading, netSuccess
} from "../../data/Main";
import { ArticleModel } from "../../data/models/ArticleModel";
import { createUserModel, UserModel } from "../../data/models/UserModel";
import { AuthRegisterProps } from "./../../../components/auth/AuthRegisterForm";
import { firebaseAuth, firebaseClient } from "./FirebaseClient";

const articleDb = firebaseClient.db.article;
const userDb = firebaseClient.db.user;

// Auth
type AuthUserProps = UserModel | null | FirebaseError;
// @returns complete user information if successfull
async function authRegisterUser({
  fields,
  callback,
}: {
  fields: AuthRegisterProps;
  callback?: (resp: MainNetworkResponse<AuthUserProps>) => void;
}): Promise<AuthUserProps> {
  let data: AuthUserProps = null;

  try {
    // Show a loading state still,
    // because the system need to add yet another data to the `USER DB`

    // Adding the user
    data = await createUser({
      user: createUserModel({
        ...fields,
      }),
      callback: (resp) => {
        // Show success
        if (resp.status === "error") {
          callback?.(
            netError<FirebaseError>(resp.message, resp.data as FirebaseError),
          );
        }
        // Show error
        else if (resp.status === "success") {
          callback?.(
            netSuccess<UserModel>(
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

    callback?.(netLoading("Getting your data from our database...", null));

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
      callback?.(netError<FirebaseError>(error + "", error as FirebaseError));
    }

    if (authData === null) return null;

    // Edit user in the database
    data = {
      ...(data as UserModel),
      firebaseUser: authData as User,
    };
    try {
      updateUser(data);
    } catch (error) {
      data = null;
      callback?.(netError<FirebaseError>(error + "", error as FirebaseError));
    }
  } catch (error) {
    callback?.(netError<FirebaseError>(error + "", error as FirebaseError));
  }
  return data;
}

// @returns complete user information if successfull
async function authLoginUser({
  fields,
  callback,
}: {
  fields: LoginFields;
  callback?: (resp: MainNetworkResponse<AuthUserProps>) => void;
}): Promise<AuthUserProps> {
  try {
    // sign in the user
    const userCred = await signInWithEmailAndPassword(
      firebaseAuth,
      fields.email,
      fields.password,
    );
    // if success then get the user data
    if (!userCred.user.email) {
      callback?.(netError("Error when loggin in"));
      return null;
    }
    // get the user data
    try {
      const userData = await getUser(userCred.user.email);
      if (userData === null) {
        callback?.(netError("Cannot find the requested user data"));
        return null;
      }
      callback?.(netSuccess<UserModel>("Successfully signed in", userData));
      return userData;
    } catch (error) {
      callback?.(
        netError<FirebaseError>("Error when loggin in", error as FirebaseError),
      );
      return null;
    }
  } catch (error) {
    callback?.(
      netError<FirebaseError>("Error when loggin in", error as FirebaseError),
    );
    return null;
  }
}

// @return all articles
async function getArticleAll(): Promise<ArticleModel[] | null> {
  const snapshot = await getDocs(articleDb);
  // console.log(snapshot);
  const list = snapshot.docs.map((doc) => doc.data() as ArticleModel);
  return list;
}

// @return an article based on `id`
async function getArticleById(id: string): Promise<ArticleModel | null> {
  // Get the requested document
  const snapshot = await getDoc(doc(articleDb, id));
  // Check if it exists
  const article = snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as ArticleModel)
    : null;

  return article;
}

// Adds an article to database
async function addArticle(article: ArticleModel) {
  // Create new document reference
  const newDocRef = doc(articleDb, article.id);
  // Add the data
  await setDoc(newDocRef, article);
}

type GetUserCallbackProps = UserModel | null | FirebaseError;
type GetUserProps = UserModel | null;
// @return UserModel if exists
// async function getUser({
//   email,
//   callback,
// }: {
//   email: string;
//   callback?: (resp: MainNetworkResponse<GetUserCallbackProps>) => void;
// }): Promise<UserModel | null> {
//   let data: GetUserProps = null;
//   try {
//     // Get user from database
//     const snapshot = await getDoc(doc(userDb, email));
//     // Check if exists
//     const user = snapshot.exists() ? (snapshot.data() as UserModel) : null;

//     data = user;
//     // Show success
//     callback?.(
//       netSuccess<GetUserCallbackProps>(
//         "User has been added to the database",
//         user,
//       ),
//     );
//   } catch (error) {
//     // Show error
//     // console.log(error);
//     callback?.(
//       netError<GetUserCallbackProps>(
//         "Error when getting user data",
//         error as FirebaseError,
//       ),
//     );
//   }
//   return data;
// }

async function getUser(email: string): Promise<UserModel | null> {
  // Get user from database
  const snapshot = await getDoc(doc(userDb, email));
  // Check if exists
  return snapshot.exists() ? (snapshot.data() as UserModel) : null;
}

type AddUserCallbackProps = UserModel | null | FirebaseError;
type AddUserProps = UserModel | null;
// @return UserModel if exists
async function createUser({
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
      netSuccess<AddUserCallbackProps>(
        "User has been added to the database",
        user,
      ),
    );
  } catch (error) {
    // Show error
    // console.log(error);
    callback?.(
      netError<AddUserCallbackProps>(error + "", error as FirebaseError),
    );
  }
  return data;
}

// Updates user's data
async function updateUser(user: UserModel) {
  // Updating user in the database
  const editUserRef = doc(userDb, user.email || "");
  await updateDoc(editUserRef, JSON.parse(JSON.stringify(user)));
}

type UploadFileProps = null | string | FirebaseError | UploadTaskSnapshot;
// Upload file
async function uploadImage({
  file,
  callback,
}: {
  file: File;
  callback?: (resp: MainNetworkResponse<UploadFileProps>) => void;
}): Promise<string> {
  let data = "";
  // const file = fields.avatar[0];
  // Splitting the name by with .  then get the last item
  // which results the extension of the file
  const extension = file.name.split(".").pop();
  // Getting new name with id
  const newName = `${nanoid(24)}.${extension}`;
  const imageRef = ref(firebaseClient.storage, `images/${newName}`);
  // Uploading the file
  const uploadTask = uploadBytesResumable(imageRef, file);
  uploadTask.on(
    "state_changed",
    // handle progress change
    (snapshot) => {
      callback?.(
        netLoading<UploadTaskSnapshot>("Uploading your avatar...", snapshot),
      );
      // console.log(snapshot);
    },
    // handle failed upload
    (error) => {
      callback?.(
        netError("Error when uploading the image", error as FirebaseError),
      );
      // console.log(error);
    },
    // handle success
    async () => {
      // data = await getDownloadURL(uploadTask.snapshot.ref);
      callback?.(netSuccess<string>("", data));
      // console.log(data);
    },
  );
  await uploadTask.then(async (e) => {
    data = await getDownloadURL(uploadTask.snapshot.ref);
  });

  return data;
}

type UpdateProfileProps = null | FirebaseError | UserModel;
async function updateProfile({
  file,
  user,
  callback,
}: {
  file?: FileList;
  user: UserModel;
  callback?: (resp: MainNetworkResponse<UpdateProfileProps>) => void;
}): Promise<UpdateProfileProps> {
  let updatedUserData = {
    ...user,
    username: user.username,
    bio: user.bio,
    desc: user.desc,
  };
  // Upload image if there is one
  if (file) {
    try {
      const imageUrl = await uploadImage({ file: file[0] });
      console.log("imageUrl : " + imageUrl);
      if (imageUrl) updatedUserData = { ...updatedUserData, avatar: imageUrl };
    } catch (error) {
      callback?.(
        netError("Error when updating profile", error as FirebaseError),
      );
      return null;
    }
  }

  // Update overall User Data
  try {
    await updateUser(updatedUserData);
    callback?.(
      netSuccess<UserModel>("Success updating profile", updatedUserData),
    );
    return updatedUserData;
  } catch (error) {
    callback?.(netError("Error when updating profile", error as FirebaseError));
    return null;
  }
}

export const firebaseApi = {
  getArticleAll,
  getArticleById,
  addArticle,
  addUser: createUser,
  authRegisterUser,
  authLoginUser,
  uploadImage,
  updateProfile,
};
