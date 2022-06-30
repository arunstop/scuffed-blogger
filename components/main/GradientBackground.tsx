import React from "react";

const GradientBackground = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    className?: string;
    height?: string;
  }>
>(({ className, height = "75%" }, ref) => {
  return (
    <div
      ref={ref}
      className={`absolute inset-0 z-[-1] bg-gradient-to-b 
      from-primary-focus/50  to-transparent pointer-events-none
      ${className || ""}
      `}
      style={{
        height: height,
      }}
    ></div>
  );
});

GradientBackground.displayName = "GradientBackground";

export default GradientBackground;
