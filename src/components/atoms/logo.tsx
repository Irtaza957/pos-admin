import type { HTMLAttributes } from "react";
import type React from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import { Logo as LogoImage } from "@/assets";

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  toggleSidebar: () => void;
}

const Logo: React.FC<LogoProps> = ({ toggleSidebar }) => {
  return (
    <div className="flex items-center ml-5 gap-3">
      <Menu className="text-primary_text_light lg:hidden" onClick={toggleSidebar} />
      <div className="relative w-[200px]">
        <Image src={LogoImage} alt="Login illustration" className="dark:invert" priority />
      </div>
      {/* <Typography as={"h1"} size={"xl"} weight={"bold"}>
        POS Restaurant
      </Typography> */}
    </div>
  );
};
export default Logo;
