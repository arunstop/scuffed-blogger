import { Transition } from "@headlessui/react";
import React, { Fragment, ReactNode } from "react";

interface MainContainerProps {
  className?: string;
  children: ReactNode;
}
function MainContainer({ className, children }: MainContainerProps) {
  return (
    <Transition
      as={Fragment}
      appear
      show={true}
      enter="ease-out transition-all fixed top-0 inset-x-0 duration-300 origin-top"
      enterFrom="opacity-0 translate-y-[20%] scale-x-150"
      enterTo="opacity-100 translate-y-0 scale-x-100"
      leave="ease-in transition-all fixed top-0 inset-x-0 duration-300 origin-top"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-150"
    >
      <div
        className={`mx-auto flex min-h-screen max-w-[60rem] 
      flex-col justify-start gap-4 bg-base-100 p-4 relative
      sm:gap-8 sm:p-8 overflow-hidden rounded-xl
      transition-colors duration-500
      ${className}
      `}
      >
        {children}
      </div>
    </Transition>
  );
}

export default MainContainer;
