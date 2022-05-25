import React, { ReactNode } from "react";

function MainContainer({ children }: { children: ReactNode }) {
  return (
    <div
      className="mx-auto flex min-h-screen max-w-[60rem] 
  flex-col justify-start gap-4 bg-base-100 p-4
  sm:gap-8 sm:p-8"
    >{children}</div>
  );
}

export default MainContainer;
