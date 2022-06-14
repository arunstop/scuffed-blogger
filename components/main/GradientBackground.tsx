import React from "react";

function GradientBackground({
  className,
  height = "75%",
}: {
  className?: string;
  height?: string;
}) {
  return (
    <div
      className={`absolute inset-0 z-[-1] bg-gradient-to-b 
      from-primary-focus/50  to-transparent pointer-events-none
      ${className||""}
      `}
      style={{
        height: height,
      }}
    ></div>
  );
}

export default GradientBackground;
