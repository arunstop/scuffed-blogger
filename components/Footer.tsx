import React from "react";
import { FaBloggerB, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { APP_DESC, APP_NAME } from "../utils/helpers/Constants";

function Footer() {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content h-[20rem]">
      <div>
        <FaBloggerB className="text-5xl sm:text-[4rem] text-primary-focus" />
        <p>
          <span className="text-xl sm:text-2xl font-black text-primary">{APP_NAME}</span>
          <br />
          <span className="text-base sm:text-lg">{APP_DESC}</span>
        </p>
      </div>
      <div>
        <span className="footer-title">Social</span>
        <div className="grid grid-flow-col gap-4">
          <a className="btn btn-ghost btn-square">
            <FaTwitter className="text-2xl sm:text-3xl" />
          </a>
          <a className="btn btn-ghost btn-square">
            <FaInstagram className="text-2xl sm:text-3xl" />
          </a>
          <a className="btn btn-ghost btn-square">
            <FaYoutube className="text-2xl sm:text-3xl" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
