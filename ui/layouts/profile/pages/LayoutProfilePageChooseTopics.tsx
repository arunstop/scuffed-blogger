import React from "react";
import Container from "../../../components/common/Container";
import ProfileChooseTopicsForm from "../../../components/profile/ProfileChooseTopicsForm";

function LayoutProfilePageChooseTopics() {
  return <Container>
  <div className="relative z-0 min-h-screen overflow-hidden rounded-xl">
    <ProfileChooseTopicsForm />
  </div>
</Container>;
}

export default LayoutProfilePageChooseTopics;
