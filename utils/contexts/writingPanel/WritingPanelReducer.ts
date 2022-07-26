import {
  WritingPanelActionTypes,
  WritingPanelState,
} from "../../data/contexts/WritingPanelTypes";

export const writingPanelReducer = (
  state: WritingPanelState,
  action: WritingPanelActionTypes,
): WritingPanelState => {
  const type = action.type;
  switch (type) {
    case "SET_FORM_DATA": {
      return { ...state, formData: action.payload.data };
    }
    case "SET_TAB": {
      return { ...state, tab: action.payload.data };
    }
    case "CLEAR_FORM_DATA":{
      return {...state,formData:null};
    }
    // case "SET_REPLYING_COMMENT_ID": {
    //   return { ...state, replyingCommentId: action.payload.id };
    // }
    default:
      return state;
  }
};
