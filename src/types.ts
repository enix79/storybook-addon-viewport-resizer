export interface AddonState {
  state: "playing" | "paused";
  startWidth: number;
  endWidth: number;
  step: number;
  delay: number;
  repeat: boolean;
}
