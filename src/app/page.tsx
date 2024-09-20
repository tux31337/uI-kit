import Image from "next/image";
import Label from "./components/Label";

export default function Home() {
  return (
    <div className="text-base font-extralight">
      <Label htmlFor="username" children="이메일"></Label>
    </div>
  );
}
