import React, { ReactNode } from "react";

export interface OptionItem {
  icon?: ReactNode;
  label: string;
  action: () => void;
}

function ArticleCommentOptionItem({ icon, label, action }: OptionItem) {
  return (
    <li>
      <a className="justify-center btn --btn-resp btn-ghost py-0" tabIndex={0} onClick={action} role="button">
        {icon && <span className="text-2xl">{icon}</span>}
        <span className="">{label}</span>
      </a>
    </li>
  );
}

export default ArticleCommentOptionItem;
