import { MdArrowBack } from "react-icons/md";

function MobileHeader({
  title,
  back,
}: {
  title: string;
  back: () => void;
}) {
  return (
    <div
      className="sm:hidden sticky inset-x-0 top-0 flex gap-2 items-center z-[1] bg-base-300/90 p-2 
       border-b-2 border-primary-content/10 -mt-2"
    >
      {back && (
        <button
          className="btn btn-circle btn-ghost self-start min-h-0 !h-9 !w-9"
          onClick={() => {
            back?.();
          }}
        >
          <MdArrowBack className="text-3xl text-primary" />
        </button>
      )}
      <span className="text-2xl font-bold">{title}</span>
    </div>
  );
}

export default MobileHeader;
