import React from "react";
import MainContainer from "../../../components/main/MainContainer";
import ProfileChooseTopicsForm from "../../../components/profile/ProfileChooseTopicsForm";

function LayoutProfilePageChooseTopics() {
  return <MainContainer>
  <div className="relative z-0 min-h-screen overflow-hidden rounded-xl">
    <ProfileChooseTopicsForm />
  </div>
</MainContainer>;
}

export default LayoutProfilePageChooseTopics;
