import React from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import {
  MdFlag,
  MdHideSource,
  MdPersonOff,
  MdReport,
  MdShare,
} from "react-icons/md";

function PostPopupOption() {
  return (
    <ul
      tabIndex={0}
      className="dropdown-content menu p-2 shadow-xl ring-2 ring-base-content/20 bg-base-100 rounded-xl max-w-[15rem] w-max"
    >
      <li>
        <a className="">
          <MdHideSource className="text-xl sm:text-2xl" />
          <span className="text-base sm:text-lg font-bold">
            Show less like this
          </span>
        </a>
      </li>
      <li>
        <a className="">
          <MdShare className="text-xl sm:text-2xl" />
          <span className="text-base sm:text-lg font-bold">Share article</span>
        </a>
      </li>
      <li>
        <a className="">
          <MdReport className="text-xl sm:text-2xl" />
          <span className="text-base sm:text-lg font-bold">Report article</span>
        </a>
      </li>
      <li>
        <a className="">
          <FaVolumeMute className="text-xl sm:text-2xl" />
          <span className="text-base sm:text-lg font-bold">Mute author</span>
        </a>
      </li>
      <li>
        <a className="">
          <FaVolumeUp className="text-xl sm:text-2xl" />
          <span className="text-base sm:text-lg font-bold">Unmute author</span>
        </a>
      </li>
      <li>
        <a className="">
          <MdFlag className="text-xl sm:text-2xl" />
          <span className="text-base sm:text-lg font-bold">Report author</span>
        </a>
      </li>
      <li>
        <a className="">
          <MdPersonOff className="text-xl sm:text-2xl" />
          <span className="text-base sm:text-lg font-bold">Block author</span>
        </a>
      </li>
    </ul>
  );
}

export default PostPopupOption;
