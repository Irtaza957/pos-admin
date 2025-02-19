import { API_ROUTES } from "@/features/routes";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export async function uploadImage(image: File) {
  const formData = new FormData();
  formData.append("image", image);
  const response: any = await axios.post(API_ROUTES.BASE_URL + API_ROUTES.postProductImage, formData, {
    headers: {
      Authorization: `Bearer ${getCookie("auth-token")}`,
    },
  });
  return response;
}

export function getImageUrl(image: string) {
  return `${API_ROUTES.URL}/${API_ROUTES.storage}/${image}`;
}
