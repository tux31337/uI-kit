import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import Label from "@/app/components/Label";

const meta = {
  title: "Text/Label", // 경로를 나타낸다.
  component: Label, // 해당 component의 스토리를 작성했다.
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    htmlFor: { control: "text", description: "label의 for 속성" },
    children: { control: "text", description: "label의 내용" },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    htmlFor: "username",
    children: "이메일",
  },
};
