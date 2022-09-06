import { GetServerSideProps } from "next";
import Head from "next/head";
import MainContainer from "../../../components/main/MainContainer";
import { LayoutArticlePageEdit } from "../../../layouts/article/LayoutArticlePageEdit";
import { WritingPanelProvider } from "../../../utils/contexts/writingPanel/WritingPanelProvider";
import { ArticleModel } from "../../../utils/data/models/ArticleModel";
import { APP_DESC, APP_NAME } from "../../../utils/helpers/Constants";
import { mainApi } from "../../../utils/services/network/MainApi";

export const getServerSideProps: GetServerSideProps<{
  articleContentless: ArticleModel;
}> = async (context) => {
  // SLUG ORDER
  // 0 = User's id
  // 1 = Tab/section

  // Getting id from the slug from the last 24 chars
  const slug = (context.query.editSlug || "") as string;
  const articleContentless = await mainApi.mainArticleGetById({ id: slug });
  // Show 404 if article not found or
  // if the slugs don't  match
  if (!articleContentless)
    return {
      notFound: true,
    };
  return { props: { articleContentless: articleContentless } };
};

function Edit({ articleContentless }: { articleContentless: ArticleModel }) {
  return (
    <>
      <Head>
        <title>{`Edit article - ${APP_NAME}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={APP_DESC} />
      </Head>
      <MainContainer className="">
        <WritingPanelProvider
          initFormData={{
            desc: articleContentless.desc,
            content: articleContentless.content,
            tags: articleContentless.tags.join(","),
            title: articleContentless.title,
            topics: articleContentless.topics?.join(",") || "",
            defaultThumbnailPreview: articleContentless.thumbnail,
          }}
        >
          <LayoutArticlePageEdit oldArticle={articleContentless} />
        </WritingPanelProvider>
      </MainContainer>
    </>
  );
}

export default Edit;
