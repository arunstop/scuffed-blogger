import React, { ReactNode } from "react";

interface PostStatusChipMiniProps {
  icon: ReactNode;
  title: string;
  color: string;
}

function PostStatusChipMini({ icon, title, color }: PostStatusChipMiniProps) {
  return (
    <div
      className={`py-1 px-2 sm:px-3 inline-flex gap-1 sm:gap-2 rounded-full ${color} text-white bg-opacity-80`}
      title={title}
    >
      {icon}
    </div>
  );
}

export default PostStatusChipMini;
