import React, { ReactNode } from "react";
import {
  makeDecorator,
  useState,
  addons,
  useParameter,
} from "storybook/internal/preview-api";
import { KEY, EVENTS, DEFAULT_STATE } from "./constants";

export const withAddonDecorator = makeDecorator({
  name: "withAddonDecorator",
  parameterName: "viewport-resizer",
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context, { parameters }) => {
    const initialWidth = useParameter(KEY, DEFAULT_STATE).startWidth;
    // let initialWidth: number;
    // const unsafeStartWidth = parameters?.viewportResizer?.startWidth;
    // if (!unsafeStartWidth || typeof unsafeStartWidth !== "number") {
    //   initialWidth = DEFAULT_STATE.startWidth;
    // } else {
    //   initialWidth = unsafeStartWidth;
    // }
    const [width, setWidth] = useState(initialWidth);
    addons
      .getChannel()
      .addListener(EVENTS.UPDATE_WIDTH, (currentWidth) =>
        setWidth(currentWidth),
      );
    const story = getStory(context) as ReactNode;
    return (
      <div id="with-dynamic-width-decorator" style={{ width: `${width}px` }}>
        {story}
      </div>
    );
  },
});
