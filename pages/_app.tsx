import type { AppProps } from "next/app";
import Script from "next/script";
import NextNProgress from "nextjs-progressbar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/globals.css";
import { AuthProvider } from "../utils/contexts/auth/AuthProvider";
import { UiProvider } from "../utils/contexts/ui/UiProvider";
import { useRouteChange } from "../utils/hooks/RouteChangeHook";

function MyApp({ Component, pageProps }: AppProps) {
  // Detect route change
  useRouteChange();
  return (
    <>
      <Script src="/ThemeInitializer.js" strategy="beforeInteractive" />

      <AuthProvider>
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
}

export default MyApp;
