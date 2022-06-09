import React, { ReactNode } from "react";
import { MdClose } from "react-icons/md";

type MainTextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  clearable?: boolean;
  clearIcon?: boolean;
  clearAction?: () => void;
  icon?: ReactNode;
};

function MainTextInput({
  icon,
  clearable = false,
  clearIcon = false,
  clearAction = () => {},
  type = "text",
  ...props
}: MainTextInputProps) {
  return (
    <label className="h-9 sm:h-12 input-group-sm input-group relative rounded-xl sm:input-group-md">
      <input
        {...props}
        type={type}
        className={`peer input input-sm sm:input-md w-full !rounded-xl
        !outline !outline-base-content/100 !outline-1 !outline-offset-0
        focus:!outline-[3px] focus:z-[2] focus:border-transparent 
        focus:valid:!outline-base-content transition-all duration-300 
        font-semibold invalid:text-error focus:invalid:!outline-error
        placeholder-shown:!outline-base-content/20 invalid:!outline-error
        ${icon ? "pl-9 sm:pl-12" : ""}
        ${clearIcon ? "pr-9 sm:pr-12" : ""}
        `}
      />
      {icon && (
        <span
          className={`duration-[600ms] absolute inset-y-0 left-0 z-[2] w-9
          justify-center bg-transparent p-0 text-xl transition-all peer-focus:scale-125 
          peer-focus:text-base-content/100 sm:w-12 sm:text-2xl 
          peer-focus:rotate-[360deg] peer-invalid:text-error peer-focus:peer-invalid:text-error 
          peer-placeholder-shown:text-base-content/50 
          peer-placeholder-shown:peer-invalid:text-base-content/50
          `}
        >
          {icon}
        </span>
      )}

      {clearIcon && (
        <span
          className={`btn btn-ghost absolute inset-y-0 right-0 z-[2] btn-sm sm:btn-md
          w-9 !rounded-xl bg-transparent !p-0 text-xl sm:w-12 sm:!text-2xl
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
