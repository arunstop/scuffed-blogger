import { MdWorkspaces } from "react-icons/md";
import { APP_NAME } from "../../../app/helpers/Constants";

function SplashScreen() {
  return (
    <>
      <div
        className="min-h-screen pointer-events-none"
      ></div>
      <div id="splash-screen" className="inset-0 fixed flex min-h-screen pointer-events-none">
        {/* background */}
        <div
          className="animate-twPulse animate-infinite  bg-gradient-to-b from-transparent via-primary/50  to-transparent
      transition-all absolute inset-0 "
        ></div>
        {/* spinning and label */}
        <div className="m-auto flex flex-col items-center">
          <div className="sm-gap-4 m-auto flex animate-twBounce animate-infinite flex-col items-center gap-2 text-primary-content ">
            <div className="animate-twSpin animate-infinite ">
              <MdWorkspaces className="animate-flip animate-infinite animate-duration-[2000ms] text-4xl sm:text-5xl" />
            </div>

            <span className="text-xl font-black sm:text-2xl">{APP_NAME}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default SplashScreen;
