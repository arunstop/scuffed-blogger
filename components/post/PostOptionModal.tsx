import React from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import {
  MdFlag,
  MdHideSource,
  MdPersonOff,
  MdReport,
  MdShare
} from "react-icons/md";
import { MainModalProps } from "../../utils/data/Main";
import ActionModalTemplate, {
  ActionModalAction
} from "../main/ActionModalTemplate";

const options: ActionModalAction[] = [
  { icon: <MdHideSource />, label: "Show less like this", action: () => {} },
  { icon: <MdShare />, label: "Share article", action: () => {} },
  { icon: <MdReport />, label: "Report article", action: () => {} },
  { icon: <FaVolumeMute />, label: "Mute author", action: () => {} },
  { icon: <FaVolumeUp />, label: "Unmute author", action: () => {} },
  { icon: <MdFlag />, label: "Report author", action: () => {} },
  { icon: <MdPersonOff />, label: "Block author", action: () => {} },
];

function ArticleCommentOptionModal({ value, onClose }: MainModalProps) {
  return (
    <ActionModalTemplate
      value={value}
      onClose={onClose}
      title="Post options"
      desc="What to do about this post?"
      actions={options}
    >
      
    </ActionModalTemplate>
  );
}

export default React.memo(ArticleCommentOptionModal);
