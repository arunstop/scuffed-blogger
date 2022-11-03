import React, { ReactNode } from "react";
import { MdClose } from "react-icons/md";
import { unblur } from "../../../app/helpers/UiHelpers";

function ModalImagePreview({ children }: { children: ReactNode }) {
  return (
    <a
      className="group relative isolate  flex  cursor-pointer overflow-hidden 
      transition-[width] duration-300 
      focus-within:fixed  focus-within:inset-0 focus-within:z-[100] 
      focus-within:aspect-auto focus-within:cursor-default focus-within:rounded-none  
      focus-within:p-2 focus-within:backdrop-blur-sm sm:focus-within:p-4
    "
      tabIndex={0}
    >
      <div
        className="absolute inset-0 group-focus-within:block hidden bg-black/60 animate-fadeIn"
        onClick={unblur}
      ></div>
      <button
        className="btn-primary btn-circle btn absolute right-0 top-0 z-[20] m-2 hidden 
      group-focus-within:inline-flex sm:m-4"
        onClick={() => {
          (document.activeElement as HTMLElement).blur();
        }}
      >
        <MdClose className="text-2xl text-white sm:text-3xl" />
      </button>
      {children}
    </a>
  );
}

export default React.memo(ModalImagePreview);
