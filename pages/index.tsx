import type { NextPage } from "next";
import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MainPost from "../components/main/MainPost";
import MainSectionFilter from "../components/main/MainSectionFilterTab";
import { APP_NAME,APP_DESC } from "../utils/helpers/Constants";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={APP_DESC} />
      </Head>
      <Header />
      <div
        className="min-h-screen bg-base-100 p-4 sm:p-8 
        justify-center gap-4 sm:gap-8 flex flex-col
        max-w-[60rem] mx-auto"
      >
        <MainSectionFilter />
        <div
          className="flex flex-col gap-4 sm:gap-8
        "
          id="main-content"
        >
          {[...Array(10)].map((e) => (
            <MainPost
              key={Math.random()}
              post={{ id: Math.round(Math.random() * 100) + "" }}
            />
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Home;
