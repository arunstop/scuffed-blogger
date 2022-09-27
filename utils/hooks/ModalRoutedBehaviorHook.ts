import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export function useModalRoutedBehaviorHook(mainParam: string) {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const value = router.query[mainParam];

  // toggle modal
  const toggle = useCallback(
    (show: boolean, value?: any) => {
      // if showing
      if (show)
        return router.push(
          {
            query: {
              ...router.query,
              [mainParam]: value,
            },
          },
          undefined,
          { shallow: true },
        );
      // if hiding
      return close();
    },
    [router],
  );

  // close state
  const close = useCallback(() => {
    // const currentPath = routeTrimQuery(router.asPath);
    // router.replace(currentPath, undefined, {
    //   shallow: true,
    // });
    if(value) router.back();
  }, [value]);

  // Determine on what query/param on url, the state will change
  useEffect(() => {
    // if query "postoption" exist, it will open the modal
    // if it doesn't it will close the modal
    setShow(!!value);

    return () => {};
  }, [value]);

  return { show, close, toggle, value: value as string, query: router.query };
}
