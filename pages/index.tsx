import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MainContainer from "../components/main/MainContainer";
import MainSearchBar from "../components/main/MainSearchBar";

import MainSectionFilter from "../components/main/MainSectionFilterTab";
import MainSectionSkeleton from "../components/main/MainSectionSkeleton";
import { APP_DESC, APP_NAME } from "../utils/helpers/Constants";

const LazyMainPostSection = dynamic(
  () => import("../components/main/MainPostSection"),
  {
    loading: () => <MainSectionSkeleton text="Loading posts..." />,
    ssr: false,
  },
);

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={APP_DESC} />
      </Head>
      <Header />
      <MainContainer>
        <MainSearchBar />
        <MainSectionFilter />
        <LazyMainPostSection />
      </MainContainer>
      <Footer />
    </>
  );
};

export default Home;
