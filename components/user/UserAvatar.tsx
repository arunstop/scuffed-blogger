import React from "react";

function UserAvatar({ id }: { id: string }) {
  return (
    <div className="avatar">
      <div
        className="z-0 w-10 group-hover:rounded-xl border-[1px] bg-primary
        border-base-content transition-all rounded-[50%] sm:w-12 sm:border-2"
      >
        <img
          src={`https://api.lorem.space/image/face?hash=${id}`}
          alt={`User ${id}`}
        />
      </div>
    </div>
  );
}

export default UserAvatar;
