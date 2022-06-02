import React from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import {
  MdDelete, MdFlag, MdPersonOff, MdReport
} from "react-icons/md";
import { MainModalProps } from "../../utils/data/main";
import ModalTemplate from "../main/ModalTemplate";
import ArticleCommentOptionItem, {
  OptionItem
} from "./ArticleCommentOptionItem";


const options: OptionItem[] = [
  { icon: <MdReport />, label: "Report comment", action: () => {} },
  { icon: <MdDelete />, label: "Delete comment", action: () => {} },
  { icon: <FaVolumeMute />, label: "Mute user", action: () => {} },
  { icon: <FaVolumeUp />, label: "Unmute user", action: () => {} },
  { icon: <MdPersonOff />, label: "Block user", action: () => {} },
  { icon: <MdFlag />, label: "Report user", action: () => {} },
];

function ArticleCommentOptionModal({
  value,
  onClose,
}: MainModalProps) {
  return (
    <ModalTemplate value={value} onClose={onClose} title="Options">
      <ul className="menu p-2 rounded-xl">
        {options.map((e, idx) => (
          <ArticleCommentOptionItem key={idx} {...e} />
        ))}
        <ArticleCommentOptionItem
          label={"Cancel"}
          action={onClose}
        />
      </ul>
    </ModalTemplate>
  );
}

export default React.memo(ArticleCommentOptionModal);
