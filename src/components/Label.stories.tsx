import type { Meta, StoryObj } from "@storybook/react";

import Label from "./Label";

const meta: Meta<typeof Label> = {
  title: "Label",
  component: Label,
  args: {
    children: "Start Width",
  },
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Playground: Story = {};
