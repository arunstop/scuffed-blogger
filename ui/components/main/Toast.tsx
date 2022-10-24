import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { UiToast } from "../../../base/data/contexts/UiTypes";

function Toast({
  toast: { id, label, action, onClose },
  dispose,
}: {
  toast: UiToast;
  dispose: () => void;
}) {
  useEffect(() => {
    const duration = setTimeout(() => dispose(),5000);
    return () => {
        clearTimeout(duration);
    };
  }, []);

//   sdlfjdslfjdslfkj
  return (
    <div className="flex p-2 sm:p-4 items-center gap-2 sm:gap-4 bg-primary/70 rounded-xl">
      <div className="text-sm sm:text-base">{label}</div>
      <button
        className="btn btn-xs sm:btn-sm"
        onClick={() => {
          onClose?.();
          dispose();
        }}
      >
        <MdClose className="text-xl sm:text-2xl" />
      </button>
    </div>
  );
}

export default Toast;
