import React, { ReactNode } from "react";
import { MdClose } from "react-icons/md";
import { BreakpointTypes } from "../../utils/data/UI";
import {
  getScalingInput,
  getScalingInputIcon,
  getScalingInputClearIcon,
  getScalingIcon,
} from "../../utils/helpers/InputStyleHelpers";

type MainTextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  clearable?: boolean;
  clearIcon?: boolean;
  clearAction?: () => void;
  icon?: ReactNode;
  scaleTo?: BreakpointTypes;
  error?: boolean;
  errorMsg?: string;
};

const MainTextInput = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<MainTextInputProps>
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
      ...props
    },
    ref,
  ) => {
    return (
      <div className="w-full flex-col">
        <label
          className={`input-group-sm input-group relative rounded-xl sm:input-group-md`}
        >
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
                ? "!outline-base-content/20 focus:!outline-base-content"
                : "text-error !outline-error !outline-dashed"
            }
          ${getScalingInput(scaleTo)}
          ${icon ? getScalingInputIcon(scaleTo) : ""}
          ${clearIcon ? getScalingInputClearIcon(scaleTo) : ""}
          ${className}
          `}
            placeholder={props.placeholder || ". . . ."}
          />
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
        {!!errorMsg && (
          <span className=" text-sm sm:text-base text-error pl-9 sm:pl-12">
            {errorMsg}
          </span>
        )}
      </div>
    );
  },
);

MainTextInput.displayName = "MainTextInput";

export default MainTextInput;
