import { User } from "firebase/auth";
import { nanoid } from "nanoid";
export interface UserModel {
  email: string;
  name: string;
  username: string;
  avatar?: string;
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
  dateJoined: number;
  //   short description
  bio?: string;
  //   description
  desc?: string;
  //   firebase user
  firebaseUser?: User;
  // 0 - not yet set up
  // 1 - not yet choosen topic
  // 2 - not yet banner update
  profileCompletion: "REQ_SETUP"| "REQ_CHOOSE_TOPIC" | "REQ_BANNER" |"COMPLETE";
}

export const createUserModel = ({
  email = "e@mail.com",
  name = "Dummy",
  username,
  avatar = "https://firebasestorage.googleapis.com/v0/b/tuturku-3e16b.appspot.com/o/images%2Fdefaults%2Fdefault_avatar.png?alt=media&token=161ddc35-cf8b-4b10-b64c-517b3e0cf603",
  status = { active: 1 },
  dateJoined = 0,
  bio = "Short bio",
  desc = "A bit long description",
  list,
  profileCompletion = "REQ_SETUP",
  firebaseUser,
}: Partial<UserModel>): UserModel => {
  return {
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
    dateJoined: dateJoined || Date.now(),
    bio: bio || "",
    desc: desc || "",
    firebaseUser,
    profileCompletion: profileCompletion,
  };
};
