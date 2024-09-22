import IconButton from "@/app/components/IconButton";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
// src밑에 있는경우 이렇게 전달해야한다.
import AddonLibrary from "./assets/addon-library.png";
import { action } from "@storybook/addon-actions";

const meta = {
  title: "Buttons/IconButton", // 경로를 나타낸다.
  component: IconButton, // 해당 component의 스토리를 작성했다.
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    alt: {
      control: "text",
      description: "이미지의 alt 속성",
      defaultValue: "icon",
    },
    iconPath: {
      control: "text",
      description: "이미지의 경로",
      defaultValue: "",
    },
    handleClick: { action: "clicked", desciprition: "버튼 클릭 이벤트" },
  },
  args: {
    handleClick: action("clicked"),
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alt: "icon",
    iconPath: "/github.svg",
  },
};
