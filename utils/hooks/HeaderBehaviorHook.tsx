import { useEffect } from "react";
import { getHeaderEl, getBodyEl } from "../helpers/Helpers";

function scrollListener(event: Event) {
    const element = event.target as Element;
    const header = getHeaderEl();
    const scrolledToTop = element.scrollTop === 0;
    if (scrolledToTop) {
      header!.classList.remove("bg-primary/50","shadow-lg");
    } else {
      header!.classList.add("bg-primary/50","shadow-lg");
    }
  }

export function useHeaderBehavior(){
    useEffect(() => {
        const body = getBodyEl();
    
        body.addEventListener("scroll", scrollListener);
    
        return () => {
          body.removeEventListener("scroll", scrollListener);
        };
      }, []);
}