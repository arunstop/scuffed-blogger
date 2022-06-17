import React from "react";
import { FaBloggerB, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { APP_DESC, APP_NAME } from "../utils/helpers/Constants";

function Footer() {
  return (
    <footer className="footer h-[20rem] bg-base-300 p-10">
      <div>
        <FaBloggerB className="text-5xl text-primary-focus sm:text-[4rem]" />
        <p>
          <span className="text-xl font-black text-primary sm:text-2xl">
            {APP_NAME}
          </span>
          <br />
          <span className="text-base sm:text-lg">{APP_DESC}</span>
        </p>
      </div>
      <div>
        <span className="footer-title">Socials</span>
        <div className="grid grid-flow-col gap-4">
          <a
            className="btn btn-ghost btn-square"
            href="https://twitter.com/"
            target={"_blank"}
            rel="noreferrer"
          >
            <FaTwitter className="text-2xl sm:text-3xl" />
          </a>
          <a
            className="btn btn-ghost btn-square"
            href="https://instagram.com/"
            target={"_blank"}
            rel="noreferrer"
          >
            <FaInstagram className="text-2xl sm:text-3xl" />
          </a>
          <a
            className="btn btn-ghost btn-square"
            href="https://youtube.com/"
            target={"_blank"}
            rel="noreferrer"
          >
            <FaYoutube className="text-2xl sm:text-3xl" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
