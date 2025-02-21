import React, { ReactNode } from "react";
import { makeDecorator, useState, addons, useParameter } from "storybook/internal/preview-api";
import { KEY, EVENTS } from "./constants";
import { DEFAULT_STATE } from "./defaults";

export const withAddonDecorator = makeDecorator({
  name: "withAddonDecorator",
  parameterName: "viewport-resizer",
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context, { parameters }) => {
    const initialWidth = useParameter(KEY, DEFAULT_STATE).startWidth;
    const [width, setWidth] = useState(initialWidth);
    addons.getChannel().addListener(EVENTS.UPDATE_WIDTH, (currentWidth) => setWidth(currentWidth));
    const story = getStory(context) as ReactNode;
    return (
      <div id="with-dynamic-width-decorator" style={{ width: `${width}px` }}>
        {story}
      </div>
    );
  },
});
