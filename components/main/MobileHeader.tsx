import { ReactNode } from "react";
import { MdArrowBack } from "react-icons/md";
import { scrollToTop } from "../../utils/hooks/RouteChangeHook";

export interface MobileHeaderActionProps {
  label: string;
  icon: ReactNode;
  action: () => void;
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
      className="sm:hidden sticky inset-x-0 top-0 flex gap-2 justify-between items-center z-[10] bg-base-100/70 p-2 
       -mt-2 backdrop-blur-md animate-fadeInDown animate-duration-500"
    >
      <div className="flex gap-2 items-center">
        {back && (
          <button
            className="btn rounded-xl btn-sm btn-ghost text-2xl text-primary aspect-square p-0 self-start"
            onClick={() => {
              back?.();
            }}
          >
            <MdArrowBack className="text-3xl text-primary" />
          </button>
        )}
        <span
          className={`text-2xl font-bold ${toTop ? `cursor-pointer` : ``}`}
          onClick={() => toTop?.() || scrollToTop(true)}
        >
          {title}
        </span>
      </div>
      {!!actions?.length && (
        <div className="flex gap-2 items-center">
          {actions.map((e, idx) => {
            return (
              <button
                key={idx}
                className={`btn rounded-xl btn-sm  text-2xl  aspect-square p-0
                ${e.disabled ? "!bg-opacity-10" : "btn-ghost text-primary"}`}
                onClick={e.disabled ? undefined : e.action}
                title={e.label}
                disabled={e.disabled}
              >
                {e.icon}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MobileHeader;
