import { Transition } from "@headlessui/react";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { MdWorkspaces } from "react-icons/md";
import { NetworkResponseStatus } from "../../utils/data/Main";
import { transitionPullV } from "../../utils/helpers/UiTransitionHelpers";

// INTERFACES
export interface StatusPlaceholderAction {
  label: string;
  callback: () => void;
}

export interface StatusPlaceholderProps {
  title: string;
  desc: string;
  status: NetworkResponseStatus;
  actions?: StatusPlaceholderAction[];
}

interface StatusPlaceholderStylingProps {
  gradientVia: string;
  gradientViaDark: string;
  textColor: string;
}

// getting the required styling for each status
function getStyle(
  status: NetworkResponseStatus | undefined,
): StatusPlaceholderStylingProps {
  if (status === "error")
    return {
      gradientVia: "via-error/40",
      gradientViaDark: "dark:via-error/20",
      textColor: "text-error",
    };

  if (status === "success")
    return {
      gradientVia: "via-success/40",
      gradientViaDark: "dark:via-success/20",
      textColor: "text-success",
    };
  else
    return {
      gradientVia: "via-primary/40",
      gradientViaDark: "dark:via-primary/20",
      textColor: "text-primary",
    };
}

const StatusPlaceholder = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<StatusPlaceholderProps>
>(({ title, desc, status, actions }, ref) => {
  const style = getStyle(status);
  const newKey = title;
  return (
    <Transition
      appear
      show
      as={"div"}
      className={"transition-all duration-500"}
      key={newKey}
      {...transitionPullV({
        enter: "absolute inset-x-0 w-full",
        entered: "absolute inset-x-0",
        leave: "absolute inset-x-0 w-full",
      })}
    >
      <div
        ref={ref}
        className={`mx-auto my-4 flex min-w-[50%] flex-col w-full 
      items-center justify-center gap-2 rounded-[10%] bg-gradient-to-r
      from-transparent ${style.gradientVia} ${style.gradientViaDark} 
      to-transparent py-2 px-4 pb-4 text-center  sm:my-8 sm:max-w-2xl
      sm:gap-4 sm:py-4 sm:px-8 `}
      >
        <Transition.Child
          enter="transform transition duration-1000"
          enterFrom="opacity-0 rotate-[-120deg] scale-50"
          enterTo="opacity-100 rotate-0 scale-100"
        >
          {status === "error" && (
            <IoMdCloseCircle
              className={`text-[4rem] sm:text-[5rem] animate-pulse ${style.textColor}`}
            />
          )}
          {status === "success" && (
            <FaCheckCircle
              className={`text-[4rem] sm:text-[5rem] animate-pulse ${style.textColor}`}
            />
          )}
          {status === "loading" && (
            <MdWorkspaces
              className={`animate-spin text-[4rem] ${style.textColor} sm:text-[5rem]`}
            />
          )}
        </Transition.Child>

        <p className="flex flex-col gap-1 text-center sm:gap-2">
          <span className="text-2xl font-black sm:text-3xl">{title}</span>
          <span className="text-sm font-semibold sm:text-base whitespace-pre-line">
            {desc}
          </span>
        </p>
        {actions && actions.length && (
          <div
            key={newKey}
            className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4"
          >
            {actions.map((e, idx) => (
              <Transition.Child
                key={idx}
                enter={`transform transition duration-500`}
                enterFrom="opacity-50 scale-0"
                enterTo="opacity-100 scale-100"
                style={{ transitionDelay: `${idx * 200 + 500}ms` }}
              >
                <button className=" --btn-resp btn !min-w-[6rem]" onClick={e.callback}>
                  {e.label}
                </button>
              </Transition.Child>
            ))}
          </div>
        )}
      </div>
    </Transition>
  );
});

StatusPlaceholder.displayName = "StatusPlacholder";

export default StatusPlaceholder;
