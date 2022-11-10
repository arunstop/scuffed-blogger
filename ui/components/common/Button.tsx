import React, { useState } from "react";
import { MdWorkspaces } from "react-icons/md";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    loadingOnClick?: boolean;
  }
>(({ className, loadingOnClick, onClick, children, ...props }, ref) => {
  const [loading, setLoading] = useState(false);
  return (
    <button
      ref={ref}
      className={`btn ${className}`}
      onClick={(ev) => {
        if (loadingOnClick && !loading) setLoading(true);
        onClick?.(ev);
      }}
      {...props}
    >
      {loading ? (
        <MdWorkspaces className="animate-twSpin animate-infinite " />
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
