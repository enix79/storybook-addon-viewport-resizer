import React, { FC } from "react";
import { styled } from "storybook/internal/theming";
import { Button } from "storybook/internal/components";
import { PlayIcon, StopIcon, RefreshIcon } from "@storybook/icons";
import Checkbox from "./Checkbox";

export const StyledSection = styled("section")({
  padding: 8,
});

export const ControlsList = styled("ul")({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: 8,
});

export interface ControlsSectionProps {
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onToggleRepeat: (newValue: boolean) => void;
  repeat: boolean;
}

const ControlsSection: FC<ControlsSectionProps> = ({
  onPlay,
  onPause,
  onReset,
  onToggleRepeat,
  repeat,
}) => {
  return (
    <StyledSection>
      <h2>Controls</h2>
      <ControlsList>
        <Button onClick={onPlay} size="small">
          <PlayIcon /> Play
        </Button>
        <Button onClick={onPause} size="small">
          <StopIcon /> Pause
        </Button>
        <Button onClick={onReset} size="small">
          <RefreshIcon /> Reset
        </Button>
        <Checkbox
          label="Repeat"
          checked={repeat}
          onChange={(event) => onToggleRepeat(event.target.checked)}
        />
      </ControlsList>
    </StyledSection>
  );
};

export default ControlsSection;
