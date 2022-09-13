import React from "react";
import MainContainer from "../../../components/main/MainContainer";
import WritingPanel from "../../../components/write/WritingPanel";
import { WritingPanelProvider } from "../../../utils/contexts/writingPanel/WritingPanelProvider";

function LayoutArticlePageWrite() {
  return (
    <MainContainer>
      <WritingPanelProvider>
        <WritingPanel />
      </WritingPanelProvider>
    </MainContainer>
  );
}

export default LayoutArticlePageWrite;
