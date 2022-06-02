import React, { ReactNode } from "react";

export interface OptionItem {
  icon?: ReactNode;
  label: string;
  action: () => void;
}

function ArticleCommentOptionItem({
  icon,
  label,
  action,
}: OptionItem) {
  return (
    <li>
      <button className="justify-center" tabIndex={0} onClick={action}>
        {icon && <span className="text-xl sm:text-2xl">{icon}</span>}
        <span className="text-base font-bold sm:text-lg">{label}</span>
      </button>
    </li>
  );
}

export default ArticleCommentOptionItem;
