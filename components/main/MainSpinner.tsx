import React from "react";

function MainSpinner() {
  return (
    <div className="inline-flex flex-nowrap animate-pulse">
      {/* <span className="animate-[bounce_1s_ease-in-out_0.4s_infinite] text-5xl font-black "> */}
      <span className="animate-[bounce_1s_ease-in-out_0.0s_infinite_backwards] text-5xl font-black ">
        &middot;
      </span>
      <span className="animate-[bounce_1s_ease-in-out_0.2s_infinite_backwards] text-5xl font-black ">
        &middot;
      </span>
      <span className="animate-[bounce_1s_ease-in-out_0.4s_infinite_backwards] text-5xl font-black ">
        &middot;
      </span>
    </div>
  );
}

export default MainSpinner;
