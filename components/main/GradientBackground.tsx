import React from "react";

function GradientBackground({ className }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 z-[-1] h-[75%] bg-gradient-to-b 
      from-primary-focus/50  to-transparent
      ${className}
      `}
    ></div>
  );
}

export default GradientBackground;
