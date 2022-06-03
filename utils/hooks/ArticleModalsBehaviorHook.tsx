import { useRouter } from "next/router";
import { useState, useCallback, useEffect } from "react";

export function useArticleModalsBehaviorHook() {
    const [optionModal, setOptionModal] = useState<string | number | null>(null);
    const [replyModal, setReplyModal] = useState<string | number | null>(null);
    const router = useRouter();
  
    // const initPath = router.asPath.split("#")[0];
  
    const openOptionModal = useCallback((id: string | number | null) => {
      setOptionModal(id);
    }, []);
  
    const closeOptionModal = useCallback(() => {
      // window.history.replaceState(
      //   { ...window.history.state, as: initPath, url: initPath },
      //   "",
      //   initPath,
      // );
  
      // setOptionModal(null);
      // console.log(router.asPath);
      const q = router.query.articleId;
      router.replace({ query: { articleId: q } }, "/article/" + q, {
        shallow: true,
      });
    }, [router]);
  
    const openReplyModal = useCallback((id: string | number | null) => {
      setReplyModal(id);
    }, []);
  
    const closeReplyModal = useCallback(() => {
      // setReplyModal(null);
      // console.log(router);
      // console.log(router.asPath);
      const q = router.query.articleId;
      router.replace({ query: { articleId: q } }, "/article/" + q, {
        shallow: true,
      });
    }, [router]);
  
    useEffect(() => {
      openReplyModal(router.query.reply ? router.query.reply + "" : null);
  
      return () => {};
    }, [router.query.reply]);
  
    useEffect(() => {
      openOptionModal(router.query.option ? router.query.option + "" : null);
  
      return () => {};
    }, [router.query.option]);
  
    return { optionModal, closeOptionModal, replyModal, closeReplyModal };
  }