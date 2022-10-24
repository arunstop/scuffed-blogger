import React, { useCallback } from "react";
import { useUiCtx } from "../../../app/contexts/ui/UiHook";
import Toast from "../../components/main/Toast";

function ToastContainer() {
  const { uiStt, uiAct } = useUiCtx();
  const disposeToast = useCallback((id: string) => uiAct.removeToast(id), []);
  console.log("rendering toast container");
  return (
    <div className="fixed inset-x-0 bottom-0 flex justify-center mb-[3rem] sm:mb-0 pointer-events-none z-[101]">
      <div className="flex flex-col p-2 sm:p-4 rounded-xl pointer-events-none [&>*]:pointer-events-auto">
        {/* <button
          className="btn"
          onClick={() =>
            uiAct.addToast({
              id: Math.random() + "",
              label: "Something that was happening is not happening anymore, aka it's done. When it's done. it won't happen again, or will it?",
              action: {
                label: "Do something",
                action: () => {
                  console.log("toast clicked");
                },
              },
              type:"normal",
              onClose: () => {},
            })
          }
        >
          button
        </button>
        <button className="btn" onClick={() => uiAct.clearToasts()}>
          clear
        </button> */}
        <div className="flex flex-col-reverse gap-2 sm:gap-2 items-center">
          {uiStt.toasts.map((e) => {
            return (
              <Toast key={e.id} toast={e} dispose={() => disposeToast(e.id)} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ToastContainer);
