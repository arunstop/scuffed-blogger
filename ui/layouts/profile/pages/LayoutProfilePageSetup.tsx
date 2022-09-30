import React from "react";
import MainContainer from "../../../components/main/MainContainer";
import ProfileSetupForm from "../../../components/profile/ProfileSetupForm";

function LayoutProfilePageSetup() {
  return (
    <MainContainer>
      <div className="relative z-0 min-h-screen overflow-hidden rounded-xl">
        <ProfileSetupForm />
      </div>
    </MainContainer>
  );
}

export default LayoutProfilePageSetup;
