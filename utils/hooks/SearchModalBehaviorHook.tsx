import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { routeTrimQuery } from "../helpers/RouteHelpers";

export function useSearchModalBehavior() {
  const [searchModal, setSearchModal] = useState(false);
  const router = useRouter();

  const openSearchModal = useCallback((value: boolean) => {
    setSearchModal(value);
  }, []);

  const closeSearchModal = useCallback(() => {
    // const q = router.query.articleId;
    console.log(router);
    const currentPath = routeTrimQuery(router.asPath);
    router.replace(currentPath, undefined, {
      shallow: true,
    });
  }, [router]);

  useEffect(() => {
    openSearchModal(!!router.query.search);

    return () => {};
  }, [router.query.search]);

  return { searchModal, closeSearchModal };
}
