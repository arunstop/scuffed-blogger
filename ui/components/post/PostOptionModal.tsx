import React, { useMemo } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import {
  MdFlag,
  MdHideSource,
  MdPersonOff,
  MdReport,
  MdShare
} from "react-icons/md";
import { useUiCtx } from "../../../app/contexts/ui/UiHook";
import { usePostOptionModalBehaviorHook } from "../../../app/hooks/PostOptionModalBehaviorHook";
import ModalActionTemplate, {
  ModalActionAction
} from "../modal/ModalActionTemplate";

function ArticleCommentOptionModal() {
  const { uiAct } = useUiCtx();
  const options: ModalActionAction[] = useMemo(
    (): ModalActionAction[] => [
      {
        icon: <MdHideSource />,
        label: "Show less like this",
        // confirmation: { title: "Show less like this", desc: "Show less like this" },
        action: () => {
          uiAct.addToast({
            label: `success doing Show less like this`,
            // action:()=>{},
            type: "success",
          });
        },
      },
      {
        icon: <MdShare />,
        label: "Share article",
        confirmation: { title: "Share article", desc: "Share article" },
        action: () => {
          uiAct.addToast({
            label: `success doing Share article`,
            // action:()=>{},
            type: "success",
          });
        },
      },
      {
        icon: <MdReport />,
        label: "Report article",
        confirmation: { title: "Report article", desc: "Report article" },
        action: () => {
          uiAct.addToast({
            label: `success doing Report article`,
            // action:()=>{},
            type: "success",
          });
        },
      },
      {
        icon: <FaVolumeMute />,
        label: "Mute author",
        confirmation: {
          title: "Mute author",
          desc: "You will not see any of their posts until you un-mute them back, are you sure?",
        },
        action: () => {
          uiAct.addToast({
            label: `You will not see any of their posts until you un-mute them back, are you sure?`,
            // action:()=>{},
            type: "success",
            action: {
              label:
                "You will not see any of their posts until you un-mute them back",
              action: () => {
                console.log(
                  "You will not see any of their posts until you un-mute them back",
                );
              },
            },
          });
        },
      },
      {
        icon: <FaVolumeUp />,
        label: "Unmute author",
        // confirmation: { title: "Unmute author", desc: "Unmute author" },
        action: () => {
          uiAct.addToast({
            label: `success doing Unmute author`,
            // action:()=>{},
            type: "success",
          });
        },
      },
      {
        icon: <MdFlag />,
        label: "Report author",
        // confirmation: { title: "Report author", desc: "Report author" },
        action: () => {
          uiAct.addToast({
            label: `success doing Report author`,
            // action:()=>{},
            type: "success",
          });
        },
      },
      {
        icon: <MdPersonOff />,
        label: "Block author",
        confirmation: {
          title: "Block author",
          desc: "This author will never interact with you again until you unblock them, are you sure?",
        },
        action: () => {
          uiAct.addToast({
            label: `success doing Block author`,
            // action:()=>{},
            type: "success",
          });
        },
      },
    ],
    [],
  );
  const { optionModal, closeOptionModal } = usePostOptionModalBehaviorHook();
  return (
    <ModalActionTemplate
      value={optionModal}
      onClose={closeOptionModal}
      title="Post options"
      desc="What to do about this post?"
      actions={options}
    ></ModalActionTemplate>
  );
}

export default React.memo(ArticleCommentOptionModal);
