import React, { ReactNode } from "react";
export interface DropdownOption {
  icon?: ReactNode;
  label: string;
  action?: () => void;
}

function Dropdown({
  options,
  ...props
}: { options: DropdownOption[] } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, children } = { ...props };
  return (
    <div {...props} className={`dropdown ${className}`}>
      {children}
      {!!options.length && (
        <ul
          tabIndex={0}
          className="dropdown-content menu !z-[1] w-52 rounded-xl bg-base-300 p-2 text-sm
          font-bold ring-[1px] ring-base-content/10 sm:text-base [&_a]:!rounded-xl"
        >
          {options.map((e, idx) => {
            return (
              <li key={idx}>
                <a
                  onClick={() => {
                    e.action?.();
                    (document.activeElement as HTMLElement).blur();
                  }}
                >
                  {e.label}
                </a>
              </li>
            );
          })}
          <li>
            <a onClick={() => (document.activeElement as HTMLElement).blur()}>
              Cancel
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
