import { capitalize } from "lodash";
import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import {
  MdCheck,
  MdClose,
  MdErrorOutline,
  MdInfoOutline,
} from "react-icons/md";
import { UiToast, UiToastType } from "../../../base/data/contexts/UiTypes";
interface ToastProps {
  toast: UiToast;
  dispose: () => void;
}

function getType(type: UiToastType): {
  bg: string;
  text: string;
  btn: string;
  border: string;
} {
  switch (type) {
    case "error": {
      return {
        bg: "bg-gradient-to-r from-error to-error/30",
        text: "text-error-content",
        btn: "btn-error border-error-content",
        border: "ring-2 ring-error/50",
      };
    }
    case "success": {
      return {
        bg: "bg-gradient-to-r from-success to-success/30",
        text: "text-success-content",
        btn: "btn-success border-success-content",
        border: "ring-2 ring-success/50",
      };
    }
    case "info": {
      return {
        bg: "bg-gradient-to-r from-info to-info/30",
        text: "text-info-content",
        btn: "btn-info border-info-content",
        border: "ring-2 ring-info/50",
      };
    }
    case "normal": {
      return {
        bg: "bg-gradient-to-r from-base-content to-base-content/30",
        text: "text-base-100",
        btn: "btn-primary border-primary-content",
        border: "ring-2 ring-base-content/50",
      };
    }
  }
}

function getIcon(type: UiToastType): ReactNode {
  switch (type) {
    case "error": {
      return <MdErrorOutline />;
    }
    case "success": {
      return <MdCheck />;
    }
    case "info": {
      return <MdInfoOutline />;
    }
    case "normal": {
      return <MdInfoOutline />;
    }
  }
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    { toast: { id, label, action, onClose, duration = 5000, type }, dispose },
    ref,
  ) => {
    const colors = getType(type || "normal");
    const icon = getIcon(type || "normal");

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

    const handleMouseLeave = useCallback((ev: MouseEvent) => {
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
        className={`flex flex-wrap  animate-fadeInUp items-center gap-1 sm:gap-2 rounded-xl animate-duration-500 p-2
        max-w-[90vw] sm:max-w-[36rem]  overflow-hidden bg-base-content/50 backdrop-blur-sm
        ${colors.border}
        `}
      >
        <div className={`absolute ${colors.bg} inset-0 z-[-1] `}></div>
        <div className="flex gap-1 sm:gap-2 max-w-[90%] items-center">
          <div className={`self-start text-2xl ${colors.text}`}>{icon}</div>
          <div
            className={`text-sm sm:text-base line-clamp-3 ${colors.text} font-semibold`}
          >
            {capitalize(label)}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {!!action && (
            <div
              className={`btn-xs btn sm:btn-sm  ${colors.btn} max-w-[12rem] sm:max-w-[18rem] `}
              onClick={() => {
                action.action();
                dispose();
              }}
            >
              <span className="line-clamp-1 my-auto">
                {capitalize(action.label)}
              </span>
            </div>
          )}
          <button
            className={`btn-xs btn sm:btn-sm  btn-outline text-base-100 hover:bg-base-100 hover:text-base-content`}
            onClick={() => {
              onClose?.();
              dispose();
            }}
          >
            <MdClose className="text-xl sm:text-2xl" />
          </button>
        </div>
      </div>
    );
  },
);

Toast.displayName = "Toast";

export default Toast;
