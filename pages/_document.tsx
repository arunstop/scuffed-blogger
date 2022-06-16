import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en" className="!overflow-auto !pr-0">
      <Head />
      <body className="max-h-screen overflow-auto overflow-x-hidden font-nunito">
        <Main />
        <NextScript />
      <Script src="/ThemeInitializer.js" strategy="beforeInteractive" />

      </body>
    </Html>
  );
}
