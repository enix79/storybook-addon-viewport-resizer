import React, { FC, FormEvent, memo, useEffect } from "react";

import { AddonPanel } from "storybook/internal/components";
import {
  useStorybookState,
  useAddonState,
  useChannel,
} from "storybook/internal/manager-api";
import ControlsSection from "./ControlsSection";

import { ADDON_ID, KEY, EVENTS } from "../constants";
import { AddonState } from "src/types";

interface PanelProps {
  active: boolean;
}

export const Panel: FC<PanelProps> = memo(function MyPanel(props) {
  const initialState: AddonState = {
    state: "paused",
    startWidth: 150,
    endWidth: 1200,
    currentWidth: 150,
    step: 100,
    delay: 500,
    repeat: true,
  };
  const [addonState, setAddonState] = useAddonState(ADDON_ID, initialState);
  const { state, startWidth, endWidth, currentWidth, step, delay, repeat } =
    addonState;

  const emit = useChannel({
    UPDATE_WIDTH: () => null,
  });

  const path = useStorybookState().path;

  useEffect(() => {
    setAddonState(initialState);
  }, [path]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (state === "playing") {
      if (currentWidth >= endWidth) {
        if (repeat) {
          setAddonState((prev) => ({ ...prev, currentWidth: startWidth }));
          emit(EVENTS.UPDATE_WIDTH, startWidth);
        } else {
          setAddonState((prev) => ({ ...prev, state: "paused" }));
        }
      } else {
        const incrementWidth = () =>
          setAddonState((prev) => ({
            ...prev,
            currentWidth: currentWidth + step,
          }));
        emit(EVENTS.UPDATE_WIDTH, currentWidth + step);
        timeoutId = setTimeout(incrementWidth, delay);
      }
      return () => clearTimeout(timeoutId);
    }
  }, [state, currentWidth, startWidth, endWidth, repeat, delay, step]);

  const onPlay = () => {
    if (state === "playing") return;
    setAddonState((prev) => ({ ...prev, state: "playing" }));
  };

  const onPause = () => {
    if (state === "paused") return;
    setAddonState((prev) => ({ ...prev, state: "paused" }));
  };

  const onReset = () => {
    setAddonState((prev) => ({ ...prev, currentWidth: startWidth }));
    emit(EVENTS.UPDATE_WIDTH, startWidth);
  };

  const onToggleRepeat = () => {
    setAddonState((prev) => ({ ...prev, repeat: !prev.repeat }));
  };

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
    setAddonState((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AddonPanel {...props}>
      <ControlsSection
        onPlay={onPlay}
        onPause={onPause}
        onReset={onReset}
        onToggleRepeat={onToggleRepeat}
        repeat={repeat}
      />
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

// const params = useParameter("test", "test");
// console.log(params);
