import React from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { MdDelete, MdFlag, MdPersonOff, MdReport } from "react-icons/md";
import { MainModalProps } from "../../utils/data/Main";
import ActionModalTemplate, {
  ActionModalAction
} from "../main/ActionModalTemplate";

const options: ActionModalAction[] = [
  { icon: <MdReport />, label: "Report comment", action: () => {} },
  { icon: <MdDelete />, label: "Delete comment", action: () => {} },
  { icon: <FaVolumeMute />, label: "Mute user", action: () => {} },
  { icon: <FaVolumeUp />, label: "Unmute user", action: () => {} },
  { icon: <MdPersonOff />, label: "Block user", action: () => {} },
  { icon: <MdFlag />, label: "Report user", action: () => {} },
];

function ArticleCommentOptionModal({ value, onClose }: MainModalProps) {
  return (
    <ActionModalTemplate
      value={value}
      onClose={onClose}
      title="Options"
      actions={options}
    >x</ActionModalTemplate>
  );
}

export default React.memo(ArticleCommentOptionModal);
