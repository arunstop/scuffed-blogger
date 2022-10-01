import { useRouter } from "next/router";
import React from "react";
import { WritingPanelProvider } from "../../../../app/contexts/writingPanel/WritingPanelProvider";
import Container from "../../../components/common/Container";
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
      <Container>
        <WritingPanelProvider>
          <WritingPanel />
        </WritingPanelProvider>
      </Container>
    </>
  );
}

export default LayoutArticlePageWrite;
