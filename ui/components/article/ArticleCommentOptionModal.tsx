import React from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { MdDelete, MdFlag, MdPersonOff, MdReport } from "react-icons/md";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { useCommentCtx } from "../../../app/contexts/comment/CommentHook";
import { ModalProps } from "../../../base/data/Main";
import ModalActionTemplate, {
  ModalActionAction,
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
  const options: ModalActionAction[] = [
    {
      icon: <MdReport />,
      label: "Report comment",
      hidden: false,
      action: () => {},
    },
    {
      icon: <MdDelete />,
      label: "Delete comment",
      hidden: false,
      action: () => {
        // if no user
        if (!user) return;
        // if param has wrong format
        const paramArr = paramValue.split(".");
        if (paramArr.length === 0 && paramArr.length > 2) return;
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
      hidden: false,
      action: () => {},
    },
    {
      icon: <FaVolumeUp />,
      label: "Unmute user",
      hidden: false,
      action: () => {},
    },
    {
      icon: <MdPersonOff />,
      label: "Block user",
      hidden: false,
      action: () => {},
    },
    {
      icon: <MdFlag />,
      label: "Report user",
      hidden: false,
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
