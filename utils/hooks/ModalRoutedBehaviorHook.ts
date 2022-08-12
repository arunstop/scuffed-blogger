import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { routeTrimQuery } from "../helpers/MainHelpers";

export function ModalRoutedBehaviorHook(param: string) {
  const [modal, setModal] = useState(false);
  const router = useRouter();

  // toggle modal
  const toggleModal = useCallback((value: boolean) => {
    setModal(value);
  }, []);

  // close state
  const closeModal = useCallback(() => {
      alert("closemodal");
    const currentPath = routeTrimQuery(router.asPath);
    router.replace(currentPath, undefined, {
      shallow: true,
    });
  }, [router]);

  // Determine on what query/param on url, the state will change
  useEffect(() => {
    // if query "postoption" exist, it will open the modal
    // if it doesn't it will close the modal
    toggleModal(!!router.query[param]);

    return () => {};
  }, [router.query[param]]);

  return { modal, closeModal, toggleModal };
}
