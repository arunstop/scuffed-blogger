import React, { ReactNode } from "react";

export interface OptionItem {
  icon?: ReactNode;
  label: string;
  action: () => void;
}

function ArticleCommentOptionItem({ icon, label, action }: OptionItem) {
  return (
    <li>
      <a className="justify-center" tabIndex={0} onClick={action} role="button">
        {icon && <span className="text-xl sm:text-2xl">{icon}</span>}
        <span className="text-base font-bold sm:text-lg">{label}</span>
      </a>
    </li>
  );
}

export default ArticleCommentOptionItem;
