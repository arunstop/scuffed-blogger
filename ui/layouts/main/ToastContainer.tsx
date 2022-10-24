import React, { useCallback } from "react";
import { useUiCtx } from "../../../app/contexts/ui/UiHook";
import Toast from "../../components/main/Toast";

function ToastContainer() {
  const { uiStt, uiAct } = useUiCtx();
  const disposeToast = useCallback((id: string) => uiAct.removeToast(id), []);
  console.log("rendering toast container");
  return (
    <div className="fixed inset-x-0 bottom-0 flex pointer-events-none [&>*]:pointer-events-auto justify-center">
      <div className="flex flex-col p-2 sm:p-4 rounded-xl bg-red-500/30">
        <button
          className="btn"
          onClick={() =>
            uiAct.addToast({
              id: Math.random() + "",
              label: "something",
              action: {
                label: "Do something",
                action: () => {
                  console.log("toast clicked");
                },
              },
              onClose: () => {},
            })
          }
        >
          button
        </button>
        <button className="btn" onClick={() => uiAct.clearToasts()}>
          clear
        </button>
        <div className="flex flex-col-reverse gap-2 sm:gap-2">
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
