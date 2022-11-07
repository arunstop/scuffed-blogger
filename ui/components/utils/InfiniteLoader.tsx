import React, { ReactNode } from "react";
import IntersectionObserverTrigger from "./IntesectionObserverTrigger";

export interface InfiniteLoaderProps {
  callback: (intersecting: boolean) => void;
  loaderKey?: string|number;
  loaderShown?: boolean;
  loaderChildren?: ReactNode;
  loaderClassName?: string;
}

export const InfiniteLoader = React.forwardRef<
  HTMLDivElement,
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > &
    InfiniteLoaderProps
>(
  (
    {
      children,
      callback,
      loaderKey,
      loaderShown,
      loaderChildren,
      loaderClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} {...props}>
        {children}
        {loaderShown && <IntersectionObserverTrigger
          key={loaderKey}
          callback={callback}
          className={loaderClassName}
        >
          {loaderChildren}
        </IntersectionObserverTrigger>}
      </div>
    );
  },
);

InfiniteLoader.displayName = "InfiniteLoader";
