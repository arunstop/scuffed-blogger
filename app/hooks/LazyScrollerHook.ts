import { useCallback, useRef, useState } from "react";
import { waitFor } from "../helpers/DelayHelpers";

interface LazyScrollerHookProps {
  delay?: number;
  callback?: () => void | Promise<void>;
}

function useLazyScrollerHook(
  { delay = 0, callback }: LazyScrollerHookProps = {}, // <==
  // Adding empty object is the way to make destructuring parameters optional,
  // but all the object inside of that parameter needs to be optional
  // reference : https://stackoverflow.com/questions/56969950/optional-typed-immediately-destructured-parameters
) {
  const [load, setLoad] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  async function action() {
    // if there is a callback, execute first
    // giving await to callback meaning that it could be promise
    if (delay > 0) await waitFor(delay);
    if (callback) await callback();
    // then load
    setLoad(true);
  }

  const ref = useCallback((node: HTMLElement | null) => {
    // if (loadCommentSection === true) return;
    // if component is rendered, disconnect the observer
    // because we need it to run only once
    if (observer.current) observer.current.disconnect();
    // setting the observer.
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        action();
      }
    });
    // Observe node if the component is rendered
    if (node) observer.current?.observe(node);
  }, []);
  return {
    ref,
    load,
    setLoad: (val: boolean) => {
      console.log(val);
      setLoad(val);
    },
  };
}

export default useLazyScrollerHook;
