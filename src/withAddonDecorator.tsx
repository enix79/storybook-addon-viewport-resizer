import React, { ReactNode, useCallback } from "react";
import {
  makeDecorator,
  useEffect,
  useState,
  useGlobals,
} from "storybook/internal/preview-api";

import {
  useAddonState,
  useStorybookState,
} from "storybook/internal/manager-api";
import { ADDON_ID, KEY } from "./constants";
import { AddonState } from "./types";

export const withAddonDecorator = makeDecorator({
  name: "withAddonDecorator",
  parameterName: "viewport-resizer",
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context, { parameters }) => {
    const [globals] = useGlobals();
    const { state, startWidth, endWidth } = globals[KEY] as AddonState;
    console.log(globals[KEY]);
    const [currentWidth, setCurrentWidth] = useState(startWidth);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    console.log(currentWidth);
    console.log(intervalId);
    const story = getStory(context) as ReactNode;
    const increasCurrentWidth = () =>
      setCurrentWidth((prev) => {
        if (prev >= endWidth) {
          return startWidth;
        } else {
          return prev + 10;
        }
      });
    useEffect(() => {
      console.log("useEffect");
      if (state === "paused") {
        if (intervalId) {
          console.log("clearing interval");
          clearInterval(intervalId);
          setIntervalId(null);
          console.log("interval cleared");
        }
      } else if (state === "playing") {
        if (!intervalId) {
          const id = setInterval(increasCurrentWidth, 500);
          setIntervalId(id);
        }
      }
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [state]);

    useEffect(() => {
      setCurrentWidth(startWidth);
    }, [startWidth]);

    return <div style={{ width: `${currentWidth}px` }}>{story}</div>;
  },
});

// todo: repeat: true/false --> wenn angekommen, von vorne starten!
// todo: step default 10
// todo: pace/speed default 500ms
// todo: show current width in the tab
