import type { AppProps } from "next/app";
import Script from "next/script";
import NextNProgress from "nextjs-progressbar";
import "../styles/globals.css";
import { UiProvider } from "../utils/contexts/ui/UiProvider";
import { useRouteChange } from "../utils/hooks/RouteChangeHook";

function MyApp({ Component, pageProps }: AppProps) {
  // Detect route change
  useRouteChange();
  return (
    <>
      <Script src="/ThemeInitializer.js" strategy="beforeInteractive" />

      <UiProvider>
        <NextNProgress
          color="hsl(var(--pc))"
          startPosition={0.4}
          stopDelayMs={200}
          height={6}
          showOnShallow={false}
        />
        <Component {...pageProps} />
      </UiProvider>
    </>
  );
}

export default MyApp;
