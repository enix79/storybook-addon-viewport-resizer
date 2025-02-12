import React, { FC, FormEvent, memo, useCallback } from "react";

import { AddonPanel, Button } from "storybook/internal/components";
import { useGlobals } from "storybook/internal/manager-api";

import { PlayIcon, StopIcon, RefreshIcon } from "@storybook/icons";

import { KEY } from "../constants";
import { styled } from "storybook/internal/theming";
import Checkbox from "./Checkbox";

interface PanelProps {
  active: boolean;
}

export const ControlsSection = styled("section")({
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

export const Panel: FC<PanelProps> = memo(function MyPanel(props) {
  const [globals, setGlobals] = useGlobals();
  console.log("globals", globals[KEY]);
  const { startWidth, endWidth, currentWidth, step, delay, repeat } =
    globals[KEY];

  const onPlay = useCallback(() => {
    setGlobals({
      [KEY]: {
        ...globals[KEY],
        state: "playing",
      },
    });
  }, [globals]);

  const onPause = useCallback(() => {
    setGlobals({
      [KEY]: {
        ...globals[KEY],
        state: "paused",
      },
    });
  }, [globals]);

  const onReset = useCallback(() => {
    setGlobals({
      [KEY]: {
        ...globals[KEY],
        currentWidth: globals[KEY].startWidth,
      },
    });
  }, [globals]);

  const toggleRepeat = useCallback(
    (newValue: boolean) => {
      setGlobals({
        [KEY]: {
          ...globals[KEY],
          repeat: newValue,
        },
      });
    },
    [globals],
  );

  const onSubmitSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newSettings = {
      startWidth: Number(formData.get("startWidth")),
      endWidth: Number(formData.get("endWidth")),
      step: Number(formData.get("step")),
      delay: Number(formData.get("delay")),
    };
    setGlobals({
      [KEY]: {
        ...globals[KEY],
        ...newSettings,
      },
    });
  };

  return (
    <AddonPanel {...props}>
      <ControlsSection>
        <h2>Controls</h2>
        <ControlsList>
          <Button onClick={onPlay}>
            <PlayIcon /> Play
          </Button>
          <Button onClick={onPause}>
            <StopIcon /> Pause
          </Button>
          <Button onClick={onReset}>
            <RefreshIcon /> Reset
          </Button>
          <Checkbox
            label="Repeat"
            checked={repeat}
            onChange={(event) => toggleRepeat(event.target.checked)}
          />
        </ControlsList>
      </ControlsSection>
      <section>
        <h2>Monitoring</h2>
        <label>
          Current width
          <input type="text" value={currentWidth} readOnly />
        </label>
      </section>
      <section>
        <h2>Settings</h2>
        <form onSubmit={onSubmitSettings}>
          <label>
            Start width
            <input type="text" name="startWidth" defaultValue={startWidth} />
          </label>
          <label>
            End width
            <input type="text" name="endWidth" defaultValue={endWidth} />
          </label>

          <label>
            Step
            <input type="text" name="step" defaultValue={step} />
          </label>
          <label>
            Delay
            <input type="text" name="delay" defaultValue={delay} />
          </label>
          <button type="submit">Apply</button>
        </form>
      </section>
    </AddonPanel>
  );
});
