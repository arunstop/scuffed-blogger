import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { UserDisplayModel } from "../../../base/data/models/UserDisplayModel";
import ModalImagePreview from "../../components/modal/ModalImagePreview";

function LayoutAuthorHeroSection({
  userDisplay,
}: {
  userDisplay: UserDisplayModel;
}) {
  const { avatar, id, name, username, desc } = userDisplay;
  const { authStt } = useAuthCtx();
  const router = useRouter();

  return (
    <div className="relative flex h-auto w-full flex-col">
      <img
        className="absolute h-[10rem] w-full max-w-none rounded-xl bg-primary/10 object-cover sm:h-[15rem] blur-lg"
        src={`${avatar}`}
        alt="Image"
        width={240}
        height={300}
      />
      <div className="relative mt-[6.5rem] inline-flex h-auto items-center justify-between gap-4 sm:mt-[9rem] sm:gap-8">
        <div>
          <ModalImagePreview>
            <a
              className="avatar group-focus-within:max-w-[60vw] w-24 sm:w-48 group-focus-within:sm:max-w-[60vw] 
          justify-center group  duration-300 group-focus-within:m-auto m-0 max-h-[90vh] group-focus-within:w-full
          aspect-square"
            >
              <div
                className="z-0  rounded-[50%] border-2 border-primary/50 
        transition-all hover:rounded-xl group-focus-within:rounded-xl  sm:border-4 bg-base-content/30"
              >
                <img src={`${avatar}`} alt={`Avatar of ${name}`} />
              </div>
            </a>
          </ModalImagePreview>
        </div>
        <div className="flex flex-col items-end gap-2 sm:gap-4">
          {authStt.user?.id === userDisplay.id ? (
            <div
              className={`border-base-100 border-2 sm:border-4 mt-[24px] sm:mt-[44px] bg-base-100
         rounded-full
       `}
            >
              <Link href={`profile/edit`} passHref>
                <a
                  className={`
              btn sm:btn-lg font-bold !border-2 sm:!border-4 !outline-none group
              transition-all w-32 sm:w-40 btn-primary gap-2 sm:gap-4
            `}
                >
                  <MdEdit className="text-2xl sm:text-3xl" />
                  <span className="text-xl sm:text-2xl">Edit</span>
                </a>
              </Link>
            </div>
          ) : (
            <FollowButton />
          )}
          <span className="text-base sm:text-lg">2.4K followers</span>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default LayoutAuthorHeroSection;

const FollowButton = React.memo(function FollowButton() {
  const [following, setFollowing] = useState(false);

  return (
    <div
      className={`border-base-100 border-2 sm:border-4 mt-[24px] sm:mt-[44px] bg-base-100
          rounded-full
        `}
    >
      <button
        className={`
            btn sm:btn-lg text-xl sm:text-2xl font-bold 
            !border-2 sm:!border-4 !outline-none group
            transition-all w-32 sm:w-40
            ${following ? "btn-outline btn-neutral" : "btn-primary"}
          `}
        onClick={() => setFollowing(!following)}
      >
        <span className="block group-hover:hidden">
          {following ? "Following" : "Follow"}
        </span>
        <span className="hidden group-hover:block">
          {following ? "Unfollow" : "Follow"}
        </span>
      </button>
    </div>
  );
});
