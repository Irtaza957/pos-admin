"use client";

import type React from "react";
import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

type TypographyProps = {
  as?: React.ElementType;
  children: ReactNode;
  className?: string;
} & VariantProps<typeof typographyVariants>;

const typographyVariants = cva("text-gray-800 dark:text-gray-200", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    alignment: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    opacity: {
      "100": "opacity-100",
      "90": "opacity-90",
      "75": "opacity-75",
      "50": "opacity-50",
      "25": "opacity-25",
      "10": "opacity-10",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    alignment: "left",
    opacity: "100",
  },
});

const Typography = ({ as: Component = "p", children, size, weight, alignment, opacity, className }: TypographyProps) => {
  return <Component className={clsx(typographyVariants({ size, weight, alignment, opacity }), className)}>{children}</Component>;
};

export default Typography;
