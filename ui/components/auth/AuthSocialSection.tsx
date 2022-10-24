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
      <span className="mx-auto font-bold opacity-50 sm:text-lg">
        Or login with
      </span>

      <div className="flex flex-col justify-center flex-wrap gap-2 sm:flex-row sm:gap-4">
        {socialButtons.map((e, idx) => (
          <AuthSocialButton key={idx} {...e} />
        ))}
      </div>
    </>
  );
}

export default React.memo(AuthSocialSection);
