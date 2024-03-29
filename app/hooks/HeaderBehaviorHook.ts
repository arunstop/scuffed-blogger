import { useEffect } from "react";
import { getHeaderEl, getBodyEl } from "../helpers/UiHelpers";

function scrollCallback(event: Event, callback: (value:boolean)  => void) {
  const element = event.target as Element;
  const header = getHeaderEl();
  const scrolledToTop = element.scrollTop === 0;
  callback(scrolledToTop);
  if (scrolledToTop) {
    header!.classList.remove("bg-primary/50", "shadow-lg","backdrop-blur-md");
    header!.classList.add("text-primary");
  } else {
    // if already has the classes
    if (
      header?.classList.contains("bg-primary/50") &&
      header?.classList.contains("shadow-lg")
    )
      return;
    header!.classList.add("bg-primary/50", "shadow-lg", "backdrop-blur-md");
    header!.classList.remove("text-primary");
  }
  // console.log("top" + Math.random());
}

export function useHeaderBehavior(callback: (value:boolean) => void) {
  useEffect(() => {
    const body = getBodyEl();
    function scrollListener(event: Event) {
      scrollCallback(event, callback);
    }

    body.addEventListener("scroll", scrollListener);

    return () => {
      body.removeEventListener("scroll", scrollListener);
    };
  }, [callback]);
}
