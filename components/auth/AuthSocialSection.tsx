import React from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import AuthSocialButton, { SocialButtonProps } from "./AuthSocialButton";

const socialButtons: SocialButtonProps[] = [
  { icon: <FaGoogle />, label: "Google" },
  { icon: <FaApple />, label: "Apple" },
  { icon: <FaFacebook />, label: "Facebook" },
];

function AuthSocialSection() {
  return (
    <>
      <span className="mx-auto text-lg font-bold opacity-50 sm:text-xl">
        Or login with
      </span>

      <div className="flex flex-col flex-wrap gap-2 sm:flex-row sm:gap-4">
        {socialButtons.map((e, idx) => (
          <AuthSocialButton key={idx} {...e} />
        ))}
      </div>
    </>
  );
}

export default React.memo(AuthSocialSection);
