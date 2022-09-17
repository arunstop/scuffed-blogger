import Link from "next/link";
import { useEffect, useState } from "react";
import { fbUserDisplayGet } from "../../utils/services/network/FirebaseApi/UserModules";
import { UserDisplayModel } from "../../utils/services/network/RealtimeDatabase/RealtimeUserModules";
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
    const displayFromDb = await fbUserDisplayGet({ data: { userId: id } });
    if (displayFromDb) setDisplay(displayFromDb);
  }
  //   load from db is
  useEffect(() => {
    if (userDisplay) return;
    console.log(userDisplay);
    if (!id) return;
    loadUserDisplay(id);
  }, []);
  return display ? (
    <Link href={`/author/${display.id || ""}`} passHref>
      <a className="flex flex-row items-center gap-4 hover:underline">
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
    <div className="bg-red-500"></div>
  );
}

export default UserHeader;
