import Head from "next/head";
import React from "react";
import MainContainer from "../components/main/MainContainer";
import WritingPanel from "../components/write/WritingPanel";
import { WritingPanelProvider } from "../utils/contexts/writingPanel/WritingPanelProvider";
import { APP_DESC, APP_NAME } from "../utils/helpers/Constants";

function Write() {
  return (
    <>
      <Head>
        <title>{`Write your thought! - ${APP_NAME}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={APP_DESC} />
      </Head>
      <MainContainer className="">
        <WritingPanelProvider>
          <WritingPanel />
        </WritingPanelProvider>
      </MainContainer>
    </>
  );
}

export default Write;
