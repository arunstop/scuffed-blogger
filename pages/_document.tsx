import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="!overflow-auto !pr-0">
      <Head />
      <body className="max-h-screen overflow-auto overflow-x-hidden font-nunito transition-colors duration-500 pb-12 sm:pb-0">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
