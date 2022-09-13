import React, { useEffect, useState } from "react";

function ArticleProgressBar() {
  const [progress, setProgress] = useState(0);
  const scrollListener = (ev: Event) => {
    const ele = document.getElementById("main-markdown-container");
    if (ele) {
      const bodyEl = ev.target as Element;
      const scrollProgress = bodyEl.scrollTop;
      //   cross-platform viewport height
      const viewportHeight =
        Math.max(
          document.documentElement.clientHeight || 0,
          window.innerHeight || 0,
        ) / 2;
      // substracting with ( viewport height/2) to the total scroll
      // doing so, when the user's middle viewport point become the indicator
      // instead of the bottom one.
      const totalToScroll = ele.offsetHeight + ele.offsetTop - viewportHeight;
      const readingProgress = (scrollProgress / totalToScroll) * 100;
      setProgress(Math.round(readingProgress));
      // console.log(ele.offsetHeight);
    }
  };

  useEffect(() => {
    if (document.body) {
      document.body.addEventListener("scroll", scrollListener);
    }
    return () => {
      if (document.body)
        document.body.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <div className="pointer-events-none sticky inset-x-0 top-0 z-[11] sm:-mb-16 sm:pt-16">
      <div
        className="h-1 bg-primary bg-gradient-to-r from-primary via-primary-focus to-primary-content transition-[width] 
        duration-300 ease-linear sm:h-2"
        style={{
          width: `${progress}%`,
        }}
      ></div>
    </div>
  );
}

export default ArticleProgressBar;
