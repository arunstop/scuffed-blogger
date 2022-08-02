import { User } from "firebase/auth";
import { nanoid } from "nanoid";

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
  list?: {
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
  dateUpdated:number;
  //   short description
  bio?: string;
  //   description
  desc?: string;
  // FOR LOCAL USE ONLY
  localAuthData?: User;
  session?:UserSession;
  // 0 - not yet set up
  // 1 - not yet choosen topic
  // 2 - not yet banner update
  profileCompletion: "REQ_SETUP"| "REQ_CHOOSE_TOPIC" | "REQ_BANNER" |"COMPLETE";
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
}: Partial<UserModel>&{id:string}): UserModel => {
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
