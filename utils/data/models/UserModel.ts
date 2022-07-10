import { User } from "firebase/auth";
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
}

export const createUserModel = ({
  email = "e@mail.com",
  name = "Dummy",
  username = "dummy_handle",
  avatar = "",
  status = { active: 1 },
  dateJoined = 0,
  bio = "Short bio",
  desc = "A bit long description",
  list,

  firebaseUser,
}: Partial<UserModel>): UserModel => {
  return {
    name: name,
    email: email,
    username: username,
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
  };
};
