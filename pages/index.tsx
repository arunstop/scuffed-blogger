import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import MainPost from "../components/main/MainPost";
import { APP_NAME } from "../utils/helpers/Constants";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Scuffed blogs, for scuffed people" />
      </Head>
      <Header />
      <div
        className="min-h-screen bg-base-300 p-4 sm:p-8 
        grid justify-center gap-4 grid grid-cols-4 sm:bg-red-500 md:bg-blue-500"
        id="main-content"
      >
        {[...Array(10)].map((e) => (
          <MainPost key={Math.random()} />
        ))}
      </div>
    </>
  );
};

export default Home;
