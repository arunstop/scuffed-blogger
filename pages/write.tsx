import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MainContainer from "../components/main/MainContainer";
import WritingPanel from "../components/write/WritingPanel";
import { getArticleById } from "../utils/api/Api";
import { APP_DESC, APP_NAME } from "../utils/helpers/Constants";

export const getServerSideProps: GetServerSideProps<{ xd: any }> = async (
  context,
) => {
  // SLUG ORDER
  // 0 = User's id
  // 1 = Tab/section

  const slug = context.query.authorslug || [];
  const author = slug[0];
  const tab = slug[1] || "post";

  const article = await getArticleById();
  // const article = await addArticle("HAHAHAHA");
  // console.log(tab);

  return {
    props: { xd: article },
  };
};
function Write({ xd }: { xd: any }) {
  console.log(xd);
  return (
    <>
      <Head>
        <title>{`Write your thought! - ${APP_NAME}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={APP_DESC} />
      </Head>
      <Header />
      <MainContainer className="">
        <WritingPanel />
      </MainContainer>
      <Footer />
    </>
  );
}

export default Write;