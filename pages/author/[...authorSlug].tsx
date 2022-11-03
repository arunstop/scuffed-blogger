import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
import { APP_NAME } from "../../app/helpers/Constants";
import { serviceUserDisplayGetById } from "../../app/services/UserService";
import { UserDisplayModel } from "../../base/data/models/UserDisplayModel";
import SplashScreen from "../../ui/components/placeholder/SplashScreen";

interface AuthorPageProps {
  userDisplay: UserDisplayModel;
  tab: string;
}

export const getServerSideProps: GetServerSideProps<AuthorPageProps> = async (
  context,
) => {
  // SLUG ORDER
  // 0 = User's id
  // 1 = Tab/section
  
  const slug = context.query.authorSlug || [];
  if (!slug.length)
  return {
    notFound: true,
  };
  const authorId = slug[0];
  if (!authorId)
    return {
      notFound: true,
    };
  const tab = slug[1] || "post";

  const userDisplay = await serviceUserDisplayGetById({
    data: { userId: authorId },
  });

  
  if (!userDisplay) return { notFound: true };

  return {
    props: {
      userDisplay: userDisplay,
      tab,
    },
  };
};

const LazyLayoutAuthorPageSlug = dynamic(
  () => import("../../ui/layouts/author/pages/LayoutAuthorPageSlug"),
  {
    loading: () => <SplashScreen />,
    ssr: false,
  },
);

function Author({ userDisplay, tab }: AuthorPageProps) {
  const title = userDisplay.name + " - " + APP_NAME;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={userDisplay.desc} />
      </Head>
      <LazyLayoutAuthorPageSlug userDisplay={userDisplay} tab={tab} />
    </>
  );
}

export default Author;
