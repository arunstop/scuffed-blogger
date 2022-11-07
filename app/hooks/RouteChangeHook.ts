import { getBodyEl } from "../helpers/UiHelpers";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { atom, useAtom } from "jotai";

export const routeHistoryAtom = atom<string[]>([]);
export const useRouteChange = () => {
  const router = useRouter();
  const [history, setH] = useAtom(routeHistoryAtom);

  const setHistory = useCallback(
    (url: string) =>
      setH((state) => {
        console.log([...state.filter((e) => e !== url), url]);
        if (state.includes(url))
          return [...state.filter((e) => e !== url), url];
        return [...state, url];
      }),
    [],
  );
  // `routeChangeComplete` has 2 params which are
  // - url
  // - {shallow}
  // // https://nextjs.org/docs/api-reference/next/router#routerevents
  function handleRouteChangeComplete(
    url: string,
    { shallow }: { shallow: boolean },
  ) {
    // Do not scroll if there is a modal.
    // meaning the user is trying to back out of a modal
    // instead of a page
    if (document.getElementById("headlessui-portal-root")) return;
    // SCROLL to top on route change only when the shallow is false
    if (url.includes("?sidebar") || url.includes("?search")) {
      return setHistory(url);
    }
    if (!shallow) {
      setHistory(url);
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
