export interface WritingPanelContextProps {
  state: WritingPanelState;
  action: WritingPanelAction;
}

export interface WritingPanelState {
  formData: WritingPanelFormProps | null;
}

export interface WritingPanelAction {
  setFormData: (data: WritingPanelFormProps) => void;
  // setReplyingCommentId: (id: string | number|null) => void;
}

export type WritingPanelActionTypes = {
  type: "SET_FORM_DATA";
  payload: { data: WritingPanelFormProps };
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
  thumbnail: FileList;
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

export const getWritingPanelInit = (): WritingPanelState => {
  return { formData: null };
};
