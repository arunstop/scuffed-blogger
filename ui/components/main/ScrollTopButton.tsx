import React, { useEffect, useState } from "react";
import { MdArrowUpward } from "react-icons/md";
import { getBodyEl } from "../../../app/helpers/UiHelpers";
import { scrollToTop } from "../../../app/hooks/RouteChangeHook";

function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  function handleScroll(ev: Event) {
    const passingTreshold = (ev.target as HTMLBodyElement).scrollTop > 100;
    setVisible(passingTreshold);
  }

  useEffect(() => {
    const body = getBodyEl() as HTMLBodyElement;
    body.addEventListener("scroll", handleScroll);
    return () => {
      body.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {visible && (
        <div className="fixed py-4 px-6 bottom-0 right-0 hidden sm:flex pointer-events-none animate-fadeInUp animate-duration-500">
          <button className="btn btn-primary pointer-events-auto" onClick={()=>scrollToTop(true)}>
            <MdArrowUpward className="text-2xl" />
          </button>
        </div>
      )}
    </>
  );
}

export default React.memo(ScrollTopButton);
