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
      className={`btn btn-ghost rounded-xl p-1 sm:p-2 opacity-75 hover:opacity-100
        !flex !flex-nowrap max-w-none gap-1 sm:gap-2 !h-auto aspect-square sm:aspect-auto
        !font-black
        group ${className || ""}`}
      title="Upvote"
      onClick={() => action()}
    >
      {icon && <span className="text-xl sm:text-2xl">{icon}</span>}
      {label && (
        <span className={minimize ? "hidden sm:block" : "!text-sm sm:!text-md"}>
          {label}
        </span>
      )}
    </span>
  );
};
export default ArticleCommentItemActionButton;
