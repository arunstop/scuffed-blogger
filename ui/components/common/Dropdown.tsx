import React, {
  ReactNode,
  useCallback, useState
} from "react";
export interface DropdownOption {
  icon?: ReactNode;
  label: string;
  confirmation?: DropdownOptionConfirmation;
  action?: () => void;
}

export interface DropdownOptionConfirmation {
  title: string;
  desc: string;
}

function Dropdown({
  options,
  ...props
}: {
  options: DropdownOption[];
} & React.HTMLAttributes<HTMLDivElement>) {
  const [confirmation, setConfirmation] = useState<DropdownOption>();
  const { className, children } = { ...props };

  const blur = useCallback(
    () => (document.activeElement as HTMLElement).blur(),
    [],
  );
  const clearConfirmation = useCallback(() => {
    setConfirmation(undefined);
  }, []);
  

  // useEffect(() => {
  //   console.log(triggerRef.current?.innerHTML);
  //   return () => {};
  // }, [triggerRef.current]);

  return (
    <div {...props} className={`dropdown ${className}`}>
      <div  tabIndex={0} onFocus={()=>clearConfirmation()}>
        {children}
      </div>
      {!!options.length && (
        <ul
          tabIndex={0}
          className={`dropdown-content menu !z-[1]  rounded-xl bg-base-300 p-2 text-sm
          font-bold ring-[1px] ring-base-content/10 sm:text-base [&_a]:!rounded-xl relative 
          max-w-[95vw]
          ${confirmation ? `w-[20rem] !transition-all !duration-200` : `w-[12rem]`}
          `}
        >
          {options.map((e, idx) => {
            return confirmation?.label === e.label ? (
              <OptionConfirmation
                key={idx}
                show={!!confirmation}
                option={confirmation}
                cancel={clearConfirmation}
              />
            ) : (
              <li key={idx}>
                <a
                  onClick={() => {
                    if (e.confirmation) return setConfirmation(e);
                    e.action?.();
                    blur();
                  }}
                >
                  {e.label}
                </a>
              </li>
            );
          })}
          <li>
            <a
              onClick={() => {
                blur();
                clearConfirmation();
              }}
            >
              Cancel
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}

function OptionConfirmation({
  option,
  cancel,
}: {
  option: DropdownOption;
  show: boolean;
  cancel: () => void;
}) {
  if (!option.confirmation) return <></>;
  const {
    confirmation: { title, desc },
  } = option;
  return (
    <div className="flex flex-col p-2 sm:p-4 gap-2 sm:gap-4 rounded-lg bg-primary/30 mb-2 sm:mb-4">
      <span className="text-lg sm:text-xl text-center">{title || "Confirmation"}</span>
      <span className="text-sm sm:text-base text-center">{desc || "Are you sure?"}</span>
      {/*using <button> instead of <a> makes the dropdown-content unblur */}
      <a className="btn btn-primary btn-xs sm:btn-sm flex-1" onClick={option.action}>Ok</a>
      <a className="btn  btn-xs sm:btn-sm flex-1" onClick={cancel}>
        Cancel
      </a>
    </div>
  );
}

export default Dropdown;
