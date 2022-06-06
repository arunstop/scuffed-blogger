import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UiProvider } from "../utils/contexts/ui/UiProvider";
import { useRouteChange } from "../utils/hooks/RouteChangeHook";
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }: AppProps) {
  // Detect route change
  useRouteChange();
  return (
    <UiProvider>
      <NextNProgress
        color="hsl(var(--pc))"
        startPosition={0.3}
        stopDelayMs={300}
        height={6}
        showOnShallow={false}
      />
      <Component {...pageProps} />
    </UiProvider>
  );
}

export default MyApp;
