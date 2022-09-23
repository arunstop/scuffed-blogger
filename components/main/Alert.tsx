import React, { ReactNode } from "react";
type AlertProps = {
  //   value?: boolean;
  //   closeable: true;
  actions?: {
    label: string;
    icon?: ReactNode;
    className?: string;
    action: () => void;
  }[];
};
type Props = React.HTMLAttributes<HTMLDivElement> & AlertProps;
// adding `closeable` prop  to activate the overload
//   | (React.HTMLAttributes<HTMLDivElement> & { closeable: boolean });
const Alert = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { className = "", children, actions } = props;
  // if(params.onClose)
  //   const [value,setValue] = useState(props.value);
  return (
    <div
      {...props}
      ref={ref}
      className={` relative flex gap-2 sm:gap-4 sm:items-center
        rounded-xl bg-primary/30 p-4 justify-between
         flex-col sm:flex-row
        ${className}
        `}
    >
      <div className="flex-1 text-sm font-semibold sm:text-base">
        {children}
      </div>
      {actions && (
        <div className="flex  gap-2 sm:gap-4 flex-col sm:flex-row w-full sm:w-auto px-4 sm:px-0">
          {actions.map((e, idx) => (
            <button
              key={idx}
              className={`btn btn-sm ${e.className}`}
              onClick={e.action}
            >
              {e.icon}
              <span className="font-bold">{e.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
Alert.displayName = "Alert";
export default Alert;
