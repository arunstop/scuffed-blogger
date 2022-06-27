import React, { ReactNode } from "react";
import { MdClose } from "react-icons/md";
import { BreakpointTypes } from "../../utils/data/UI";
import { getScalingInput, getScalingInputIcon, getScalingInputClearIcon, getScalingIcon } from "../../utils/helpers/InputStyleHelpers";

type MainTextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  clearable?: boolean;
  clearIcon?: boolean;
  clearAction?: () => void;
  icon?: ReactNode;
  scaleTo?: BreakpointTypes;
};
function MainTextInput({
  icon,
  clearable = false,
  clearIcon = false,
  clearAction = () => {},
  type = "text",
  className = "",
  scaleTo = "md",
  ...props
}: MainTextInputProps) {
  return (
    <label
      className={`input-group-sm input-group relative rounded-xl sm:input-group-md`}
    >
      <input
        {...props}
        type={type}
        className={`peer input w-full !rounded-xl
        !outline !outline-base-content/100 !outline-1 !outline-offset-0
        focus:!outline-[2px] sm:focus:!outline-[3px] focus:z-[2] focus:border-transparent 
        focus:valid:!outline-base-content transition-all duration-300 
        font-semibold invalid:text-error focus:invalid:!outline-error
        placeholder-shown:!outline-base-content/20 invalid:!outline-error
        invalid:!outline-dashed placeholder-shown:!outline-dashed
        bg-base-100
        ${getScalingInput(scaleTo)}
        ${icon ? getScalingInputIcon(scaleTo) : ""}
        ${clearIcon ? getScalingInputClearIcon(scaleTo) : ""}
        ${className}
        `}
      />
      {icon && (
        <span
          className={`duration-[600ms] absolute inset-y-0 left-0 z-[2] 
          justify-center bg-transparent p-0  transition-all 
          peer-focus:text-base-content/100 
          peer-focus:rotate-[360deg] peer-invalid:text-error peer-focus:peer-invalid:text-error 
          peer-placeholder-shown:text-base-content/50 
          peer-placeholder-shown:peer-invalid:text-base-content/50
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
  );
}

export default MainTextInput;
