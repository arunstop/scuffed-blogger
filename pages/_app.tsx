import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UiProvider } from "../utils/contexts/ui/UiProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UiProvider>
      <Component {...pageProps} />
    </UiProvider>
  );
}

export default MyApp;
