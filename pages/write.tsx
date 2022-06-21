import Head from "next/head";
import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MainContainer from "../components/main/MainContainer";
import WritingPanel from "../components/write/WritingPanel";
import { APP_DESC, APP_NAME } from "../utils/helpers/Constants";

function Write() {
  return (
    <>
      <Head>
        <title>{`Write your thought! - ${APP_NAME}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={APP_DESC} />
      </Head>
      <Header />
      <MainContainer className="">
        <WritingPanel />
      </MainContainer>
      <Footer/>
    </>
  );
}

export default Write;
