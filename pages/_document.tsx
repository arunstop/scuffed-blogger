import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="!overflow-auto !pr-0">
      <Head />
      <body className="max-h-screen overflow-auto overflow-x-hidden font-nunito transition-colors duration-500">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
