import React, { FC, FormEvent, memo, useCallback } from "react";

import { AddonPanel } from "storybook/internal/components";
import { useGlobals } from "storybook/internal/manager-api";

import { KEY } from "../constants";

interface PanelProps {
  active: boolean;
}

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
      <section>
        <h2>Controls</h2>
        <button onClick={onPlay}>Play</button>
        <button onClick={onPause}>Pause</button>
        <button onClick={onReset}>Reset width</button>
        <label>
          Repeat
          <input
            type="checkbox"
            checked={repeat}
            onChange={(event) => toggleRepeat(event.target.checked)}
          />
        </label>
      </section>
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
