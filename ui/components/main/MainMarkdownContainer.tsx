import { kebabCase } from "lodash";
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

interface MainMarkdownContainerProps {
  content: string;
  className?: string;
}

function blankifyLinks(container: HTMLElement) {
  // making every link to be open in a new tab
  const links = Array.from(container.getElementsByTagName("a"));
  links.forEach((linkEl) => {
    // using `getAttribute` instead of `.href`
    // becase `.href` returns a full link
    // instead of the raw text inside of that attribute
    const rawHref = linkEl.getAttribute("href") || "";
    // console.log(rawHref);
    // check if the href points to an `id`
    // or check if `target` attribute is not null already
    if (rawHref[0] === "#" || linkEl.getAttribute("target") !== null) return;
    linkEl.setAttribute("target", "_blank");
  });
}

function linkifyHeaders(container: HTMLElement) {
  const headers = Array.from(container.querySelectorAll("h1,h2"));
  headers.forEach((el) => {
    const id = kebabCase(el.innerHTML);
    el.setAttribute("id", id);
  });
}

function MainMarkdownContainer({
  content,
  className = "",
}: MainMarkdownContainerProps) {
  useEffect(() => {
    const container = document.getElementById("main-markdown-container");
    if (container) {
      // make all links open in new tab
      blankifyLinks(container);
      // give ids to each h1 and h2
      linkifyHeaders(container);
    }
    return () => {};
  }, [content]);

  return (
    <article
      key={Math.random() + 1}
      id="main-markdown-container"
      className={`prose grow rounded-sm prose-sm md:prose lg:prose-lg !max-w-none prose-img:rounded-lg
      prose-th:!border-x-2 prose-td:border-2 prose-td:!p-2
      prose-th:!p-2 prose-th:!font-bold prose-strong:!font-bold prose-thead:!border-y-2
      prose-td:!border-base-content/20 prose-thead:!border-base-content/20
      prose-code:bg-base-300 prose-code:!rounded-md prose-code:outline prose-code:outline-1 
      prose-code:outline-base-content/20 prose-pre:![background-color:hsl(var(--bc)/30%)]
      prose-code:prose-pre:bg-transparent prose-code:prose-pre:outline-none prose-pre:!text-base-content
      prose-table:block prose-table:overflow-auto prose-table:max-w-full prose-table:!w-auto 
      prose-thead:bg-base-content/30 prose-th:!text-base-content prose-th:!border-base-100  
      first:prose-th:!border-l-0 last:prose-th:!border-r-0 prose-thead:!border-y-base-100
      even:prose-tr:prose-table:bg-base-300
      ${className}
      animate-fadeIn  animate-duration-700
      `}
    >
      <ReactMarkdown remarkPlugins={[gfm]}>
        {content || "No content."}
      </ReactMarkdown>
    </article>
  );
}

export default React.memo(MainMarkdownContainer);
