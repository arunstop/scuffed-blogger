import { getBodyEl } from "../helpers/UiHelpers";
import { useRouter } from "next/router";
import { useEffect } from "react";
export const useRouteChange = () => {
  const router = useRouter();
  useEffect(() => {
    scrollToTop();
    return () => {};
  }, [router.pathname]);
};

export function scrollToTop(smooth = false) {
  const body = getBodyEl() as Element;

  // smooth scroll
  if (smooth) {
    body.scrollTo({ top: 0, behavior: "smooth" });
  }
  // normal scroll
  else {
    body.scrollTop = 0;
  }
}
