import { UserModel } from "./UserModel";
export interface UserDisplayModel {
  id: string;
  name: string;
  avatar: string;
  username: string;
  desc?: string;
}

export function toUserDisplay(user: UserModel): UserDisplayModel {
  const res: UserDisplayModel = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    username: user.username,
    desc: user.desc,
  };
  return res;
}
