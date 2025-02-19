"use client";
import type { NavConfigItem } from "@/lib/constants";
import { cn } from "@/lib/utils/index";
import { createElement, useMemo } from "react";
import type React from "react";
import Typography from "./typography";
import { usePathname } from "next/navigation";
import Link, { type LinkProps } from "next/link";

interface NavItemProps extends LinkProps {
  item: NavConfigItem;
  toggleSidebar: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, toggleSidebar, ...props }) => {
  const path = usePathname();

  const activePath = useMemo(() => {
    return item.href === path;
  }, [item.href, path]);

  const handleToggle = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 1024) {
        toggleSidebar();
      }
    }
  }
  return (
    <Link className={
      cn([
        'flex gap-2.5 items-center justify-start rounded-l-3xl hover:bg-bg_base_light',
        activePath ? "bg-bg_base_light cursor-pointer" : "", "pl-4 pr-6 py-5 lg:py-4"
      ])}
      {...props} href={item.href}
      onClick={handleToggle}
    >
      <div className="">
        {createElement(item.icon, {
          className: cn('w-6 lg:w-auto', activePath ? "text-emerald-500" : "text-primary_text")
        })}
      </div>
      <Typography className={cn('text-sm', activePath ? '!text-emerald-500' : 'text-primary_text')}>
        {item.title}
      </Typography>
    </Link>
  );
};
export default NavItem;
