import { useRouter } from "next/router";
import React from "react";
import { MdAdd } from "react-icons/md";
import { APP_NAME } from "../../../../app/helpers/Constants";
import Container from "../../../components/common/Container";
import MobileHeader from "../../../components/main/MobileHeader";
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
            icon: <MdAdd />,
            action() {
              router.push(`/write`);
            },
          },
        ]}
      />

      <Container>
        <LayoutIndexTabFilter />
        <LayoutIndexPostSection />
      </Container>
    </>
  );
}

export default LayoutIndexPage;
