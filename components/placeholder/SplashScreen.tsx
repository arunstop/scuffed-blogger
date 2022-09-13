import { MdWorkspaces } from "react-icons/md";
import { APP_NAME } from "../../utils/helpers/Constants";

function SplashScreen() {
  return (
    <div
      id="layout-placeholder"
      className="flex min-h-screen animate-pulse  bg-gradient-to-b from-transparent via-primary/50  to-transparent
      transition-all"
    >
      <div className="sm-gap-4 m-auto flex animate-bounce flex-col items-center gap-2 text-primary-content ">
        <MdWorkspaces className="animate-spin text-4xl sm:text-5xl" />

        <span className="  text-xli font-black sm:text-2xl">{APP_NAME}</span>
      </div>
    </div>
  );
}

export default SplashScreen;
