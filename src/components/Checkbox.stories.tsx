import type { Meta, StoryObj } from "@storybook/react";

import Checkbox, { CheckboxProps } from "./Checkbox";

const meta: Meta<CheckboxProps> = {
  title: "Checkbox",
  component: Checkbox,
  args: {
    label: "Title",
    checked: true,
    onChange: () => console.log("onChange"),
  },
  parameters: {
    "viewport-resizer-start-width": 300,
    "viewport-resizer-end-width": 1300,
    "viewport-resizer-step": 30,
    "viewport-resizer-delay": 300,
  },
};

export default meta;

type Story = StoryObj<CheckboxProps>;

export const Playground: Story = {};
