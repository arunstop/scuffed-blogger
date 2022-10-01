import dynamic from "next/dynamic";
import Head from "next/head";
import SplashScreen from "../../ui/components/placeholder/SplashScreen";
import { APP_NAME } from "../../app/helpers/Constants";

const LazyLayoutProfilePageChooseTopics = dynamic(
  () => import("../../ui/layouts/profile/pages/LayoutProfilePageChooseTopics"),
  {
    ssr: false,
    loading(loadingProps) {
      return <SplashScreen />;
    },
  },
);

function ProfileChooseTopics() {
  const title = "Setup your " + APP_NAME + " profile - " + APP_NAME;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={"Setup your profile"} />
      </Head>
      
      <LazyLayoutProfilePageChooseTopics />
    </>
  );
}

export default ProfileChooseTopics;
