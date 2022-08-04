import { User } from "firebase/auth";
import { nanoid } from "nanoid";
import { isFalsy } from "../Main";

export interface UserSession {
  id: string;
  userId: string;
  os: string;
  browser: string;
  time: number;
  userLastUpdated: number;
}

export interface UserModel {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
  list: {
    followings: string[];
    posts: string[];
    bookmarks: string[];
    readLaters: string[];
    lists: string[];
    socials: string[];
    communities: string[];
    blockedUsers: string[];
    mutedUsers: string[];
    topics: string[];
  };
  status: {
    active: number;
  };
  dateCreated: number;
  dateUpdated: number;
  //   short description
  bio?: string;
  //   description
  desc?: string;
  // FOR LOCAL USE ONLY
  localAuthData?: User;
  session?: UserSession;
  // 0 - not yet set up
  // 1 - not yet choosen topic
  // 2 - not yet banner update
  profileCompletion:
    | "REQ_SETUP"
    | "REQ_CHOOSE_TOPIC"
    | "REQ_BANNER"
    | "COMPLETE";
}

export const createUserModel = ({
  id,
  email = "e@mail.com",
  name = "Dummy",
  username,
  avatar = "https://firebasestorage.googleapis.com/v0/b/tuturku-3e16b.appspot.com/o/images%2Fdefaults%2Fdefault_avatar.png?alt=media&token=161ddc35-cf8b-4b10-b64c-517b3e0cf603",
  status = { active: 1 },
  dateCreated = 0,
  dateUpdated = 0,
  bio = "Short bio",
  desc = "A bit long description",
  list,
  profileCompletion = "REQ_SETUP",
  localAuthData,
}: Partial<UserModel> & { id: string }): UserModel => {
  return {
    id: id,
    name: name,
    email: email,
    username: username || nanoid(12),
    avatar: avatar,
    list: {
      followings: list?.followings || [],
      posts: list?.posts || [],
      bookmarks: list?.bookmarks || [],
      readLaters: list?.readLaters || [],
      lists: list?.lists || [],
      socials: list?.socials || [],
      communities: list?.communities || [],
      blockedUsers: list?.blockedUsers || [],
      mutedUsers: list?.mutedUsers || [],
      topics: list?.topics || [],
    },
    status: {
      active: status.active,
    },
    dateCreated: dateCreated || Date.now(),
    dateUpdated: dateCreated || Date.now(),
    bio: bio || "",
    desc: desc || "",
    localAuthData: localAuthData,
    profileCompletion: profileCompletion,
  };
};

export function isUserModel(value: unknown) {
  // check if it is object
  if (typeof value !== "object") return false;
  // console.log("object check passed");

  // check falsy
  if (isFalsy(value)) return false;
  // console.log("not falsy");

  // check if all required properties are satisfied
  const requiredPropsValid =
    "id" in value &&
    "email" in value &&
    "name" in value &&
    "username" in value &&
    "avatar" in value &&
    "list" in value &&
    "status" in value &&
    "dateCreated" in value &&
    "dateUpdated" in value &&
    "profileCompletion" in value;
  // console.log("requiredPropsValid", requiredPropsValid);

  // list all properties
  const props = [
    "id",
    "email",
    "name",
    "username",
    "avatar",
    "list",
    "status",
    "dateCreated",
    "dateUpdated",
    "bio",
    "desc",
    "localAuthData",
    "session",
    "profileCompletion",
  ];
  // check if `value` has props that is not in the required on the props
  // a.k.a find the difference of those 2
  // Using lodash causing `edge function` error on vercel depoyment

  // const unrequiredPropsValid =
  //   _.difference(Object.keys(value), props).length === 0;
  const unrequiredPropsValid =
    Object.keys(value).filter((e) => !e.includes(e)).length === 0;
  // console.log("unrequiredPropsValid", unrequiredPropsValid);

  // if all required props are satisfied
  // and no other unrequired value, returns true
  return requiredPropsValid === true && unrequiredPropsValid === true;
}
