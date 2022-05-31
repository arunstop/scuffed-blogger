import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useUiCtx } from "../../utils/contexts/ui/UiHook";

const ArticleCommentModalReply = React.memo(
  function ArticleCommentModalReply() {
    const [reply, setReply] = useState("");

    const { uiStt, uiAct } = useUiCtx();
    function closeModal() {
      uiAct.setReplyingCommentId(null);
      setReply("");
    }

    return (
      <Transition appear show={uiStt.replyingCommentId !== null} as={Fragment}>
        <Dialog
          as="div"
          className="modal modal-bottom !pointer-events-auto !visible !bg-opacity-0 !opacity-100 sm:modal-middle"
          onClose={closeModal}
        >
          {/*  */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-base-content bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-[1.25]"
            enterTo="opacity-100 translate-y-0 sm:translate-y-0 sm:scale-[1.00]"
            leave="ease-in duration-300"
            leaveFrom="opacity-100 translate-y-0 sm:translate-y-0 sm:scale-[1.00]"
            leaveTo="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-[0.75]"
          >
            <Dialog.Panel className="w-full sm:w-auto">
              <div className="modal-box flex w-full !translate-y-0 !scale-[1] flex-col gap-4 sm:w-[48rem] sm:gap-8 relative">
              <div className="absolute ">
              </div>
                <Dialog.Title as="div" className="">
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-2xl font-bold">Replying...</span>
                    <span
                      className="btn-outline btn border-2"
                      title="Cancel"
                      onClick={closeModal}
                    >
                      <FaTimes className="text-2xl" />
                    </span>
                  </div>
                </Dialog.Title>
                <div className="form-control flex-1 gap-4 rounded-xl sm:gap-8">
                  <textarea
                    className="textarea-bordered textarea h-24 max-h-[18rem] min-h-[12rem] rounded-xl text-base"
                    placeholder="Add a comment..."
                    value={reply}
                    onChange={(ev) => setReply(ev.target.value)}
                  />
                  <div className="flex w-full justify-end gap-4">
                    {reply.length !== 0 && (
                      <button
                        className="btn-outline btn ml-auto w-24 border-2 text-lg 
                        font-bold normal-case opacity-80 hover:opacity-100 sm:w-36 sm:text-xl"
                        onClick={() => {
                          setReply("");
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      className={`flex-1 sm:flex-none font-bold btn btn-primary 
                        normal-case text-xl sm:w-48 ${
                          reply.length !== 0 ? "" : "btn-disabled"
                        }`}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    );
  },
);

export default ArticleCommentModalReply;
