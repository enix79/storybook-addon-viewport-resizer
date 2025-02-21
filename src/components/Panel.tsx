import React, { FC, FormEvent, memo, useEffect, useState } from "react";

import { AddonPanel } from "storybook/internal/components";
import { useStorybookState, useAddonState, useChannel, useStorybookApi } from "storybook/internal/manager-api";
import ControlsSection from "./ControlsSection";

import { ADDON_ID, EVENTS, PARAMETER_KEYS } from "../constants";
import { DEFAULT_STATE } from "../defaults";
import { AddonState } from "src/types";

interface PanelProps {
  active: boolean;
}

export const Panel: FC<PanelProps> = memo(function MyPanel(props) {
  if (!props.active) return null;

  const [addonState, setAddonState] = useAddonState<AddonState>(ADDON_ID, DEFAULT_STATE);
  const { state, startWidth, endWidth, currentWidth, step, delay, repeat } = addonState;

  const [inputStartWidth, setInputStartWidth] = useState<number>(startWidth);
  const [inputEndWidth, setInputEndWidth] = useState<number>(endWidth);
  const [inputStep, setInputStep] = useState<number>(step);
  const [inputDelay, setInputDelay] = useState<number>(delay);

  const onInputStartWidthChange = (event: FormEvent<HTMLInputElement>) => setInputStartWidth(Number(event.currentTarget.value));
  const onInputEndWidthChange = (event: FormEvent<HTMLInputElement>) => setInputEndWidth(Number(event.currentTarget.value));
  const onInputStepChange = (event: FormEvent<HTMLInputElement>) => setInputStep(Number(event.currentTarget.value));
  const onInputDelayChange = (event: FormEvent<HTMLInputElement>) => setInputDelay(Number(event.currentTarget.value));

  const emit = useChannel({ UPDATE_WIDTH: () => null });
  const path = useStorybookState().path;

  const api = useStorybookApi();
  const paramStartWidth = api.getCurrentParameter<number>(PARAMETER_KEYS.START_WIDTH);
  const paramEndWidth = api.getCurrentParameter<number>(PARAMETER_KEYS.END_WIDTH);
  const paramStep = api.getCurrentParameter<number>(PARAMETER_KEYS.STEP);
  const paramDelay = api.getCurrentParameter<number>(PARAMETER_KEYS.DELAY);
  console.log(paramStartWidth, paramEndWidth, paramStep, paramDelay);

  useEffect(() => {
    if (paramStartWidth && !isNaN(paramStartWidth)) {
      setAddonState((prev) => ({ ...prev, startWidth: Number(paramStartWidth) }));
      setInputStartWidth(Number(paramStartWidth));
    }
  }, [paramStartWidth]);

  useEffect(() => {
    if (paramEndWidth && !isNaN(paramEndWidth)) {
      setAddonState((prev) => ({ ...prev, endWidth: Number(paramEndWidth) }));
      setInputEndWidth(Number(paramEndWidth));
    }
  }, [paramEndWidth]);

  useEffect(() => {
    if (paramStep && !isNaN(paramStep)) {
      setAddonState((prev) => ({ ...prev, step: Number(paramStep) }));
      setInputStep(Number(paramStep));
    }
  }, [paramStep]);

  useEffect(() => {
    if (paramDelay && !isNaN(paramDelay)) {
      setAddonState((prev) => ({ ...prev, delay: Number(paramDelay) }));
      setInputDelay(Number(paramDelay));
    }
  }, [paramDelay]);

  useEffect(() => {
    setAddonState(DEFAULT_STATE);
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
    setAddonState((prev) => ({
      ...prev,
      startWidth: inputStartWidth,
      endWidth: inputEndWidth,
      step: inputStep,
      delay: inputDelay,
    }));
  };

  return (
    <AddonPanel {...props}>
      <ControlsSection onPlay={onPlay} onPause={onPause} onReset={onReset} onToggleRepeat={onToggleRepeat} repeat={repeat} />
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
            <input type="text" name="startWidth" value={inputStartWidth} onChange={onInputStartWidthChange} />
          </label>
          <label>
            End width
            <input type="text" name="endWidth" value={inputEndWidth} onChange={onInputEndWidthChange} />
          </label>

          <label>
            Step
            <input type="text" name="step" value={inputStep} onChange={onInputStepChange} />
          </label>
          <label>
            Delay
            <input type="text" name="delay" value={inputDelay} onChange={onInputDelayChange} />
          </label>
          <button type="submit">Apply</button>
        </form>
      </section>
    </AddonPanel>
  );
});
