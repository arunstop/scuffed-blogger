import React, { ReactNode } from "react";
import { MainColorTypes } from "../../utils/data/Colors";

interface ActionButtonProps {
  icon?: ReactNode;
  label?: string;
  title?: string;
  color?: MainColorTypes;
  outlined?: boolean;
  value: boolean;
  onChange?: (value: boolean) => void;
}

const getColor = (color: MainColorTypes) => {
  switch (color) {
    case "primary":
      return "btn-primary";
    case "secondary":
      return "btn-secondary";
    case "accent":
      return "btn-accent";
    case "neutral":
      return "btn-neutral";
    case "info":
      return "btn-info";
    case "success":
      return "btn-success";
    case "error":
      return "btn-error";

    default:
      return "neutral";
  }
};

function ArticleReactionButton({
  icon,
  label = "",
  title = "",
  outlined = false,
  color = "neutral",
  value = false,
  onChange,
}: ActionButtonProps) {
  return (
    <label
      className={`btn btn-success flex-1 !border-[2px] sm:w-32 
      sm:flex-none sm:border-2 --btn-resp
      ${outlined && !value ? "btn-outline" : ""}
      ${getColor(color)}
      `}
      title={title}
    >
      <input
        className="opacity-0 appearance-none peer"
        type="checkbox"
        onChange={(ev)=>onChange?.(ev.target.checked)}
      />

      <span className="text-2xl transition-transform duration-[600ms] peer-checked:rotate-[360deg]">
        {icon}
      </span>
      {label}
    </label>
  );
}

export default React.memo(ArticleReactionButton);
