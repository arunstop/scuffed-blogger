import Head from "next/head";
import React from "react";
import GradientBackground from "../../components/main/GradientBackground";
import MainContainer from "../../components/main/MainContainer";
import ProfileSetupForm from "../../components/profile/ProfileSetupForm";
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
        <GradientBackground />

          <div className=" min-h-full mx-auto flex w-full flex-col p-4 sm:max-w-md sm:p-8 md:max-w-lg lg:max-w-xl">
            <span className="my-1 text-center text-2xl font-black text-primary-content sm:my-3 sm:text-3xl">
              {"Setup your profile"}
              {/* {(placeholder?.status||"")} */}
            </span>
            <div className="form-control mt-4 sm:mt-8 gap-4 sm:gap-8">
            <ProfileSetupForm /></div>
            
          </div>
        </div>
      </MainContainer>
      {/* <Footer/> */}
    </>
  );
}

export default ProfileSetup;
