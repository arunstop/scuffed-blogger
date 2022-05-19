import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import { APP_NAME } from "../utils/helpers/Constants";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Scuffed blogs, for scuffed people"/>
      </Head>
      <Header />
      <div className="h-screen bg-base-300 p-4 sm:p-8">
      </div>
    </>
  );
};

export default Home;
