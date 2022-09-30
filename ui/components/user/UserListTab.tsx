import React from "react";
import UserListItem from "./UserListItem";

export const UserListTab = React.memo(function UserLists() {
  return (
    <div className="flex flex-col w-full gap-4 sm:gap-8">
      {[...Array(10)].map((e, idx) => (
        <UserListItem key={idx} id={idx + ""} />
      ))}
    </div>
  );
});
