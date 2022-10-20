import {
  ModalActionAction
} from "./ModalActionTemplate";

function ModalActionItem(
  props: ModalActionAction & {
    action?: () => void;
    openConfirmation: (action:ModalActionAction) => void;
  },
) {
  const { label, confirmation, icon, action, openConfirmation } = props;
  return (
    <li
      className="odd:animate-fadeInUp even:animate-fadeInDown
      odd:animate-duration-500 even:animate-duration-500 flex w-full"
    >
      <div
        className="--btn-resp group btn btn-ghost no-animation flex-nowrap 
        justify-between gap-2 rounded-none border-x-0 !font-medium transition-all 
        duration-300 hover:px-4 hover:!font-black sm:gap-4 sm:hover:px-8
        w-full
      "
        title={label}
        onClick={confirmation ? () => openConfirmation(props) : action}
      >
        <span className="truncate">
          {label} {!!confirmation && <>&middot;</>}
        </span>
        {/* <span className="text-2xl transition-transform duration-300 ease-in group-hover:-scale-x-100">{icon}</span> */}
        <span className="text-2xl transition-transform duration-300">
          {icon}
        </span>
      </div>
    </li>
  );
}

export default ModalActionItem;
