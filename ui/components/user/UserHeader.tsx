import Link from "next/link";
import { useEffect, useState } from "react";
import { autoRetry } from "../../../app/helpers/MainHelpers";
import { fbUserDisplayGet } from "../../../app/services/UserService";
import { UserDisplayModel } from "../../../base/repos/realtimeDb/RealtimeUserRepo";
import UserAvatar from "./UserAvatar";

function UserHeader({
  id,
  userDisplay = null,
}: {
  id?: string;
  userDisplay?: UserDisplayModel | null;
}) {
  const [display, setDisplay] = useState<UserDisplayModel | null>(userDisplay);
  async function loadUserDisplay(id: string) {
    const displayFromDb = await autoRetry(
      async () => await fbUserDisplayGet({ data: { userId: id } }),
    );
    if (displayFromDb) setDisplay(displayFromDb);
  }
  // load from db if userDisplay is not initialized
  useEffect(() => {
    if (userDisplay) return;
    if (!id) return;
    loadUserDisplay(id);
  }, []);

  return display ? (
    <Link href={`/author/${display.id || ""}`} passHref>
      <a className="flex flex-row items-center gap-4 hover:underline animate-fadeIn animate-duration-300">
        <UserAvatar src={display.avatar} />
        <div className="flex flex-col">
          <span className="text-base font-bold sm:text-lg !leading-[1.2] capitalize">
            {display.name}
          </span>
          <span className="text-base font-semibold sm:text-lg opacity-50 !leading-[1.2]">
            {`@${display.username}`}
          </span>
        </div>
      </a>
    </Link>
  ) : (
    <div className="flex w-full gap-2 sm:gap-4">
      <div
        className="rounded-full aspect-square h-10 sm:h-12 bg-gradient-to-r from-primary/30 via-primary/50 
        to-primary/70 animate-twPulse animate-duration-1000 animate-infinite"
      ></div>
      <div
        className="h-10 sm:h-12 min-w-[12rem]  w-[50%] bg-gradient-to-r from-primary/30 via-primary/50 to-primary/70 
        rounded-lg animate-twPulse animate-duration-1000 animate-infinite"
      ></div>
    </div>
  );
}

export default UserHeader;
