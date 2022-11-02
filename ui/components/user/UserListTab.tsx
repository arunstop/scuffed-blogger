import React from "react";
import { UserModel } from "../../../base/data/models/UserModel";
import UserListItem from "./UserListItem";

export const UserListTab = React.memo(function UserLists({ userProfile }: { userProfile?:UserModel }) {
  return (
    <div className="flex flex-col w-full gap-4 sm:gap-8">
      {[...Array(10)].map((e, idx) => (
        <UserListItem key={idx} id={idx + ""} />
      ))}
    </div>
  );
});
