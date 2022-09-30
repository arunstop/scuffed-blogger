import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import Script from "next/script";
import "../styles/globals.css";
// import { ArticleModel } from "../utils/data/models/ArticleModel";
import dynamic from "next/dynamic";
import  Head  from "next/head";
import { parseCookies } from "nookies";
import SplashScreen from "../components/placeholder/SplashScreen";
import { isUserModel, UserModel } from "../base/data/models/UserModel";
import { APP_DESC, APP_NAME, COOKIE_USER_AUTH } from "../app/helpers/Constants";
import { useRouteChange } from "../app/hooks/RouteChangeHook";

interface AdditionalAppProps {
  user?: UserModel;
}
const LazyNextProgressBar = dynamic(() => import("nextjs-progressbar"), {
  ssr: false,
});

const LazyLayoutMainWrapper = dynamic(
  () => import("../layouts/main/LayoutMainWrapper"),
  {
    ssr: false,
    loading(loadingProps) {
      return <SplashScreen />;
    },
  },
);

const LazyLayoutAppWrapper = dynamic(
  () => import("../layouts/main/LayoutAppWrapper"),
  {
    ssr: false,
    loading(loadingProps) {
      return <SplashScreen />;
    },
  },
);

// Not using `NextPage` type because of it is custom
const MainApp = ({
  Component,
  pageProps,
  user,
}: AppProps & AdditionalAppProps) => {
  // Detect route change
  useRouteChange();
  return (
    <>
      <Script src="/ThemeInitializer.js" strategy="beforeInteractive" />
      <Head>
        <title>{`${APP_NAME} - Let your voice be heard`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={APP_DESC} />
      </Head>
      <LazyLayoutAppWrapper user={user}>
        <Component {...pageProps} />
      </LazyLayoutAppWrapper>

      {/* <LazyLayoutAppWrapper user={user}>
        <Component {...pageProps} />
      </LazyLayoutAppWrapper> */}
    </>
  );
};

MainApp.getInitialProps = async (appContext: AppContext) => {
  // getting initial props
  const context = await App.getInitialProps(appContext);
  // get auth user cookie
  const auth = parseCookies(appContext.ctx)?.[COOKIE_USER_AUTH];
  // if it exist then return it to the `MainApp`
  if (auth) {
    try {
      // getting local user data
      const user = JSON.parse(auth);
      if (!isUserModel(user as unknown)) {
        throw new Error(
          "Auth data stored in the cookies has invalid format/structure",
        );
      }

      return {
        ...context,
        user: user as UserModel,
      } as AppProps & AdditionalAppProps;
    } catch (error) {
      // if somehow the auth data from cookie is changed.
      console.log("Error when parsing local user data : ", error);
      return {
        ...context,
        user: undefined,
      } as AppProps & AdditionalAppProps;
    }
  }
  // if it doesn't then return the normal params for `MainApp` without `user` prop
  return { ...context };
};

export default MainApp;
