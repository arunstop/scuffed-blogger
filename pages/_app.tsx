import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import Script from "next/script";
import NextNProgress from "nextjs-progressbar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/globals.css";
import { AuthProvider } from "../utils/contexts/auth/AuthProvider";
import { UiProvider } from "../utils/contexts/ui/UiProvider";
// import { ArticleModel } from "../utils/data/models/ArticleModel";
import { parseCookies } from "nookies";
import { UserModel } from "../utils/data/models/UserModel";
import { COOKIE_USER_AUTH } from "../utils/helpers/Constants";
import { useRouteChange } from "../utils/hooks/RouteChangeHook";

interface AdditionalAppProps {
  user?: UserModel;
}

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
          <NextNProgress
            color="hsl(var(--pc))"
            startPosition={0.4}
            stopDelayMs={200}
            height={6}
            showOnShallow={false}
          />
          <Header />
          <Component {...pageProps} />
          <Footer />
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
      const user = JSON.parse(decodeURIComponent(auth)) as UserModel;
      
      return {
        ...context,
        user,
      } as AppProps & AdditionalAppProps;
    } catch (error) {
      console.log("Error when parsing local user data : ", error );
    }
  }
  // if it doesn't then return the normal params for `MainApp` without `user` prop
  return { ...context };
};

export default MainApp;
