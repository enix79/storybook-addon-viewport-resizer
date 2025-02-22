# Storybook Addon Viewport Resizer

An addon for testing responsive designs.

"Viewport Resizer" helps you test the whole spectrum of the possible widths and not only certain pre-defined devices. This is done by automatically increasing the width of the story container over time.

To enable both container **and** media queries, the iframe of the preview is resized, instead of a custom decorator.

## Installation

You can install this addon by simply running `npm i -D storybook-addon-viewport-resizer`.

Additionally, you have to include it in the list of your addons. In the storybook's main file, add following:

```
 addons: [
    // your addons
    "storybook-addon-viewport-resizer",
  ],
```

## Configuration

You configure this addon with help of parameters. There are currently four parameters, that can be used. You can use only one, many or all of them:

- **viewport-resizer-start-width** (number): value in "px", where resizer will start.
- **viewport-resizer-end-width** (number): value in "px", where resizer will stop.
- **viewport-resizer-step** (number): value in "px", is the amount by which the width of the story container will be increased each time.
- **viewport-resizer-delay** (number): value in "ms", is the time interval size, after which the width of the story container will be increased each time.
