export interface AddonState {
  state: "playing" | "paused";
  startWidth: number;
  endWidth: number;
  currentWidth: number;
  step: number;
  delay: number;
  repeat: boolean;
}

export type CustomerDefaultState = Omit<AddonState, "state" | "currentWidth">;
