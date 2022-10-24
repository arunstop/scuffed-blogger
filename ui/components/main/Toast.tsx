import React, { useCallback, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { UiToast } from "../../../base/data/contexts/UiTypes";
interface ToastProps {
  toast: UiToast;
  dispose: () => void;
}
const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    { toast: { id, label, action, onClose, duration = 5000 }, dispose },
    ref,
  ) => {
    const toastRef = useRef<HTMLDivElement | null>(null);

    const setRef = useCallback((node: HTMLDivElement | null) => {
      if (toastRef.current) return;
      toastRef.current = node;
    }, []);

    const autoClose = useRef<NodeJS.Timeout>();

    const disposeIn = useCallback((duration: number) => {
      autoClose.current = setTimeout(() => dispose(), duration);
    }, []);

    const handleMouseEnter = useCallback((ev: MouseEvent) => {
      clearTimeout(autoClose.current);
    }, []);

    const handleMouseLeave = useCallback(() => {
      disposeIn(2000);
    }, []);

    useEffect(() => {
      if (!toastRef.current) return;
      disposeIn(duration);
      const toastEl = toastRef.current;
      toastEl.addEventListener("mouseenter", handleMouseEnter);
      toastEl.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        clearTimeout(autoClose.current);
        toastEl.removeEventListener("mouseenter", handleMouseEnter);
        toastEl.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, [toastRef]);

    //   sdlfjdslfjdslfkj
    return (
      <div
        ref={setRef}
        className="flex animate-fadeInUp items-center gap-2 rounded-xl bg-primary/70 p-2 animate-duration-500 sm:gap-4 sm:p-4"
      >
        <div className="text-sm sm:text-base">{label}</div>

        {!!action && (
          <button
            className="btn-xs btn sm:btn-sm"
            onClick={() => action.action()}
          >
            {action.label}
          </button>
        )}
        <button
          className="btn-xs btn sm:btn-sm"
          onClick={() => {
            onClose?.();
            dispose();
          }}
        >
          <MdClose className="text-xl sm:text-2xl" />
        </button>
      </div>
    );
  },
);

Toast.displayName = "Toast";

export default Toast;
