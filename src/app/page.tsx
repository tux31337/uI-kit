"use client";
import Label from "./components/Label";
import IconButton from "./components/IconButton";
import GameComponent from "./components/PhaserGame";
import { TopViewGraph } from "./components/TopViewGraph";

export default function Home() {
  const iconProps = {
    iconPath: "/github.svg",
    alt: "icon",
    handleClick: () => {
      console.log("hi");
    },
  };

  const gameComponentProps = {
    width: 600,
    height: 1080,
    distance: 200,
    range: 100,
  };

  return (
    <div className="text-base font-extralight">
      <IconButton {...iconProps} />
      <div className="flex gap-7">
        <h2>Max Distance</h2>
        <input type="text" className="border-black borer-[3px] border-solid" />
        <button>확인</button>
      </div>
      <Label htmlFor="username" children="이메일"></Label>
      <GameComponent {...gameComponentProps} />
    </div>
  );
}
