import React, { ReactNode } from "react";
import { MdClose } from "react-icons/md";

type MainInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  clearable?: boolean;
  clearIcon?: boolean;
  clearAction?: () => void;
  icon?: ReactNode;
};

function MainInput({
  icon,
  clearable = false,
  clearIcon = false,
  clearAction = () => {},
  type = "text",
  ...props
}: MainInputProps) {
  return (
    <label className="input-group-sm input-group relative rounded-xl sm:input-group-md">
      <input
        {...props}
        type={type}
        className={`peer input-bordered input input-md w-full !rounded-xl
        !outline-offset-0 focus:z-[2] focus:border-base-content 
        focus:!outline-base-content
        ${icon ? "pl-9 sm:pl-12" : ""}
        ${clearIcon ? "pr-9 sm:pr-12" : ""}
        `}
      />
      {icon && (
        <span
          className="absolute inset-y-0 left-0 z-[2] w-9 justify-center
        bg-transparent p-0 text-xl sm:w-12 sm:text-2xl"
        >
          {icon}
        </span>
      )}

      {clearIcon && (
        <span
          className={`btn btn-ghost absolute inset-y-0 right-0 z-[2] 
          w-9 !rounded-xl bg-transparent p-0 text-xl sm:w-12 sm:text-2xl
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

export default MainInput;
