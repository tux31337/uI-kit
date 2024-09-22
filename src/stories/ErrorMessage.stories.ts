import type { Meta, StoryObj } from "@storybook/react";

import ErrorMessage from "@/app/components/ErrorMessage";

const meta = {
  title: "Text/ErrorMessage", // 경로를 나타낸다.
  component: ErrorMessage, // 해당 component의 스토리를 작성했다.
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: "text", description: "label의 내용" },
  },
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "에러메세지는 여기로",
  },
};
