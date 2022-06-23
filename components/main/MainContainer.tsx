import React, { ReactNode } from "react";

interface MainContainerProps{
  className?:string; 
  children: ReactNode ;
}
function MainContainer({ className, children }: MainContainerProps) {
  return (
    <div
      className={`mx-auto flex min-h-screen max-w-[60rem] 
      flex-col justify-start gap-4 bg-base-100 p-4 relative
      sm:gap-8 sm:p-8 overflow-hidden rounded-xl
      transition-colors duration-500
      ${className}
      `}
    >{children}</div>
  );
}

export default MainContainer;
