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
      className="btn btn-primary flex-1 flex-nowrap gap-x-2
  text-clip text-lg font-bold sm:gap-x-4 sm:text-lg !leading-none"
      onClick={() => action()}
    >
      <span className="text-xl sm:text-2xl">{icon}</span>
      {label}
    </button>
  );
}
