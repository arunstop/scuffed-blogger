import { ReactNode } from "react";
import { MdArrowBack } from "react-icons/md";
import { scrollToTop } from "../../../app/hooks/RouteChangeHook";
import Dropdown, { DropdownOption } from "./Dropdown";

export interface MobileHeaderActionProps {
  label: string;
  icon: ReactNode;
  action?: () => void;
  options?: DropdownOption[];
  disabled?: boolean;
}

interface MobileHeaderProps {
  title: string;
  back?: () => void;
  actions?: MobileHeaderActionProps[];
  // if undefined then scroll the main content to top
  toTop?: () => void;
}
function MobileHeader({ title, back, actions, toTop }: MobileHeaderProps) {
  return (
    <div
      className="sticky inset-x-0 top-0 z-[10] -mt-2 flex animate-fadeInDown items-center justify-between gap-2 bg-base-100/70 
       p-2 backdrop-blur-md animate-duration-500 sm:hidden"
    >
      <div className="flex items-center gap-1">
        {back && (
          <button
            className="btn-ghost btn-sm btn aspect-square self-start rounded-xl p-0 text-2xl text-primary"
            onClick={() => {
              back?.();
            }}
          >
            <MdArrowBack className="text-3xl text-primary" />
          </button>
        )}
        <span
          className={`text-xl font-bold cursor-pointer`}
          onClick={() => (toTop ? toTop() : scrollToTop(true))}
        >
          {title}
        </span>
      </div>
      {!!actions?.length && (
        <div className="flex items-center gap-2">
          {actions.map((e, idx) => {
            return (
              <Dropdown key={idx} options={e.options || []} className="dropdown-end">
                <button
                  tabIndex={0}
                  className={`btn rounded-xl btn-sm  text-2xl  aspect-square p-0
                  ${e.disabled ? "!bg-opacity-10" : "btn-ghost text-primary"}`}
                  onClick={e.disabled ? undefined : e.action}
                  title={e.label}
                  disabled={e.disabled}
                >
                  {e.icon}
                </button>
              </Dropdown>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MobileHeader;
