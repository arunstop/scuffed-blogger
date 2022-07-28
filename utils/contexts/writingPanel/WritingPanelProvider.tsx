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
  storageRemove,
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
      // encoding content
      const processedData: WritingPanelFormProps = {
        ...data,
        content: encodeURIComponent(data.content),
      };
      // set state
      dispatch({ type: "SET_FORM_DATA", payload: { data: processedData } });
      // save to local
      storageSave(
        KEY_ARTICLE_DRAFT,
        JSON.stringify({
          ...data,
          thumbnail: undefined,
        } as WritingPanelFormProps),
      );
    },
    clearFormData: () => {
      dispatch({ type: "CLEAR_FORM_DATA" });
      storageRemove(KEY_ARTICLE_DRAFT);
    },
    setTab: (data) => {
      dispatch({ type: "SET_TAB", payload: { data: data } });
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
    if (state.formData) return;
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
