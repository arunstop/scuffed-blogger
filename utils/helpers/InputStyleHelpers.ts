import { BreakpointTypes } from "../data/UI";

export function getScalingInput(scaleTo: BreakpointTypes): string {
  let input, text;

  if (scaleTo === "sm") {
    input = "input-sm";
    text="text-sm";
  }
  if (scaleTo === "md") {
    input = "input-sm sm:input-md";
    text="text-sm sm:text-base";
  }
  if (scaleTo === "lg") {
    input = "input-sm sm:input-md lg:input-lg";
    text="text-sm sm:text-base lg:text-lg";
  }
  if (scaleTo === "xl") {
    input = "input-sm sm:input-md lg:input-lg";
    text="text-sm sm:text-base lg:text-lg";
  }
  return `${input} ${text}`;
}

export function getScalingInputIcon(scaleTo: BreakpointTypes): string {
  if (scaleTo === "sm") return "pl-9";
  if (scaleTo === "md") return "pl-9 sm:pl-12";
  if (scaleTo === "lg") return "pl-9 sm:pl-12 lg:pl-[3.75rem]";
  if (scaleTo === "xl") return "pl-9 sm:pl-12 lg:pl-[3.75rem]";
  else return "";
}

export function getScalingInputClearIcon(scaleTo: BreakpointTypes): string {
  if (scaleTo === "sm") return "pr-9";
  if (scaleTo === "md") return "pr-9 sm:pr-12";
  if (scaleTo === "lg") return "pr-9 sm:pr-12 lg:pr-[3.75rem]";
  if (scaleTo === "xl") return "pr-9 sm:pr-12 lg:pr-[3.75rem]";
  else return "";
}

export function getScalingIcon(scaleTo: BreakpointTypes): string {
  let width, text, scale;
  if (scaleTo === "sm") {
    width = "w-9";
    text = "text-xl";
    scale = "peer-focus:scale-[1.375]";
  }

  if (scaleTo === "md") {
    width = "w-9 sm:w-12";
    text = "text-xl sm:text-2xl";
    scale = "peer-focus:scale-[1.375] sm:peer-focus:scale-150";
  }

  if (scaleTo === "lg") {
    width = "w-9 sm:w-12 lg:w-[3.75rem]";
    text = "text-xl sm:text-2xl lg:text-3xl";
    scale =
      "peer-focus:scale-[1.375] sm:peer-focus:scale-150 lg:peer-focus:scale-[1.625]";
  }

  if (scaleTo === "xl") {
    width = "w-9 sm:w-12 lg:w-[3.75rem]";
    text = "text-xl sm:text-2xl lg:text-3xl";
    scale =
      "peer-focus:scale-[1.375] sm:peer-focus:scale-150 lg:peer-focus:scale-[1.625]";
  }
  return `${width} ${text} ${scale}`;
}
