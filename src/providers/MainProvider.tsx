"use client";
import type { HTMLAttributes, ReactNode } from "react";
import type React from "react";
import StoreProvider from "./StoreProvider";

interface MainProviderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const MainProvider: React.FC<MainProviderProps> = ({ children }) => {
  return (
    <div>
      <StoreProvider>{children}</StoreProvider>
    </div>
  );
};
export default MainProvider;
