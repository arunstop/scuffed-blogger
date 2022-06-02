import Head from "next/head";
import React from "react";
import AuthPanel from "../components/auth/AuthPanel";
import Header from "../components/Header";
import MainContainer from "../components/main/MainContainer";
import { APP_NAME } from "../utils/helpers/Constants";

function Auth() {
  const title = "Login to " + APP_NAME + " | " + APP_NAME;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={"Login to write articles!"} />
      </Head>
      <Header />
      <MainContainer>
        <AuthPanel />
      </MainContainer>
    </>
  );
}

export default Auth;
