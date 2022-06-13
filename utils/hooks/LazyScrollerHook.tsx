import { useCallback, useRef, useState } from "react";

function useLazyScrollerHook() {
  const [load, setLoad] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const ref = useCallback((node: HTMLElement | null) => {
    // if (loadCommentSection === true) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoad(true);
        console.log("visible");
      }
    });
    if (node) observer.current?.observe(node);
  }, []);
  return { ref, load,setLoad };
}

export default useLazyScrollerHook;
