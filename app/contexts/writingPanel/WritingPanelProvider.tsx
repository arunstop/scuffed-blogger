import { ReactNode, useEffect, useReducer } from "react";
import {
  getWritingPanelInit,
  WritingPanelAction,
  WritingPanelContextProps,
  WritingPanelFormProps,
} from "../../../base/data/contexts/WritingPanelTypes";
import { KEY_ARTICLE_DRAFT } from "../../helpers/Constants";
import {
  repoLocalCheck,
  repoLocalGet,
  repoLocalRemove,
  repoLocalSave,
} from "../../../base/repos/LocalStorage";
import { WritingPanelContext } from "./WritingPanelContext";
import { writingPanelReducer } from "./WritingPanelReducer";

export const WritingPanelProvider = ({
  children,
  initFormData,
}: {
  children: ReactNode;
  initFormData?: WritingPanelFormProps;
}) => {
  // reducer
  const [state, dispatch] = useReducer(
    writingPanelReducer,
    getWritingPanelInit({
      formData: initFormData,
    }),
  );
  const action: WritingPanelAction = {
    setFormData: (data,saveLocal) => {
      // encoding content
      const processedData: WritingPanelFormProps = {
        ...data,
        content: data.content,
      };
      // set state
      dispatch({ type: "SET_FORM_DATA", payload: { data: processedData } });
      // save to local
      if(saveLocal) 
      repoLocalSave(
        KEY_ARTICLE_DRAFT,
        JSON.stringify({
          ...data,
          thumbnail: undefined,
        } as WritingPanelFormProps),
      );
    },
    clearFormData: () => {
      dispatch({ type: "CLEAR_FORM_DATA" });
      repoLocalRemove(KEY_ARTICLE_DRAFT);
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
    if (repoLocalCheck(KEY_ARTICLE_DRAFT)) {
      try {
        const localArticleDraft = JSON.parse(
          repoLocalGet(KEY_ARTICLE_DRAFT),
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
