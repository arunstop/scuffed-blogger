import React from "react";
import { useIntersectionObserverHook } from "../../../app/hooks/IntersectionObserverHook";

// old
function MainIntersectionObserverTrigger({
  callback,
  ...props
}: {
  callback: (intersecting: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { ref } = useIntersectionObserverHook({
    callback,
  });
  return <div ref={ref} {...props}></div>;
}

// new
// // using react polymorphism
// // https://stackoverflow.com/questions/66049571/how-can-i-implement-a-as-prop-with-typescript-while-passing-down-the-props
// type MainIntersectionObserverTriggerProps<T extends React.ElementType> = {
//   as?: T;
//   callback: (intersecting: boolean) => void;
// } & React.HTMLAttributes<HTMLDivElement>;

// function MainIntersectionObserverTrigger<T extends React.ElementType>({
//   as,
//   callback,
//   ...props
// }: MainIntersectionObserverTriggerProps<T> &
// // removing duplicate components from `as` Component based on the MainIntersectionObserverTriggerProps
//   Omit<
//   // This is to append the props from the `as` 
//     React.ComponentPropsWithRef<T>,
//     keyof MainIntersectionObserverTriggerProps<T>
//   >) {
//   const { ref } = useIntersectionObserverHook({
//     callback,
//   });
//   const Component = as || "div";
//   return <Component ref={ref} {...props} />;
// }

export default MainIntersectionObserverTrigger;
