import { CommentActionProps } from "./ArticleCommentItem";

const ArticleCommentItemActionButton = ({
  label,
  icon,
  className,
  minimize = true,
  action = () => {},
}: CommentActionProps) => {
  return (
    <span
      className={`btn btn-ghost rounded-xl p-px sm:p-1 opacity-75 hover:opacity-100
        !flex !flex-nowrap max-w-none gap-1 sm:gap-2 !h-auto aspect-square sm:aspect-auto
        !font-black btn-sm sm:btn-md
        group ${className || ""}`}
      title="Upvote"
      onClick={() => action()}
    >
      {icon && <span className="text-lg sm:text-xl">{icon}</span>}
      {label && (
        <span className={minimize ? "hidden sm:block" : "!text-xs sm:!text-sm"}>
          {label}
        </span>
      )}
    </span>
  );
};
export default ArticleCommentItemActionButton;
