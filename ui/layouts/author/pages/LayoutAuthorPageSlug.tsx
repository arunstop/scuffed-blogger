import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { MdMoreVert } from "react-icons/md";
import { useAuthCtx } from "../../../../app/contexts/auth/AuthHook";
import { UserDisplayModel } from "../../../../base/data/models/UserDisplayModel";
import Container from "../../../components/common/Container";
import MobileHeader, {
  MobileHeaderActionProps,
} from "../../../components/main/MobileHeader";
import UserContent from "../../../components/user/UserContent";

function LayoutAuthorPageSlug({
  userDisplay,
  tab,
}: {
  userDisplay: UserDisplayModel;
  tab: string;
}) {
  const { avatar, id, name, username, desc } = userDisplay;
  const { authStt } = useAuthCtx();
  const router = useRouter();

  const getActions = (): MobileHeaderActionProps[] => {
    return [
      {
        icon: <MdMoreVert />,
        label: "More",
        options: [
          {
            label: "Report User",
            action() {
              alert("should report article");
            },
            confirmation: {
              title: "Report user",
              desc: "Are you sure you want to report this user, because of some reason?",
            },
          },
          {
            label: "Block User",
            action() {
              alert("should block article");
            },
            confirmation: {
              title: "Block user",
              desc: "Are you sure you want to block this user, because of some reason?",
            },
          },
          {
            label: "Mute User",
            action() {
              alert("should mute article");
            },
            confirmation: {
              title: "Mute user",
              desc: "Are you sure you want to mute this user, because of some reason?",
            },
          },
        ],
      },
    ];
  };
  return (
    <>
      <MobileHeader
        title={userDisplay.name}
        back={() => router.back()}
        actions={getActions()}
      />
      <Container>
        <div className="relative flex h-auto w-full flex-col">
          <img
            className="absolute h-[10rem] w-full max-w-none rounded-xl bg-primary/10 object-cover sm:h-[15rem] blur-lg"
            src={`${avatar}`}
            alt="Image"
            width={240}
            height={300}
          />
          <div className="relative mt-[6.5rem] inline-flex h-auto items-center justify-between gap-4 sm:mt-[9rem] sm:gap-8">
            <div className="avatar">
              <div
                className="z-0 w-24 rounded-[50%] border-2 border-base-100 
              transition-all hover:rounded-xl sm:w-48 sm:border-4 bg-white"
              >
                <img src={`${avatar}`} alt={`Avatar of ${name}`} />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 sm:gap-4">
              {authStt.user?.id === userDisplay.id ? (
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
                  btn-primary
                 `}
                  >
                    <span className="block">Edit</span>
                  </button>
                </div>
              ) : (
                <FollowButton />
              )}
              <span className="text-base sm:text-lg">2.4K followers</span>
            </div>
          </div>
          <div></div>
        </div>
        <div className="flex flex-col gap-2 sm:gap-4">
          <div className="flex flex-1 flex-col">
            <span className="text-xl font-bold sm:text-3xl">{name}</span>
            <span className="text-lg font-semibold opacity-50 sm:text-xl">
              @{username}
            </span>
          </div>
          {!!desc && (
            <div>
              <p className="text-base sm:text-lg">{desc}</p>
            </div>
          )}
        </div>
        <UserContent userDisplay={userDisplay} tab={tab} />
      </Container>
    </>
  );
}

export default LayoutAuthorPageSlug;

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
