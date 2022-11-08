import { useAtom } from "jotai";
import { useRouter } from "next/dist/client/router";
import { MdMoreVert } from "react-icons/md";
import { routeHistoryAtom } from "../../../../app/hooks/RouteChangeHook";
import { UserDisplayModel } from "../../../../base/data/models/UserDisplayModel";
import Container from "../../../components/common/Container";
import MobileHeader, {
  MobileHeaderActionProps,
} from "../../../components/main/MobileHeader";
import UserContent from "../../../components/user/UserContent";
import LayoutAuthorHeroSection from "../LayoutAuthorHeroSection";

function LayoutAuthorPageSlug({
  userDisplay,
  tab,
}: {
  userDisplay: UserDisplayModel;
  tab: string;
}) {
  const { avatar, id, name, username, desc } = userDisplay;
  const router = useRouter();
  const [history] = useAtom(routeHistoryAtom);

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
        back={() =>
          history.length
            ? router.replace(history[history.length - 1])
            : router.push("/")
        }
        actions={getActions()}
      />
      <Container>
        <LayoutAuthorHeroSection userDisplay={userDisplay} />
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
