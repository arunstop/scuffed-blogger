import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { routeTrimQuery } from "../helpers/MainHelpers";

export function usePostOptionModalBehaviorHook() {
  const [optionModal, setOptionModal] = useState(false);
  const router = useRouter();

  // open state
  const toggleOptionModal = useCallback((value: boolean) => {
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

  // Determine on what query/param on url, the state will change
  useEffect(() => {
    // if query "postoption" exist, it will open the modal
    // if it doesn't it will close the modal
    toggleOptionModal(!!router.query.postoption);

    return () => {};
  }, [router.query.postoption]);

  return { optionModal, closeOptionModal };
}
