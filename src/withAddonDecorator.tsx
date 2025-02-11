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
    const story = getStory(context) as ReactNode;
    const [globals, updateGlobals] = useGlobals();
    const addonGlobals = globals[KEY] as AddonState;
    console.log(addonGlobals);
    const { state, startWidth, endWidth, currentWidth, step, delay, repeat } =
      addonGlobals;

    useEffect(() => {
      let timeoutId: NodeJS.Timeout;
      if (state === "playing") {
        if (currentWidth >= endWidth) {
          if (repeat) {
            updateGlobals({
              [KEY]: {
                ...globals[KEY],
                currentWidth: startWidth,
              },
            });
          } else {
            updateGlobals({
              [KEY]: {
                ...globals[KEY],
                state: "paused",
              },
            });
          }
        } else {
          const incrementWidth = () =>
            updateGlobals({
              [KEY]: {
                ...globals[KEY],
                currentWidth: currentWidth + step,
              },
            });
          timeoutId = setTimeout(incrementWidth, delay);
        }
        return () => clearTimeout(timeoutId);
      }
    }, [currentWidth, state, repeat]);

    return <div style={{ width: `${currentWidth}px` }}>{story}</div>;
  },
});

// todo: step default 10
// todo: pace/speed default 500ms
// todo: show current width in the tab
