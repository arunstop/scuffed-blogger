import React from "react";
import Container from "../../../components/common/Container";
import ProfileSetupForm from "../../../components/profile/ProfileSetupForm";

function LayoutProfilePageSetup() {
  return (
    <Container>
      <div className="relative z-0 min-h-screen overflow-hidden rounded-xl">
        <ProfileSetupForm />
      </div>
    </Container>
  );
}

export default LayoutProfilePageSetup;
