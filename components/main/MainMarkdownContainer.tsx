import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

interface MainMarkdownContainerProps {
  content: string;
  className?: string;
}

function MainMarkdownContainer({
  content,
  className,
}: MainMarkdownContainerProps) {
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <article
      id="main-markdown-container"
      className={`prose grow rounded-sm prose-sm md:prose lg:prose-lg !max-w-none prose-img:rounded-lg
      prose-th:!border-x-2 prose-td:border-2 prose-td:!p-2 prose-thead:bg-base-300
      prose-th:!p-2 prose-th:!font-bold prose-strong:!font-bold prose-thead:!border-y-2
      prose-td:!border-base-content/20 prose-th:!border-base-content/20 prose-thead:!border-base-content/20
      prose-code:bg-base-300 prose-code:!rounded-sm prose-code:outline prose-code:outline-2 
      prose-code:outline-base-content/10 prose-pre:![background-color:hsl(var(--bc)/50%)]
      prose-code:prose-pre:bg-transparent prose-code:prose-pre:outline-none
      ${className}
      `}
    >
      <ReactMarkdown remarkPlugins={[gfm]}>
        {decodeURIComponent(content) || "No content."}
      </ReactMarkdown>
    </article>
  );
}

export default MainMarkdownContainer;
