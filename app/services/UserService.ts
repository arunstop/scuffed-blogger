import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { nanoid } from "nanoid";
import { axiosClient } from "../../base/clients/AxiosClient";
import { firebaseAuth } from "../../base/clients/FirebaseClient";
import {
  MainNetworkResponse,
  netError,
  netSuccess,
  netLoading,
  MainApiResponse,
} from "../../base/data/Main";
import { UserDisplayModel } from "../../base/data/models/UserDisplayModel";
import { UserModel, createUserModel } from "../../base/data/models/UserModel";
import {
  repoFsUserUpdate,
  repoFsUserGetByEmail,
  repoFsUserAdd,
  repoFsUserGetById,
} from "../../base/repos/firestoreDb/FirestoreUserRepo";
import {
  repoRtUserDisplayAdd,
  repoRtUserDisplayUpdate,
  repoRtUserDisplayGetById,
  repoRtUserSessionAdd,
  repoRtUserSessionLatestSet,
} from "../../base/repos/realtimeDb/RealtimeUserRepo";
import { repoStFileDeleteByFullLink } from "../../base/repos/StorageModules";
import { imageToPng } from "../helpers/MainHelpers";

import { serviceFileUpload } from "./FileService";
export interface LoginFields {
  email: string;
  password: string;
}
export interface AuthRegisterProps {
  email: string;
  password: string;
  name: string;
}

// Auth
type AuthUserProps = UserModel | null | FirebaseError;
// @returns complete user information if successfull
export async function fbUserAuthRegister({
  data,
  callback,
}: MainApiResponse<
  { fields: AuthRegisterProps },
  AuthUserProps
>): Promise<AuthUserProps> {
  const { fields } = data;
  let res: AuthUserProps = null;

  // create new user on firestoer
  // register on auth
  // edit the firestore data

  // 1. Create new user in firestore to check if that user already exists
  try {
    res = await fbUserAdd({
      data: {
        user: createUserModel({
          ...fields,
          id: nanoid(24),
        }),
      },
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
              ...(res as UserModel),
            }),
          );
        }
      },
    });
    // if somehow data is null then throw an error
    if (res === null)
      throw new FirebaseError("client-error", "Error when adding data.");
  } catch (error) {
    console.log(error);
    callback?.(netError<FirebaseError>(error + "", error as FirebaseError));
    return null;
  }

  // 2. Register to the authentication system
  let authData: User | null = null;
  try {
    callback?.(netLoading("Getting your data from our database...", null));

    const userCred = await createUserWithEmailAndPassword(
      firebaseAuth,
      fields.email,
      fields.password,
    );
    authData = userCred.user;
    if (authData === null)
      throw new FirebaseError("client-error", "Error when authenticating user");
    res = {
      ...(res as UserModel),
      localAuthData: authData,
    };
  } catch (error) {
    console.log(error);
    callback?.(netError<FirebaseError>(error + "", error as FirebaseError));
    return null;
  }

  try {
    // remove firebaseUser before updating document
    // because firebaseUser meant to be used for local machine
    await repoFsUserUpdate({
      ...res,
      localAuthData: undefined,
      session: undefined,
    });
    // user data with new session intact
    res = await repoRtUserSessionAdd(res);
  } catch (error) {
    console.log(error);
    callback?.(netError<FirebaseError>(error + "", error as FirebaseError));
    return null;
  }
  callback?.(
    netSuccess<UserModel>("User has been registered to the database", {
      ...(res as UserModel),
    }),
  );
  return res;
}

// @returns complete user information if successfull
export async function fbUserAuthLogin({
  data,
  callback,
}: MainApiResponse<
  { fields: LoginFields },
  AuthUserProps
>): Promise<AuthUserProps> {
  const { fields } = data;
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
    try {
      // get the user data
      const userData = await repoFsUserGetByEmail(userCred.user.email);
      if (userData === null) {
        callback?.(netError("Cannot find the requested user data"));
        return null;
      }
      // user data to save locally from firestore
      // combined with user data from auth
      const userDataWithAuth: UserModel = {
        ...userData,
        localAuthData: userCred.user,
      };

      // add session data to realtime database
      // and return user data with session
      const userDataWithSession = await repoRtUserSessionAdd(userDataWithAuth);

      console.log(userDataWithSession);
      callback?.(
        netSuccess<UserModel>("Successfully signed in", userDataWithSession),
      );
      return userDataWithSession;
    } catch (error) {
      console.log(error);
      callback?.(
        netError<FirebaseError>("Error when loggin in", error as FirebaseError),
      );
      return null;
    }
  } catch (error) {
    console.log(error);
    callback?.(
      netError<FirebaseError>("Error when loggin in", error as FirebaseError),
    );
    return null;
  }
}

type AddUserCallbackProps = UserModel | null | FirebaseError;
type AddUserProps = UserModel | null;
// @return UserModel if exists
export async function fbUserAdd({
  data,
  callback,
}: MainApiResponse<
  { user: UserModel },
  AddUserCallbackProps
>): Promise<AddUserProps> {
  const { user } = data;
  let res: AddUserProps = null;
  try {
    await repoFsUserAdd(user);
    res = user;
    await repoRtUserDisplayAdd({
      id: res.id,
      name: res.name,
      avatar: res.avatar,
      username: res.username,
      desc: res.desc,
    });
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
  return res;
}

type UpdateProfileProps = null | FirebaseError | UserModel;
export async function fbUserUpdate({
  data,
  callback,
}: MainApiResponse<
  { file?: FileList; user: UserModel },
  UpdateProfileProps
>): Promise<UpdateProfileProps> {
  const { user, file } = data;
  let updatedUserData = {
    ...user,
    username: user.username,
    bio: user.bio,
    desc: user.desc,
    dateUpdated: Date.now(),
  };
  // Upload image if there is one
  const convertedImg = file ? await imageToPng(file[0]) : null;
  if (convertedImg) {
    try {
      const imageUrl = await serviceFileUpload({
        data: {
          file: convertedImg,
          directory: "images/avatars",
          name: user.id,
        },
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
          await repoStFileDeleteByFullLink(user?.avatar);
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
    await repoFsUserUpdate(updatedUserData);
    // change the latest session to match the latest dateUpdated
    await repoRtUserSessionLatestSet(updatedUserData);
    // update user display
    await repoRtUserDisplayUpdate({
      id: updatedUserData.id,
      name: updatedUserData.name,
      avatar: updatedUserData.avatar,
      username: updatedUserData.username,
      desc: updatedUserData.desc,
    });
    callback?.(
      netSuccess<UserModel>("Success updating profile", updatedUserData),
    );
    return updatedUserData;
  } catch (error) {
    callback?.(netError("Error when updating profile", error as FirebaseError));
    return null;
  }
}

type GetUserCallbackProps = UserModel | null | FirebaseError;
type GetUserProps = UserModel | null;
// @return UserModel if exists
export async function fbUserGet({
  data,
  callback,
}: MainApiResponse<
  { email: string },
  GetUserCallbackProps
>): Promise<UserModel | null> {
  const { email } = data;
  try {
    // Get user from database
    const user = await repoFsUserGetByEmail(email);

    // Show success
    callback?.(
      netSuccess<GetUserCallbackProps>(
        "User has been added to the database",
        user,
      ),
    );
    return user;
  } catch (error) {
    // Show error
    console.log(error);
    callback?.(
      netError<GetUserCallbackProps>(
        "Error when getting user data",
        error as FirebaseError,
      ),
    );
    return null;
  }
}

export async function fbUserDisplayGet({
  data,
  callback,
}: MainApiResponse<
  { userId: string },
  UserDisplayModel | null | FirebaseError
>): Promise<UserDisplayModel | null> {
  try {
    const res = await repoRtUserDisplayGetById(data.userId);
    callback?.(netSuccess("Success getting user display data", res));
    return res;
  } catch (error) {
    callback?.(
      netError("Error when getting user display data.", error as FirebaseError),
    );
    return null;
  }
}

export async function serviceUserDisplayGetById({
  data,
  callback,
}: MainApiResponse<
  { userId: string },
  UserDisplayModel | null
>): Promise<UserDisplayModel | null> {
  try {
    const response = await axiosClient.get(`/api/user/${data.userId}`);
    const result =
      response.data as MainNetworkResponse<UserDisplayModel | null>;
    callback?.(result);
    return result.data;
  } catch (e) {
    callback?.(netError(`Error : failed fetching UserDisplay saying:\\n${e}`));
    console.log(`Error : failed fetching UserDisplay saying:\\n${e}`);
    return null;
  }
}

export async function serviceUserGetById({
  data,
  callback,
}: MainApiResponse<
  { userId: string },
  UserModel | FirebaseError | null
>): Promise<UserModel | null> {
  try {
    const res = await repoFsUserGetById(data.userId);
    callback?.(netSuccess("Success getting user data", res));
    return res;
  } catch (e) {
    callback?.(netError("Error getting user", e as FirebaseError));
    return null;
  }
}
