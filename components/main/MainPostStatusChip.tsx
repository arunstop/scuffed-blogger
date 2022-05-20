import React, { ReactNode } from "react";

interface props {
  icon: ReactNode;
  title: string;
  color:string;
}

function MainPostStatusChip({ icon, title,color }: props) {
  return (
    <div className={`py-1 px-2 sm:px-3 inline-flex gap-1 sm:gap-2 rounded-full ${color} text-white bg-opacity-80`} title={title}>
      {icon}
      <span className="text-sm sm:text-base font-semibold">{title}</span>
    </div>
  );
}

export default MainPostStatusChip;
