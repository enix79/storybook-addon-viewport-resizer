import { AddonState } from "./types";

export const DEFAULT_STATE: AddonState = {
  state: "paused",
  startWidth: 320,
  endWidth: 1200,
  currentWidth: 320,
  step: 10,
  delay: 200,
  repeat: true,
};
