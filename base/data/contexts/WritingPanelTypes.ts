export interface WritingPanelContextProps {
  state: WritingPanelState;
  action: WritingPanelAction;
}

export interface WritingPanelState {
  formData: WritingPanelFormProps | undefined;
  tab: WritingPanelTabTypes;
}

export type WritingPanelTabTypes = "Preview" | "Write";

export interface WritingPanelAction {
  setFormData: (data: WritingPanelFormProps,saveLocal?:boolean) => void;
  clearFormData: () => void;
  setTab: (data: WritingPanelTabTypes) => void;
}

export type WritingPanelActionTypes =
  | {
      type: "SET_FORM_DATA";
      payload: { data: WritingPanelFormProps };
    }
  | {
      type: "CLEAR_FORM_DATA";
    }
  | {
      type: "SET_TAB";
      payload: { data: WritingPanelTabTypes };
    };
// | {
//     type: "SET_REPLYING_COMMENT_ID";
//     payload: { id: string | number | null };
//   };

export interface WritingPanelFormProps {
  title: string;
  desc: string;
  topics: string;
  tags: string;
  content: string;
  thumbnail?: FileList;
  defaultThumbnailPreview?:string;
}

// factory

// const createFormData = (
//   data: Partial<WritingPanelFormProps> = {
//     title: "This is title ",
//     desc: "This is desc",
//     topics: "This is topics",
//     tags: "This is tags",
//     content: "This is content",
//     thumbnail: undefined,
//   },
// ) => {
//   return data;
// };

export const getWritingPanelInit = ({
  formData,
  tab = "Write",
}: Partial<WritingPanelState>): WritingPanelState => {
  return { formData, tab };
};
