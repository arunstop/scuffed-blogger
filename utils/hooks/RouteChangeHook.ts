import { getBodyEl } from "./../helpers/Helpers";
import { useRouter } from "next/router";
import { useEffect } from "react";
export const useRouteChange = () => {
  const router = useRouter();
  useEffect(() => {
    const body = getBodyEl() as Element;

    body.scrollTop = 0;
    return () => {};
  }, [router.pathname]);
};
