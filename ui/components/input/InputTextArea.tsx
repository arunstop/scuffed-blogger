import { Transition } from "@headlessui/react";
import React from "react";
import { transitionScaleY } from "../../../app/helpers/UiTransitionHelpers";

type InputTextArea =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    // clearable?: boolean;
    // clearIcon?: boolean;
    // clearAction?: () => void;
    // icon?: ReactNode;
    error?: boolean;
    errorMsg?: string;
    label?: string;
  };

const InputTextArea = React.forwardRef<
  HTMLTextAreaElement,
  InputTextArea
>(({ label, error, errorMsg, ...props }, ref) => {
  return (
    <div className="flex w-full flex-col gap-1 sm:gap-2">
      {label && <span className={`text-md sm:text-lg ${!error ? "" : "text-error"} font-semibold`}>{label}</span>}
      <label
        className={`input-group-sm input-group relative rounded-xl sm:input-group-md`}
      >
        <textarea
          ref={ref}
          {...props}
          className={`peer textarea w-full !rounded-xl text-sm md:text-base
        !outline !outline-1 !outline-offset-0
        focus:!outline-[2px] sm:focus:!outline-[3px] focus:z-[2] focus:border-transparent 
        duration-300 transition-[outline,background-color,border-color,text-decoration-color,fill,stroke] 
        font-semibold px-2 md:px-4 py-1 md:py-2
        placeholder-shown:!outline-dashed
        ${
          !error
            ? "focus:!outline-base-content placeholder-shown:!outline-base-content/20"
            : "text-error !outline-error !outline-dashed"
        }
        ${props.className}
        `}
          placeholder={props.placeholder || ". . . ."}
        />
      </label>
      {/* ERROR MESSAGE */}
      <Transition
        show={!!errorMsg}
        appear
        {...transitionScaleY({
          enter: "origin-top",
        })}
        as={"div"}
        className={`text-sm sm:text-base text-error font-semibold px-2`}
      >
        {errorMsg}
      </Transition>
    </div>
  );
});

InputTextArea.displayName = "InputTextArea";

export default InputTextArea;
