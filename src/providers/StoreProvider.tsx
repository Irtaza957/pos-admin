"use client";
import { store } from "@/features/store";
import type { HTMLAttributes, ReactNode } from "react";
import React from "react";
import { Provider } from "react-redux";

interface StoreProviderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children, ...props }) => {
  return (
    <Provider store={store} {...props}>
      {children}
    </Provider>
  );
};
export default StoreProvider;
