import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User
} from "firebase/auth";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot
} from "firebase/storage";
import { nanoid } from "nanoid";
import { LoginFields } from "../../../components/auth/AuthLoginForm";
import { AuthRegisterProps } from "../../../components/auth/AuthRegisterForm";
import { WritingPanelFormProps } from "../../data/contexts/WritingPanelTypes";
import {
  MainNetworkResponse,
  netError,
  netLoading,
  netSuccess
} from "../../data/Main";
import { ArticleModel, toArticleModel } from "../../data/models/ArticleModel";
import { createUserModel, UserModel } from "../../data/models/UserModel";
import { firebaseAuth, firebaseClient } from "./FirebaseClient";
import {
  fsArticleAdd,
  fsArticleUpdate,
  fsUserAdd,
  fsUserGetByEmail,
  fsUserUpdate
} from "./FirestoreModules";
import { stFileDelete } from "./StorageModules";

// Auth
type AuthUserProps = UserModel | null | FirebaseError;
// @returns complete user information if successfull
export async function fbUserRegister({
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
    data = await fbUserAdd({
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
            netSuccess<UserModel>("User has been registered to the database", {
              ...(data as UserModel),
            }),
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
      //  combine with data from auth
      firebaseUser: authData as User,
    };
    try {
      fsUserUpdate(data);
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
export async function fbUserLogin({
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
      // alert(userCred.user);
      const userData = await fsUserGetByEmail(userCred.user.email);
      if (userData === null) {
        callback?.(netError("Cannot find the requested user data"));
        return null;
      }
      // user data to save locally from firestore
      // combined with user data from auth
      const updatedUserData = {
        ...userData,
        firebaseUser: userCred.user,
      };
      callback?.(
        netSuccess<UserModel>("Successfully signed in", updatedUserData),
      );
      return updatedUserData;
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

// Adding article, now using direct firebaseClient
interface AddArticleProps {
  data: WritingPanelFormProps;
  callback?: (
    resp: MainNetworkResponse<ArticleModel | null | FirebaseError>,
  ) => void;
}

export async function fbArticleAdd({
  data,
  callback,
}: AddArticleProps): Promise<ArticleModel | null> {
  // TODO: Add article with its thumbnail
  // generate article
  const article = toArticleModel(data);

  // upload the article
  try {
    // add article first
    await fsArticleAdd(article);
    // console.log(article);

    // upload thumbnail if there is one
    const thumbnail = data.thumbnail;
    if (thumbnail) {
      try {
        callback?.(
          netLoading<ArticleModel>("Uploading the thumbnail", article),
        );
        // uploading thumbnail
        const thumbnailUrl = await uploadFile({
          file: thumbnail[0],
          directory: "/thumbnails",
        });

        if (!thumbnailUrl) {
          callback?.(netError("Couldn't get the uploaded image's url"));
          return null;
        }

        // create new article with newly added thumbnail url
        const articleWithThumbnail = { ...article, thumbnail: thumbnailUrl };

        // update the said article in database
        try {
          await fsArticleUpdate(articleWithThumbnail, ["thumbnail"]);
          callback?.(
            netSuccess<ArticleModel>(
              "Success creating article",
              articleWithThumbnail,
            ),
          );
          return articleWithThumbnail;
        } catch (error) {
          callback?.(
            netError(
              "Error when applying thumbnail to database",
              error as FirebaseError,
            ),
          );
          return null;
        }
      } catch (error) {
        callback?.(
          netError("Error when creating thumbnail", error as FirebaseError),
        );
        return null;
      }
    }

    // if no thumbnail, then just return the default generated article
    callback?.(netSuccess<ArticleModel>("Success creating article", article));
    return article;
  } catch (error) {
    callback?.(netError("Error when creating article", error as FirebaseError));
    return null;
  }
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
export async function fbUserAdd({
  user,
  callback,
}: {
  user: UserModel;
  callback?: (resp: MainNetworkResponse<AddUserCallbackProps>) => void;
}): Promise<AddUserProps> {
  let data: AddUserProps = null;
  try {
    await fsUserAdd(user);
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

type UploadFileProps = null | string | FirebaseError | UploadTaskSnapshot;
// Upload file
// @Returns the download url
export async function uploadFile({
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
  const imageRef = ref(firebaseClient.storage, `${directory}/${newName}`);
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
export async function fbUpdateUser({
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
        callback?.(netError("Couldn't get the uploaded image's url"));
        return null;
      }

      // Delete user's previous avatar if there was one
      // and if the previous one was NOT the default one
      if (user.avatar && !user.avatar.includes("default_avatar.png")) {
        try {
          await stFileDelete(user?.avatar);
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

      // if successful, inject the new image url to the user's data
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
    await fsUserUpdate(updatedUserData);
    callback?.(
      netSuccess<UserModel>("Success updating profile", updatedUserData),
    );
    return updatedUserData;
  } catch (error) {
    callback?.(netError("Error when updating profile", error as FirebaseError));
    return null;
  }
}
