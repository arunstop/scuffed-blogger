import { ReactNode, useEffect, useReducer } from "react";
import {
  WritingPanelAction,
  getWritingPanelInit,
  WritingPanelContextProps,
  WritingPanelFormProps,
} from "../../data/contexts/WritingPanelTypes";
import { KEY_ARTICLE_DRAFT } from "../../helpers/Constants";
import {
  storageCheck,
  storageGet,
  storageSave,
} from "../../services/local/LocalStorage";
import { WritingPanelContext } from "./WritingPanelContext";
import { writingPanelReducer } from "./WritingPanelReducer";

export const WritingPanelProvider = ({ children }: { children: ReactNode }) => {
  // reducer
  const [state, dispatch] = useReducer(
    writingPanelReducer,
    getWritingPanelInit(),
  );
  const action: WritingPanelAction = {
    setFormData: (data) => {
      dispatch({ type: "SET_FORM_DATA", payload: { data: data } });
      storageSave(KEY_ARTICLE_DRAFT, JSON.stringify(data));
    },
    // setReplyingCommentId: (id) => {
    //   dispatch({ type: "SET_REPLYING_COMMENT_ID", payload: { id } });
    // },
  };

  const value: WritingPanelContextProps = {
    state: state,
    action: action,
  };

  useEffect(() => {
    if(state.formData) return;
    if (storageCheck(KEY_ARTICLE_DRAFT)) {
      try {
        const localArticleDraft = JSON.parse(
          storageGet(KEY_ARTICLE_DRAFT),
        ) as WritingPanelFormProps;
        action.setFormData(localArticleDraft);
      } catch (error) {
        console.log(
          "Error when setting up WritingPanelContext with localStorage data",
          error,
        );
      }
    }
  }, [state.formData]);

  return (
    <WritingPanelContext.Provider value={value}>
      {children}
    </WritingPanelContext.Provider>
  );
};
