import dynamic from "next/dynamic";
import Head from "next/head";
import SplashScreen from "../components/placeholder/SplashScreen";
import { APP_NAME } from "../utils/helpers/Constants";

const LazyLayoutAuthPage = dynamic(
  () => import("../layouts/auth/pages/LayoutAuthPage"),
  {
    ssr: false,
    loading(loadingProps) {
      return <SplashScreen />;
    },
  },
);

function Auth() {
  const title = "Login to " + APP_NAME + " - " + APP_NAME;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={"Login to write articles!"} />
      </Head>
      {/* <Header /> */}
      <LazyLayoutAuthPage />
      {/* <Footer/> */}
    </>
  );
}

export default Auth;
