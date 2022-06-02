import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UiProvider } from "../utils/contexts/ui/UiProvider";
import { useRouteChange } from "../utils/hooks/RouteChangeHook";

function MyApp({ Component, pageProps }: AppProps) {
  
  // Detect route change
  useRouteChange();
  return (
    <UiProvider>
      <Component {...pageProps} />
    </UiProvider>
  );
}

export default MyApp;
