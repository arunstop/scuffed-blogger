import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import Script from "next/script";
import "../styles/globals.css";
import { AuthProvider } from "../utils/contexts/auth/AuthProvider";
import { UiProvider } from "../utils/contexts/ui/UiProvider";
// import { ArticleModel } from "../utils/data/models/ArticleModel";
import dynamic from "next/dynamic";
import { parseCookies } from "nookies";
import { isUserModel, UserModel } from "../utils/data/models/UserModel";
import { COOKIE_USER_AUTH } from "../utils/helpers/Constants";
import { useRouteChange } from "../utils/hooks/RouteChangeHook";
import SplashScreen from "../components/placeholder/LayoutPlaceholder";

interface AdditionalAppProps {
  user?: UserModel;
}
const LazyNextProgressBar = dynamic(() => import("nextjs-progressbar"), {
  ssr: false,
});

const LazyMainWrapper = dynamic(
  () => import("../layouts/main/LayoutMainWrapper"),
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

      <AuthProvider initUser={user}>
        <UiProvider>
          <LazyNextProgressBar
            color="hsl(var(--pc))"
            startPosition={0.4}
            stopDelayMs={200}
            height={6}
            showOnShallow={false}
          />
          <LazyMainWrapper>
            <Component {...pageProps} />
          </LazyMainWrapper>
        </UiProvider>
      </AuthProvider>
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
