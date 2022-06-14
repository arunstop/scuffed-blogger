import { useCallback, useRef, useState } from "react";

interface LazyScrollerHookProps {
  delay?: number;
  callback?: () => void;
}
function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function useLazyScrollerHook(
  { delay = 0, callback }: LazyScrollerHookProps = {}, // <==
  // Adding empty object is the way to make destructuring parameters optional,
  // but all the object inside of that parameter needs to be optional
  // reference : https://stackoverflow.com/questions/56969950/optional-typed-immediately-destructured-parameters
) {
  const [load, setLoad] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  function action() {
    // if there is a callback, execute first
    if (callback) callback();
    // then load
    setLoad(true);
    // console.log("visible");
  }

  const ref = useCallback((node: HTMLElement | null) => {
    // if (loadCommentSection === true) return;
    // if component is rendered, disconnect the observer
    // because we need it to run only once
    if (observer.current) observer.current.disconnect();
    // setting the observer.
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Apply delay if set
        if (delay === 0) {
          action();
        } else {
          // wait for requested amount of time
          (async () => {
            await waitFor(delay);
            action();
          })();
        }
      }
    });
    // Observe node if the component is rendered
    if (node) observer.current?.observe(node);
  }, []);
  return { ref, load, setLoad };
}

export default useLazyScrollerHook;
