import { Html, Head, Main, NextScript } from "next/document";
import { APP_NAME, APP_DESC } from "../utils/helpers/Constants";

export default function Document() {
  return (
    <Html lang="en" className="!overflow-auto !pr-0">
      <Head>
        <title>{`${APP_NAME} - Let your voice be heard`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={APP_DESC} />
      </Head>
      <body className="max-h-screen overflow-auto overflow-x-hidden font-nunito transition-colors duration-500">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
