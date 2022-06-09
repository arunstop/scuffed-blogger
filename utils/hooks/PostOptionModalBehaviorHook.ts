import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { routeTrimQuery } from "../helpers/RouteHelpers";

export function usePostOptionModalBehaviorHook() {
  const [optionModal, setOptionModal] = useState(false);
  const router = useRouter();

  // open state
  const openOptionModal = useCallback((value: boolean) => {
    setOptionModal(value);
  }, []);

  // close state
  const closeOptionModal = useCallback(() => {
    // const q = router.query.articleId;
    // console.log(router);
    const currentPath = routeTrimQuery(router.asPath);
    router.replace(currentPath, undefined, {
      shallow: true,
    });
  }, [router]);

  // Determine on what query the state will change
  useEffect(() => {
    openOptionModal(!!router.query.postoption);

    return () => {};
  }, [router.query.postoption]);

  return { optionModal, closeOptionModal };
}
