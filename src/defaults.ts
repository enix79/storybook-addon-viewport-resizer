import { AddonState } from "./types";

export const DEFAULT_STATE: AddonState = {
  state: "paused",
  startWidth: 150,
  endWidth: 1200,
  currentWidth: 150,
  step: 100,
  delay: 500,
  repeat: true,
};
