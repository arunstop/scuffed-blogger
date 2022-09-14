import React, { useEffect, useState } from "react";

function ArticleProgressBar() {
  const [progress, setProgress] = useState(0);
  const scrollListener = (ev: Event) => {
    const ElContent = document.getElementById("main-markdown-container");
    const ElTitle = document.getElementById("article-title");
    if (ElContent && ElTitle) {
      const ElBody = ev.target as Element;
      const scrollProgress =
        ElBody.scrollTop - ElTitle.clientHeight;
      //   cross-platform viewport height
      const viewportHeight =
        Math.max(
          document.documentElement.clientHeight || 0,
          window.innerHeight || 0,
        ) / 2;
      // substracting with ( viewport height/2) to the total scroll
      // doing so, when the user's middle viewport point become the indicator
      // instead of the bottom one.
      const totalToScroll =
        ElContent.offsetHeight + ElContent.offsetTop - viewportHeight;
      const readingProgress = (scrollProgress / totalToScroll) * 100;
      if (readingProgress < 0) return setProgress(0);
      if (readingProgress > 100) return setProgress(100);
      return setProgress(Math.round(readingProgress));
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
    <div className="pointer-events-none sticky inset-x-0 top-0 z-10 sm:-mb-16 sm:pt-16">
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
