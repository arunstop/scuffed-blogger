import React from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { MdDelete, MdFlag, MdPersonOff, MdReport } from "react-icons/md";
import { ModalProps } from "../../../base/data/Main";
import ModalActionTemplate, {
  ModalActionAction
} from "../modal/ModalActionTemplate";

const options: ModalActionAction[] = [
  { icon: <MdReport />, label: "Report comment", action: () => {} },
  { icon: <MdDelete />, label: "Delete comment", action: () => {} },
  { icon: <FaVolumeMute />, label: "Mute user", action: () => {} },
  { icon: <FaVolumeUp />, label: "Unmute user", action: () => {} },
  { icon: <MdPersonOff />, label: "Block user", action: () => {} },
  { icon: <MdFlag />, label: "Report user", action: () => {} },
];

function ArticleCommentOptionModal({ value, onClose }: ModalProps) {
  return (
    <ModalActionTemplate
      value={value}
      onClose={onClose}
      title="Options"
      desc="Action cannot be undone, choose wisely"
      actions={options}
    >x</ModalActionTemplate>
  );
}

export default React.memo(ArticleCommentOptionModal);
