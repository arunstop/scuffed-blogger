import { MdWorkspaces } from "react-icons/md";
import { APP_NAME } from "../../utils/helpers/Constants";

function SplashScreen() {
  return (
    <div
      id="layout-placeholder"
      className="min-h-screen bg-gradient-to-b from-transparent  flex via-primary/50 from-transparent  animate-pulse
      transition-all"
    >
      <div className="flex flex-col gap-2 sm-gap-4 m-auto animate-bounce items-center text-primary-content ">
        <MdWorkspaces className="animate-spin text-4xl sm:text-5xl" />

        <span className="  font-black text-xli sm:text-2xl">{APP_NAME}</span>
      </div>
    </div>
  );
}

export default SplashScreen;
