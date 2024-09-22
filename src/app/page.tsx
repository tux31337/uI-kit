"use client";
import Image from "next/image";
import Label from "./components/Label";
import IconButton from "./components/IconButton";
import DefaultTextField from "./components/DefaultTextFiled";

export default function Home() {
  const iconProps = {
    iconPath: "/github.svg",
    alt: "icon",
    handleClick: () => {
      console.log("hi");
    },
  };

  return (
    <div className="text-base font-extralight">
      <IconButton {...iconProps} />
      <Label htmlFor="username" children="이메일"></Label>
    </div>
  );
}
