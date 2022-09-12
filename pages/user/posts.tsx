import _ from "lodash";
import dynamic from "next/dynamic";
import Head from "next/head";
import SplashScreen from "../../components/placeholder/LayoutPlaceholder";
import { useAuthCtx } from "../../utils/contexts/auth/AuthHook";
import { APP_NAME } from "../../utils/helpers/Constants";

const LazyLayoutUserPagePosts = dynamic(
  () => import("../../layouts/user/pages/LayoutUserPagePosts"),
  {
    ssr: false,
    loading(loadingProps) {
      return <SplashScreen />;
    },
  },
);

function PageUserPosts() {
  const {
    authStt: { user },
    authAct,
  } = useAuthCtx();

  return (
    <>
      <Head>
        <title>{`${_.startCase(user?.name)} - ${APP_NAME}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Scuffed blogs, for scuffed people" />
      </Head>
      <LazyLayoutUserPagePosts />
    </>
  );
}

export default PageUserPosts;
