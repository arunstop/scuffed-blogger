import React from "react";

type MainTextAreaInputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> 
// & {
//   clearable?: boolean;
//   clearIcon?: boolean;
//   clearAction?: () => void;
//   icon?: ReactNode;
// }
;

function MainTextAreaInput({
  // icon,
  // clearable = false,
  // clearIcon = false,
  // clearAction = () => {},
  ...props
}: MainTextAreaInputProps) {
  return (
    <label
      className={`input-group-sm input-group relative rounded-xl sm:input-group-md`}
    >
      <textarea
        {...props}
        className={`peer textarea w-full !rounded-xl text-sm md:text-base
        !outline !outline-base-content/100 !outline-1 !outline-offset-0
        focus:!outline-[2px] sm:focus:!outline-[3px] focus:z-[2] focus:border-transparent 
        focus:valid:!outline-base-content transition-[outline,colors] duration-300 
        font-semibold invalid:text-error focus:invalid:!outline-error
        placeholder-shown:!outline-base-content/20 invalid:!outline-error
        invalid:!outline-dashed placeholder-shown:!outline-dashed
        px-2 md:px-4 py-1 md:py-2
        ${props.className}
        `}
      />
    </label>
  );
}

export default MainTextAreaInput;