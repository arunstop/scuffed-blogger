import React from "react";
import UserList from "./UserList";

export const UserLists = React.memo(function UserLists() {
  return (
    <div className="flex flex-col w-full gap-4 sm:gap-8">
      {[...Array(10)].map((e, idx) => (
        <UserList key={idx} id={idx + ""} />
      ))}
    </div>
  );
});
