import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { routeTrimQuery } from "../helpers/MainHelpers";

export function useModalRoutedBehaviorHook(
  mainParam: string,
) {
  const [show, setShow] = useState(false);
  const router = useRouter();

  // toggle modal
  const toggle = useCallback((value: boolean) => {
    setShow(value);
  }, []);

  // close state
  const close = useCallback(() => {
    const currentPath = routeTrimQuery(router.asPath);
    router.replace(currentPath, undefined, {
      shallow: true,
    });
  }, [router]);

  const value = router.query[mainParam];

  // Determine on what query/param on url, the state will change
  useEffect(() => {
    // if query "postoption" exist, it will open the modal
    // if it doesn't it will close the modal
    toggle(!!value);

    return () => {};
  }, [value]);

  return { show, close, toggle, value: value as string, query: router.query };
}
