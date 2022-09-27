import { useRouter } from "next/router";
import React from "react";
import MainContainer from "../../../components/main/MainContainer";
import MobileHeader from "../../../components/main/MobileHeader";
import WritingPanel from "../../../components/write/WritingPanel";
import { WritingPanelProvider } from "../../../utils/contexts/writingPanel/WritingPanelProvider";

function LayoutArticlePageWrite() {
  const router = useRouter();
  return (
    <>
      <MobileHeader
        back={() => {
          router.back();
        }}
        title={`Write Article`}
      />
      <MainContainer>
        <WritingPanelProvider>
          <WritingPanel />
        </WritingPanelProvider>
      </MainContainer>
    </>
  );
}

export default LayoutArticlePageWrite;
