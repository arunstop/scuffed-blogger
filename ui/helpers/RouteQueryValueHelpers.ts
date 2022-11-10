export function isValidCommentId(id: string) {
  return id.length === 38;
}

// checking if the comment query param is valid
// valid example : VALID_COMMENT_ID.VALID_COMMENT_ID
// consist of two VALID_COMMENT_ID separated by a `.`
// or 1 VALID_COMMENT_ID

export function isValidCommentQueryParam(v: string) {
  const vArr = v.split(".");
  if (!vArr.length) return undefined;
  if (isParentComment(v)) {
    if (!isValidCommentId(vArr[0]) && !isValidCommentId(vArr[1]))
      return undefined;
    return {
      parentId: vArr[0],
    };
  }
  if (!isValidCommentId(vArr[0])) return undefined;
  return {
    parentId: vArr[0],
    replyId: vArr[1],
  };
}

export function isParentComment(paramVal: string) {
  return paramVal.split(".").length === 1;
}
