"use client";
import { useRef, type HTMLAttributes } from "react";
import type React from "react";
import NavItem from "../atoms/navItem";
import { navConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import Image from "next/image";
import { Logo as LogoImage } from "@/assets";

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  isSidebarOpen: boolean;
  toggleSidebar: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
    if (window.innerWidth < 1024) {
      toggleSidebar(false);
    }
  });
  return (
    <aside ref={ref} className={
      cn([
        "col-span-3 xl:col-span-2 transition-all shadow-lg flex flex-col gap-6 fixed top-0 left-0 z-50 lg:relative bg-primary_bg_light pl-4 py-10 lg:py-4 rounded-md overflow-y-auto h-screen no-scrollbar",
        isSidebarOpen ? "block" : "hidden"
      ])}
    >
      <div className="relative w-[150px] lg:hidden">
        <Image src={LogoImage} alt="Login illustration" className="dark:invert" priority />
      </div>
      <X className="lg:hidden h-5 w-5 absolute top-4 right-2 cursor-pointer text-primary_text" onClick={() => toggleSidebar(false)} />
      {navConfig.map((item) => {
        return <NavItem key={item.href} item={item} href={''} toggleSidebar={() => toggleSidebar(false)} />;
      })}
    </aside>
  );
};
export default Sidebar;
