import { UiTransitionProps } from "../../base/data/UI";

export const transitionPullV = (
  props?: UiTransitionProps,
): UiTransitionProps => ({
  enter: `ease-out transform transition duration-500 ${props?.enter || ""}`,
  enterFrom: `opacity-0 translate-y-[20%] scale-x-0 ${props?.enterFrom || ""}`,
  enterTo: `opacity-100 translate-y-0 scale-x-100 ${props?.enterTo || ""}`,
  entered: `${props?.entered}`,
  leave: `ease-in transform transition duration-300 ${props?.leave || ""}`,
  leaveFrom: `opacity-100 translate-y-0 scale-x-100 ${props?.leaveFrom || ""}`,
  leaveTo: `opacity-0 translate-y-[20%] scale-x-0 ${props?.leaveTo || ""}`,
});

export const transitionFade = (
  props?: UiTransitionProps,
): UiTransitionProps => ({
  enter: `ease-out transition duration-300 ${props?.enter || ""}`,
  enterFrom: `opacity-0 ${props?.enterFrom || ""}`,
  enterTo: `opacity-100 ${props?.enterTo || ""}`,
  entered: `${props?.entered ||""}`,
  // leave: `ease-in transition duration-300 ${props?.leave || ""}`,
  // leaveFrom: `opacity-100 ${props?.leaveFrom || ""}`,
  // leaveTo: `opacity-0 ${props?.leaveTo || ""}`,
});


export const transitionScaleY = (
  props?: UiTransitionProps,
): UiTransitionProps => ({
  enter: `ease-out transform transition duration-300 ${props?.enter || ""}`,
  enterFrom: `opacity-0 scale-y-0 ${props?.enterFrom || ""}`,
  enterTo: `opacity-100 scale-y-100 ${props?.enterTo || ""}`,
  entered: `${props?.entered ||""}`,
  // leave: `ease-in transform transition duration-300 ${props?.leave || ""}`,
  // leaveFrom: `opacity-100 scale-y-100 ${props?.leaveFrom || ""}`,
  // leaveTo: `opacity-0 scale-y-0 ${props?.leaveTo || ""}`,
});
