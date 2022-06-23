import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
import MainContainer from "../components/main/MainContainer";
import MainSectionFilter from "../components/main/MainSectionFilterTab";
import MainSectionSkeleton from "../components/main/MainSectionSkeleton";
import { APP_DESC, APP_NAME } from "../utils/helpers/Constants";


const LazyMainPostSection = dynamic(
  () => import("../components/main/MainPostSection"),
  {
    loading: () => <MainSectionSkeleton text="Loading posts..." spinner />,
    
  },
);

const Home: NextPage = () => {
  console.log("render Index");
  return (
    <>
      <Head>
        <title>{`${APP_NAME} - Let your voice be heard`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={APP_DESC} />
      </Head>
      <MainContainer>
        {/* <div className="hidden sm:block"><MainSearchBar /></div> */}
        <MainSectionFilter />
        <LazyMainPostSection />
      </MainContainer>
    </>
  );
};

export default React.memo(Home);
