"use client";
import type { HTMLAttributes } from "react";
import type React from "react";
import Logo from "@/components/atoms/logo";
import { cn } from "@/lib/utils/index";
import ProfileButton from "../atoms/profileButton";

interface HeaderProps extends HTMLAttributes<HTMLHeadElement> {
  toggleSidebar: (value: boolean) => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, className }) => {
  return (
    <header className={cn(["bg-primary_bg_light w-full h-[100px] px-4 rounded-t-xl mb-3 justify-between flex place-items-center shadow-md", className])}>
      <Logo toggleSidebar={() => toggleSidebar(true)} />
      <ProfileButton />
    </header>
  );
};
export default Header;
