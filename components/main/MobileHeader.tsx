import { ReactNode } from "react";
import { MdArrowBack } from "react-icons/md";

interface MobileHeaderProps {
  title: string;
  back?: () => void;
  actions?: { label: string; icon: ReactNode; action: () => void }[];
}
function MobileHeader({ title, back, actions }: MobileHeaderProps) {
  return (
    <div
      className="sm:hidden sticky inset-x-0 top-0 flex gap-2 justify-between items-center z-[1] bg-base-100/70 p-2 
       -mt-2 backdrop-blur-md animate-fadeInDown animate-duration-500"
    >
      <div className="flex gap-2">
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
        <span className="text-2xl font-bold">{title}</span>
      </div>
      {!!actions?.length && (
        <div className="flex gap-2">
          {actions.map((e, idx) => {
            return (
              <button
                key={idx}
                className="btn rounded-xl btn-sm btn-ghost text-2xl text-primary aspect-square p-0"
                onClick={e.action}
                title={e.label}
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
