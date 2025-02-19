import Graph from "@/components/molecules/Dashboard/Graph";
import type React from "react";

interface DashboardPageProps { }

const DashboardStats: React.FC<DashboardPageProps> = ({ ...props }) => {
    return <div {...props}>
        <div className="grid grid-cols-4 gap-3">
            <div className="bg-gradient-to-r from-[#E0EAFC] to-[#CFDEF3] rounded-md px-4 py-5">
                <p className="text-primary_text">Total Sale</p>
                <p className="font-semibold text-2xl my-4">$ 12 856.35</p>
                <p className="text-primary_text">Preview 30 Days</p>
            </div>
            <div className="bg-gradient-to-r from-[#EEE8FB] to-[#E9E4F0] rounded-md px-4 py-5">
                <p className="text-primary_text">Total Sale</p>
                <p className="font-semibold text-2xl my-4">$ 12 856.35</p>
                <p className="text-primary_text">Preview 30 Days</p>
            </div>
            <div className="bg-gradient-to-r from-[#FFEEEE] to-[#DDEFBB] rounded-md px-4 py-5">
                <p className="text-primary_text">Total Sale</p>
                <p className="font-semibold text-2xl my-4">$ 12 856.35</p>
                <p className="text-primary_text">Preview 30 Days</p>
            </div>
            <div className="bg-gradient-to-r from-[#C9D6FF] to-[#E2E2E2] rounded-md px-4 py-5">
                <p className="text-primary_text">Total Sale</p>
                <p className="font-semibold text-2xl my-4">$ 12 856.35</p>
                <p className="text-primary_text">Preview 30 Days</p>
            </div>
        </div>
        <div className="my-3 h-[calc(100vh-290px)] overflow-y-auto no-scrollbar">
            <Graph />
        </div>
    </div>;
};
export default DashboardStats;
