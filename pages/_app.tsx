import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import Script from "next/script";
import "../styles/globals.css";
// import { ArticleModel } from "../utils/data/models/ArticleModel";
import dynamic from "next/dynamic";
import Head from "next/head";
import { parseCookies } from "nookies";
import SplashScreen from "../ui/components/placeholder/SplashScreen";
import { isUserModel, UserModel } from "../base/data/models/UserModel";
import { APP_DESC, APP_NAME, COOKIE_USER_AUTH } from "../app/helpers/Constants";
import { useRouteChange } from "../app/hooks/RouteChangeHook";
// import LayoutAppWrapper from "../ui/layouts/main/LayoutAppWrapper";

interface AdditionalAppProps {
  user?: UserModel;
}
const LazyNextProgressBar = dynamic(() => import("nextjs-progressbar"), {
  ssr: false,
});

// const LazyLayoutMainWrapper = dynamic(
//   () => import("../ui/layouts/main/LayoutMainWrapper"),
//   {
//     ssr: false,
//     loading(loadingProps) {
//       return <SplashScreen />;
//     },
//   },
// );

const LazyLayoutAppWrapper = dynamic(
  () => import("../ui/layouts/main/LayoutAppWrapper"),
  {
    ssr: true,
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

        {/* PWA */}

        <meta name="application-name" content="Tuturku" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tuturku" />
        <meta name="description" content="Let your voices be heard!" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/touch-icon-ipad.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/touch-icon-iphone-retina.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/touch-icon-ipad-retina.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Tuturku" />
        <meta property="og:description" content="Let your voices be heard!" />
        <meta property="og:site_name" content="Tuturku" />
        <meta property="og:url" content="https://tuturku.vercel.app" />
        {/* <meta
          property="og:image"
          content="https://tuturku.vercel.app/icons/384.png"
          
        /> */}
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
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
