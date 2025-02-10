import React, { FC, memo, useCallback } from "react";

import { AddonPanel } from "storybook/internal/components";
import { useGlobals } from "storybook/internal/manager-api";

import { KEY } from "../constants";

interface PanelProps {
  active: boolean;
}

export const Panel: FC<PanelProps> = memo(function MyPanel(props) {
  const [globals, setGlobals] = useGlobals();

  const onPlay = useCallback(() => {
    setGlobals({
      [KEY]: {
        ...globals[KEY],
        state: "playing",
      },
    });
  }, []);

  const onPause = useCallback(() => {
    setGlobals({
      [KEY]: {
        ...globals[KEY],
        state: "paused",
      },
    });
  }, []);

  const onReset = useCallback(() => {
    setGlobals({
      [KEY]: {
        ...globals[KEY],
        startWidth: 150,
      },
    });
  }, []);

  return (
    <AddonPanel {...props}>
      <button onClick={onPlay}>Play</button>
      <button onClick={onPause}>Pause</button>
      <button onClick={onReset}>Reset</button>
    </AddonPanel>
  );
});
