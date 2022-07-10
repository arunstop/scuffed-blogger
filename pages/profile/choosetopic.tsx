import Head from "next/head";
import React from "react";
import MainContainer from "../../components/main/MainContainer";
import ProfileChooseTopic from "../../components/profile/ProfileChooseTopic";
import { APP_NAME } from "../../utils/helpers/Constants";

function ProfileSetup() {
  const title = "Setup your " + APP_NAME + " profile - " + APP_NAME;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={"Setup your profile"} />
      </Head>
      {/* <Header /> */}
      <MainContainer>
        <div className="relative z-0 min-h-screen overflow-hidden rounded-xl">
        <ProfileChooseTopic />
        </div>
      </MainContainer>
      {/* <Footer/> */}
    </>
  );
}

export default ProfileSetup;
