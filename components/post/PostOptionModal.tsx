import React from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import {
  MdFlag,
  MdHideSource,
  MdPersonOff,
  MdReport,
  MdShare
} from "react-icons/md";
import { usePostOptionModalBehaviorHook } from "../../utils/hooks/PostOptionModalBehaviorHook";
import ActionModalTemplate, {
  ActionModalAction
} from "../main/ActionModalTemplate";

const options: ActionModalAction[] = [
  {
    icon: <MdHideSource />,
    label: "Show less like this",
    // confirmation: { title: "Show less like this", desc: "Show less like this" },
    action: () => {},
  },
  {
    icon: <MdShare />,
    label: "Share article",
    confirmation: { title: "Share article", desc: "Share article" },
    action: () => {},
  },
  {
    icon: <MdReport />,
    label: "Report article",
    confirmation: { title: "Report article", desc: "Report article" },
    action: () => {},
  },
  {
    icon: <FaVolumeMute />,
    label: "Mute author",
    confirmation: {
      title: "Mute author",
      desc: "You will not see any of their posts until you un-mute them back, are you sure?",
    },
    action: () => {},
  },
  {
    icon: <FaVolumeUp />,
    label: "Unmute author",
    // confirmation: { title: "Unmute author", desc: "Unmute author" },
    action: () => {},
  },
  {
    icon: <MdFlag />,
    label: "Report author",
    // confirmation: { title: "Report author", desc: "Report author" },
    action: () => {},
  },
  {
    icon: <MdPersonOff />,
    label: "Block author",
    confirmation: {
      title: "Block author",
      desc: "This author will never interact with you again until you unblock them, are you sure?",
    },
    action: () => {},
  },
];

function ArticleCommentOptionModal() {

  const {optionModal,closeOptionModal}= usePostOptionModalBehaviorHook();
  return (
    <ActionModalTemplate
      value={optionModal}
      onClose={closeOptionModal}
      title="Post options"
      desc="What to do about this post?"
      actions={options}
    ></ActionModalTemplate>
  );
}

export default React.memo(ArticleCommentOptionModal);
