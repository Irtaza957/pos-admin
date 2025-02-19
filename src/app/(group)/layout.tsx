'use client'
import Header from "@/components/molecules/Header";
import Sidebar from "@/components/molecules/sidebar";
import { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = (value: boolean) => {
        setIsSidebarOpen(value);
    };
    return (
        <>
            <Header toggleSidebar={toggleSidebar} />
            <main suppressHydrationWarning className="grid grid-cols-12 gap-4 h-full">
                <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <div className="col-span-12 lg:col-span-9 xl:col-span-10 rounded-lg mr-3 shadow-lg">{children}</div>
            </main>
        </>
    );
}