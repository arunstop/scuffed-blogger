import { ReactNode } from "react";

export interface SocialButtonProps {
    icon: ReactNode;
    label: string;
    action?: () => void;
  }
export default function AuthSocialButton({
  icon,
  label,
  action = () => {},
}: SocialButtonProps) {
  return (
    <button
      className="btn btn-primary flex-nowrap gap-x-2
  text-clip --btn-resp font-bold sm:gap-x-4 !leading-none"
      onClick={() => action()}
    >
      <span className="text-xl sm:text-2xl">{icon}</span>
      {label}
    </button>
  );
}
