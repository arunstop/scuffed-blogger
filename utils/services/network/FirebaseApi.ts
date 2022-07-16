import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User
} from "firebase/auth";
import {
  doc, setDoc
} from "firebase/firestore/lite";
import {
  deleteObject, getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot
} from "firebase/storage";
import { nanoid } from "nanoid";
import { LoginFields } from "../../../components/auth/AuthLoginForm";
import { AuthRegisterProps } from "../../../components/auth/AuthRegisterForm";
import {
  MainNetworkResponse,
  netError,
  netLoading,
  netSuccess
} from "../../data/Main";
import { ArticleModel } from "../../data/models/ArticleModel";
import { createUserModel, UserModel } from "../../data/models/UserModel";
import { getStorageDirectory } from "../../helpers/MainHelpers";
import { firebaseAuth, firebaseClient } from "./FirebaseClient";
import { fsGetArticleAll, fsGetArticleById, fsGetUser, fsUpdateUser } from "./FirestoreApi";

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
      fsUpdateUser(data);
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
      const userData = await fsGetUser(userCred.user.email);
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



async function deleteFile(link: string) {
  const linkDirectory = getStorageDirectory(link);
  if (!linkDirectory) return;
  const deleteFileRef = ref(firebaseClient.storage, linkDirectory);
  await deleteObject(deleteFileRef);
}

type UploadFileProps = null | string | FirebaseError | UploadTaskSnapshot;
// Upload file
async function uploadFile({
  file,
  directory,
  callback,
}: {
  file: File;
  directory: string;
  callback?: (resp: MainNetworkResponse<UploadFileProps>) => void;
}): Promise<string> {
  let data = "";
  // const file = fields.avatar[0];
  // Splitting the name by with .  then get the last item
  // which results the extension of the file
  const extension = file.name.split(".").pop();
  // Getting new name with id
  const newName = `${nanoid(24)}.${extension}`;
  const imageRef = ref(
    firebaseClient.storage,
    `${directory}/${newName}`,
  );
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
      const imageUrl = await uploadFile({
        file: file[0],
        directory: "images/avatars",
      });
      // console.log("imageUrl : " + imageUrl);
      if (!imageUrl) {
        callback?.(
          netError(
            "Couldn't get the uploaded image's url"
          ),
        );
        return null;
      }

      // Delete user's previous avatar if there was one
      // and if the previous one was NOT the default one
      if (user.avatar && !user.avatar.includes("default_avatar.png")) {
        try {
          await deleteFile(user?.avatar);
        } catch (error) {
          callback?.(
            netError(
              "Error when deleting previous avatar",
              error as FirebaseError,
            ),
          );
          return null;
        }
      }

      // if successfull, inject the newn image url to the user's data
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
    await fsUpdateUser(updatedUserData);
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
  getArticleAll: fsGetArticleAll,
  getArticleById: fsGetArticleById,
  addArticle,
  addUser: createUser,
  authRegisterUser,
  authLoginUser,
  uploadImage: uploadFile,
  updateProfile,
};
