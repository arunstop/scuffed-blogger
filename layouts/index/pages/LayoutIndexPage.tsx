import { useRouter } from "next/router";
import React from "react";
import { MdEdit } from "react-icons/md";
import MainContainer from "../../../components/main/MainContainer";
import MobileHeader from "../../../components/main/MobileHeader";
import { APP_NAME } from "../../../utils/helpers/Constants";
import LayoutIndexPostSection from "../LayoutIndexPostSection";
import LayoutIndexTabFilter from "../LayoutIndexTabFilter";

function LayoutIndexPage() {
  const router = useRouter();
  return (
    <>
      <MobileHeader
        title={APP_NAME}
        actions={[
          {
            label: "Write",
            icon: <MdEdit />,
            action() {
              router.push(`/write`);
            },
          },
        ]}
      />

      <MainContainer>
        <LayoutIndexTabFilter />
        <LayoutIndexPostSection />
      </MainContainer>
    </>
  );
}

export default LayoutIndexPage;
