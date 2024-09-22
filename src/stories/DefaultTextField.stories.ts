import DefaultTextField from "@/app/components/DefaultTextFiled";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta = {
  title: "Text/Field", // 경로를 나타낸다.
  component: DefaultTextField, // 해당 component의 스토리를 작성했다.
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    errorMessage: { control: "text", description: "에러메시지 내용" },
    iconPath: {
      control: "text",
      description: "이미지의 경로",
      defaultValue: "",
    },
    alt: { control: "text", description: "이미지 alt" },
    handleIconClick: { action: "clicked", desciprition: "버튼 클릭 이벤트" },
    placeholder: { control: "text", description: "input placeholder" },
    handleChange: { action: "clicked", desciprition: "input 값 입력 이벤트" },
    value: { contrl: "text", description: "input text" },
  },
  args: {
    handleChange: fn(),
    handleIconClick: fn(),
  },
} satisfies Meta<typeof DefaultTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    errorMessage: "텍스트를 확인해주세요",
    iconPath: "/github.svg",
    alt: "icon",
    placeholder: "텍스트를 입력해주세요",
    value: "",
  },
};
