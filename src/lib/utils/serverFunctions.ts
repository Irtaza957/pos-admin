"use server";
import { cookies } from "next/headers";

export const setCookie = async (value: { name: string; value: string }[]) => {
  value.forEach((item) => {
    cookies().set(item.name, item.value);
  });
};
