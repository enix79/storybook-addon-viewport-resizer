import React, { ReactNode } from "react";
import {
  makeDecorator,
  useState,
  addons,
} from "storybook/internal/preview-api";
import { KEY, EVENTS } from "./constants";

export const withAddonDecorator = makeDecorator({
  name: "withAddonDecorator",
  parameterName: "viewport-resizer",
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context, { parameters }) => {
    // TODO: read parameters for default value
    const [width, setWidth] = useState(150);
    addons
      .getChannel()
      .addListener(EVENTS.UPDATE_WIDTH, (currentWidth) =>
        setWidth(currentWidth),
      );
    const story = getStory(context) as ReactNode;
    return <div style={{ width: `${width}px` }}>{story}</div>;
  },
});
