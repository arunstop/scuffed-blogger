import { useRouter } from "next/router";
import { useCallback } from "react";
import { routeTrimQuery } from "../helpers/MainHelpers";

export function useUiSidebarBehaviorHook() {
  const router = useRouter();

  const show = !!router.query.sidebar;

  const closeSidebar = useCallback(() => {
    // const q = router.query.articleId;
    // console.log(router);
    const currentPath = routeTrimQuery(router.asPath);
    router.replace(currentPath, undefined, {
      shallow: true,
    });
  }, [router]);

  const openSidebar = useCallback(() => {
    if (show) return;
    router.push({ query: { sidebar: true } });
  }, [router]);

  //   // checking the query params
  //   // then open or close based on the value
  //   useEffect(() => {
  //     if (show) return openSidebar();
  //     return closeSidebar();
  //   }, [show]);

  return { sidebar: show, openSidebar, closeSidebar };
}
