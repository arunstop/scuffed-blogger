import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { APP_DESC, APP_NAME } from "../../../app/helpers/Constants";
import { autoRetry } from "../../../app/helpers/MainHelpers";
import { serviceArticleGetById } from "../../../app/services/ArticleService";
import { ArticleModel } from "../../../base/data/models/ArticleModel";
import SplashScreen from "../../../ui/components/placeholder/SplashScreen";

export const getServerSideProps: GetServerSideProps<{
  articleContentless: ArticleModel;
}> = async (context) => {
  // SLUG ORDER
  // 0 = User's id
  // 1 = Tab/section

  // Getting id from the slug from the last 24 chars
  const slug = (context.query.editSlug || "") as string;
  const articleContentless = await autoRetry(
    async () => await serviceArticleGetById({ data: { id: slug } }),
  );
  // Show 404 if article not found or
  // if the slugs don't  match
  if (!articleContentless)
    return {
      notFound: true,
    };
  return { props: { articleContentless: articleContentless } };
};

const LazyLayoutArticlePageEdit = dynamic(
  () => import("../../../ui/layouts/article/pages/LayoutArticlePageEdit"),
  {
    ssr: false,
    loading(loadingProps) {
      return <SplashScreen />;
    },
  },
);

function Edit({ articleContentless }: { articleContentless: ArticleModel }) {
  return (
    <>
      <Head>
        <title>{`Edit article - ${APP_NAME}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={APP_DESC} />
      </Head>
      <LazyLayoutArticlePageEdit articleContentless={articleContentless} />
    </>
  );
}

export default Edit;
