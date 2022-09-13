import dynamic from "next/dynamic";
import Head from "next/head";
import SplashScreen from "../components/placeholder/SplashScreen";
import { APP_DESC, APP_NAME } from "../utils/helpers/Constants";

const LazyLayoutArticlePageWrite = dynamic(
  () => import("../layouts/article/pages/LayoutArticlePageWrite"),
  {
    ssr: false,
    loading(loadingProps) {
      return <SplashScreen />;
    },
  },
);

function Write() {
  return (
    <>
      <Head>
        <title>{`Write your thought! - ${APP_NAME}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={APP_DESC} />
      </Head>
      <LazyLayoutArticlePageWrite />
    </>
  );
}

export default Write;
