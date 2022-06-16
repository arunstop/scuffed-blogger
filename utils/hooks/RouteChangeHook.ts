import { getBodyEl } from "../helpers/UiHelpers";
import { useRouter } from "next/router";
import { useEffect } from "react";
export const useRouteChange = () => {
  const router = useRouter();

  // `routeChangeComplete` has 2 params which are
  // - url
  // - {shallow}
  // // https://nextjs.org/docs/api-reference/next/router#routerevents
  function handleRouteChangeComplete(
    url: string,
    { shallow }: { shallow: boolean },
  ) {
    // SCROLL to top on route change only when the shallow is false
    if (!shallow) {
      scrollToTop();
    }
  }
  // useEffect(() => {
  //   scrollToTop();

  //   return () => {};
  // }, [router.pathname]);

  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);
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
