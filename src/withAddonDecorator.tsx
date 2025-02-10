import React, { ReactNode } from "react";
import {
  makeDecorator,
  useEffect,
  useState,
  useGlobals,
  useCallback,
} from "storybook/internal/preview-api";

import { KEY } from "./constants";
import { AddonState } from "./types";

export const withAddonDecorator = makeDecorator({
  name: "withAddonDecorator",
  parameterName: "viewport-resizer",
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context, { parameters }) => {
    const [globals, setGlobals] = useGlobals();
    const addonGlobals = globals[KEY] as AddonState;
    const { state, startWidth, endWidth, step, delay, repeat } = addonGlobals;
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [currentWidth, setCurrentWidth] = useState<number>(startWidth);
    const story = getStory(context) as ReactNode;
    const increaseCurrentWidth = () => setCurrentWidth((prev) => prev + step);

    useEffect(() => {
      if (currentWidth >= endWidth) {
        if (repeat) {
          setCurrentWidth(startWidth);
        } else {
          clearInterval(intervalId as NodeJS.Timeout);
          setIntervalId(null);
          setGlobals({
            [KEY]: {
              ...globals[KEY],
              state: "paused",
            },
          });
        }
      }
    }, [currentWidth, endWidth, repeat]);

    useEffect(() => {
      if (state === "paused") {
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(null);
        }
      } else if (state === "playing") {
        if (!intervalId) {
          const id = setInterval(increaseCurrentWidth, delay);
          setIntervalId(id);
        }
      }
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [state]);

    // useEffect(() => {
    //   setCurrentWidth(startWidth);
    // }, [startWidth]);

    return <div style={{ width: `${currentWidth}px` }}>{story}</div>;
  },
});

// todo: repeat: true/false --> wenn angekommen, von vorne starten!
// todo: step default 10
// todo: pace/speed default 500ms
// todo: show current width in the tab
