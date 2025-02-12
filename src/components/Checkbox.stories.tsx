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
};

export default meta;

type Story = StoryObj<CheckboxProps>;

export const Playground: Story = {};
