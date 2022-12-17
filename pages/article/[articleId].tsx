import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { APP_NAME, BASE_URL } from "../../app/helpers/Constants";
import { autoRetry } from "../../app/helpers/MainHelpers";
import { serviceArticleGetById } from "../../app/services/ArticleService";
import { ArticleModel } from "../../base/data/models/ArticleModel";
import SplashScreen from "../../ui/components/placeholder/SplashScreen";

interface ArticlePageProps {
  articleContentless: ArticleModel;
  meta: {
    title: string;
    desc: string;
    url: string;
    keyword: string;
    image: string;
  };
}

export const getServerSideProps: GetServerSideProps<ArticlePageProps> = async (
  context,
) => {
  // SLUG ORDER
  // 0 = User's id
  // 1 = Tab/section

  // Getting id from the slug from the last 24 chars
  const slug = (context.query.articleId || "") as string;
  const id = slug.slice(-24);
  const articleContentless = await autoRetry(
    async () => await serviceArticleGetById({ data: { id: id } }),
  );
  // Show 404 if article not found or
  // if the slugs don't  match
  if (!articleContentless || articleContentless.slug !== slug)
    return {
      notFound: true,
    };
  return {
    props: {
      articleContentless: articleContentless,
      meta: {
        title: articleContentless.title,
        desc: articleContentless.desc,
        url: `${BASE_URL}/article/${articleContentless.slug}`,
        keyword: `${articleContentless.tags.join(
          ", ",
        )}, ${articleContentless.topics.join(", ")}`,
        image:
          articleContentless.thumbnail ||
          `https://picsum.photos/id/${articleContentless.dateAdded
            .toString()
            .substring(0, -2)}/500/300`,
      },
    },
  };
};

const LazyLayoutArticlePageSlug = dynamic(
  () => import("../../ui/layouts/article/pages/LayoutArticlePageSlug"),
  {
    ssr: false,
    loading(loadingProps) {
      return <SplashScreen />;
    },
  },
);

function Article({ articleContentless, meta }: ArticlePageProps) {
  return (
    <>
      <Head>
        <title>{`${meta.title} - ${APP_NAME}`}</title>
        <meta name="description" content={meta.desc} />
        <meta name="keyword" content={meta.keyword} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={APP_NAME} />
        <meta property="og:description" content={meta.desc} />
        <meta property="og:site_name" content={APP_NAME} />
        <meta property="og:url" content={meta.url} />
        <meta property="og:image" content={meta.image} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <LazyLayoutArticlePageSlug
        key={articleContentless.id}
        articleContentless={articleContentless}
      />
    </>
  );
}

export default Article;
