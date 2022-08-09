import { Transition } from "@headlessui/react";
import React, { ReactNode } from "react";
import { MdClose } from "react-icons/md";
import { BreakpointTypes } from "../../utils/data/UI";
import {
  getScalingIcon,
  getScalingInput,
  getScalingInputClearIcon,
  getScalingInputIcon,
} from "../../utils/helpers/InputStyleHelpers";
import { transitionScaleY } from "../../utils/helpers/UiTransitionHelpers";

type InputTextProps = React.InputHTMLAttributes<HTMLInputElement> & {
  clearable?: boolean;
  clearIcon?: boolean;
  clearAction?: () => void;
  icon?: ReactNode;
  scaleTo?: BreakpointTypes;
  error?: boolean;
  errorMsg?: string;
  label?: string;
};

const InputText = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<InputTextProps>
>(
  (
    {
      icon,
      clearable = false,
      clearIcon = false,
      clearAction = () => {},
      type = "text",
      className = "",
      scaleTo = "md",
      error = false,
      errorMsg = "",
      label,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex w-full flex-col gap-1 sm:gap-2">
      {/* LABEL */}
        {label && (
          <span className={`text-base sm:text-lg ${!error ? "" : "text-error"} font-semibold`}>
            {label}
          </span>
        )}
        <label
          className={`input-group-sm input-group relative rounded-xl sm:input-group-md`}
        >
          {/* INPUT */}
          <input
            ref={ref}
            {...props}
            type={type}
            className={`peer input w-full !rounded-xl
            !outline !outline-1 !outline-offset-0
            transition-all duration-300 font-semibold bg-base-100
            focus:!outline-[2px] sm:focus:!outline-[3px] focus:z-[2] focus:border-transparent 
            placeholder-shown:!outline-dashed
            ${
              !error
                ? "focus:!outline-base-content placeholder-shown:!outline-base-content/20"
                : "text-error !outline-error !outline-dashed"
            }
          ${getScalingInput(scaleTo)}
          ${icon ? getScalingInputIcon(scaleTo) : ""}
          ${clearIcon ? getScalingInputClearIcon(scaleTo) : ""}
          ${className}
          `}
            placeholder={props.placeholder || ". . . ."}
          />
          {/* ICON */}
          {icon && (
            <span
              className={`duration-[600ms] absolute inset-y-0 left-0 z-[2] 
            justify-center bg-transparent p-0  transition-all 
            peer-focus:rotate-[360deg]  
            
            ${
              !error
                ? "peer-focus:text-base-content/100 peer-placeholder-shown:text-base-content/50"
                : "text-error"
            }
            ${getScalingIcon(scaleTo)}
            `}
            >
              {icon}
            </span>
          )}
          {/* CLEAR ICON */}
          {clearIcon && (
            <span
              className={`btn btn-ghost absolute inset-y-0 right-0 z-[2] btn-sm sm:btn-md
              w-9 !rounded-xl bg-transparent !p-0 text-xl sm:w-12 sm:!text-2xl
              !max-h-auto !h-full
              ${clearable ? "visible" : "invisible"}
              `}
              onClick={clearAction}
            >
              <MdClose />
            </span>
          )}
        </label>
        {/* ERROR MESSAGE */}
        <Transition
          show={!!errorMsg}
          appear
          {...transitionScaleY({
            enter: "origin-top",
          })}
          as={"div"}
          className={`text-sm sm:text-base text-error font-semibold ${
            icon ? "pl-9 sm:pl-12" : "px-2"
          }`}
        >
          {errorMsg}
        </Transition>
      </div>
    );
  },
);

InputText.displayName = "InputText";

export default InputText;
