"use client";
import Image from "next/image";
import { ReactNode } from "react";

type IconButtonProps = {
  iconPath: any;
  handleClick: () => void;
  alt: string;
};

export default function IconButton(props: IconButtonProps) {
  const { alt, handleClick, iconPath } = props;
  return (
    <button onClick={() => handleClick()}>
      <Image src={iconPath} alt={alt} width={32} height={32} />
    </button>
  );
}
