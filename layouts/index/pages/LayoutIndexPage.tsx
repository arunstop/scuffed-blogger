import React from "react";
import MainContainer from "../../../components/main/MainContainer";
import LayoutIndexPostSection from "../LayoutIndexPostSection";
import LayoutIndexTabFilter from "../LayoutIndexTabFilter";

function LayoutIndexPage() {
  return (
    <MainContainer>
      <LayoutIndexTabFilter />
      <LayoutIndexPostSection />
    </MainContainer>
  );
}

export default LayoutIndexPage;
