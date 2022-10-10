import React from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { MdDelete, MdFlag, MdPersonOff, MdReport } from "react-icons/md";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { useCommentCtx } from "../../../app/contexts/comment/CommentHook";
import { ModalProps } from "../../../base/data/Main";
import ModalActionTemplate, {
  ModalActionAction
} from "../modal/ModalActionTemplate";

function ArticleCommentOptionModal({
  value,
  onClose,
  paramValue,
}: ModalProps & { paramValue: string }) {
  const {
    authStt: { user },
  } = useAuthCtx();
  const {
    state: { comments, replies },
    action,
  } = useCommentCtx();

  const paramArr = paramValue.split(".");
  const isParentComment = paramArr.length === 1;
  const isReply = paramArr.length === 2;
  const getTarget = () => {
    if (isParentComment)
      return comments?.comments.find((e) => e.id === paramArr[0]);
    if (isReply)
      return replies
        ?.find((e) => e.parentCommentId === paramArr[0])
        ?.comments.find((e) => e.id === paramArr[1]);
  };
  const target = getTarget();
  const isCommenter = () => {
    if (!user) return;
    if (!target) return false;
    return target.userId === user.id;
  };

  const options: ModalActionAction[] =  [
      {
        icon: <MdReport />,
        label: "Report comment",
        hidden: !isCommenter(),
        action: () => {},
      },
      {
        icon: <MdDelete />,
        label: "Delete comment",
        hidden: !isCommenter(),
        action: () => {
          // if no user
          if (!user) return;
          // if param has wrong format

          if (!isParentComment && !isReply) return;
          // parent comment
          if (paramArr.length === 1) {
            const invalidLength = paramValue.length !== 38;
            if (invalidLength) return;
            // commit an action based on the type of the comment
            action.deleteComment(paramArr[0]);
            return onClose();
          }
          // reply comment
          const invalidLength = paramValue.length !== 77;
          if (invalidLength) return;
          const parentId = paramArr[0];
          const id = paramArr[1];
          // commit an action based on the type of the comment
          action.deleteReply(parentId, id); //reply
          return onClose();
        },
      },
      {
        icon: <FaVolumeMute />,
        label: "Mute user",
        hidden: !isCommenter(),
        action: () => {},
      },
      {
        icon: <FaVolumeUp />,
        label: "Unmute user",
        hidden: !isCommenter(),
        action: () => {},
      },
      {
        icon: <MdPersonOff />,
        label: "Block user",
        hidden: !isCommenter(),
        action: () => {},
      },
      {
        icon: <MdFlag />,
        label: "Report user",
        hidden: !isCommenter(),
        action: () => {},
      },
    ];
  
  return (
    <ModalActionTemplate
      value={value}
      onClose={onClose}
      title="Options"
      desc="Action cannot be undone, choose wisely"
      actions={options}
    >
      x
    </ModalActionTemplate>
  );
}

export default React.memo(ArticleCommentOptionModal);
