import type { Metadata } from "next";
import "./globals.css";
import MainProvider from "@/providers/MainProvider";
import { Poppins } from "next/font/google";
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const poppinsFont = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: "normal",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "POS Admin",
  description: "Generated by create next app",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppinsFont.className}  antialiased overflow-hidden w-full flex flex-col gap-4 bg-bg_base_light`} suppressHydrationWarning>
        <MainProvider className="h-screen">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
          {children}
        </MainProvider>
      </body>
    </html>
  );
}