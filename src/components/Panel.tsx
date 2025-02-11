import React, { FC, memo, useCallback } from "react";

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

  return (
    <AddonPanel {...props}>
      <button onClick={onPlay}>Play</button>
      <button onClick={onPause}>Pause</button>
      <button onClick={onReset}>Reset</button>

      <label>
        Start width
        <input type="text" value={startWidth} />
      </label>
      <label>
        End width
        <input type="text" value={endWidth} />
      </label>
      <label>
        Current width
        <input type="text" value={currentWidth} />
      </label>
      <label>
        Repeat
        <input
          type="checkbox"
          checked={repeat}
          onChange={(event) => toggleRepeat(event.target.checked)}
        />
      </label>
    </AddonPanel>
  );
});
