import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { routeTrimQuery } from "../helpers/MainHelpers";

export function useUiSidebarBehaviorHook() {
  const router = useRouter();

  const closeSidebar = useCallback(() => {
    // const q = router.query.articleId;
    // console.log(router);
    const currentPath = routeTrimQuery(router.asPath);
    router.replace(currentPath, undefined, {
      shallow: true,
    });
  }, [router]);

  const openSidebar = useCallback(() => {
    router.push({ query: { sidebar: true } });
  }, [router]);

  const show = !!router.query.sidebar;

  // checking the query params
  // then open or close based on the value
  useEffect(() => {
    if (show) return openSidebar();
    return closeSidebar();
  }, [show]);

  return { sidebar: show, openSidebar, closeSidebar };
}
