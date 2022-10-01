import { useRouter } from "next/router";
import React from "react";
import { WritingPanelProvider } from "../../../../app/contexts/writingPanel/WritingPanelProvider";
import MainContainer from "../../../components/main/MainContainer";
import MobileHeader from "../../../components/main/MobileHeader";
import WritingPanel from "../../../components/write/WritingPanel";

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
