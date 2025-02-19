"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Image from "next/image";
import { CommonTable } from "@/components/common/Table";
import { TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useFetchBranchEmployeesQuery, useFetchStoresQuery } from "@/features/store/services/branches";
import { BranchEmployeeType, BranchType } from "@/lib/types";
import { CreateBranchModal } from "@/components/molecules/Branch/AddBranchModal";
import { getImageUrl } from "@/lib/utils";

const headers = [
  { key: "", label: "#" },
  { key: "name", label: "Name" },
  { key: "job_title", label: "Job Title" },
  { key: "department", label: "Department" },
  { key: "status", label: "Status" },
];

export default function BranchManagement() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [open, setOpen] = useState(false);
  const { data: storeData, refetch } = useFetchStoresQuery({});
  const { data: branchEmployees } = useFetchBranchEmployeesQuery({ id: selectedTab });

  const handleNavigate = (website: string) => {
    window.open(website, '_blank');
  };

  useEffect(() => {
    if (storeData?.data) {
      setSelectedTab(storeData?.data[0]?.id);
    }
  }, [storeData]);
  return (
    <div className="max-w-7xl mx-auto p-4 md:px-6 md:pt-6 space-y-4 bg-white rounded-lg">
      <CreateBranchModal open={open} setOpen={setOpen} refetch={refetch} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Branches</h1>
        <Button onClick={() => setOpen(true)} className="text-white bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </Button>
      </div>

      <div className="flex overflow-x-auto no-scrollbar w-full gap-6 !mb-7">
        {storeData?.data?.map((branch: BranchType) => (
          <Card key={branch.id} className="overflow-hidden min-w-[30%] group rounded-[20px]">
            <div className="relative h-40">
              <Image src={getImageUrl(branch?.logo)} alt={''} fill className="object-cover bg-gray-500 brightness-75 group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 p-6 text-white">
                <h2 className="text-2xl font-bold whitespace-nowrap text-ellipsis overflow-hidden">{branch.name}</h2>
                <p className="text-sm opacity-90">Location: {branch.location}</p>
                <Button onClick={() => handleNavigate(branch?.website || '')} variant="outline" className="mt-4 bg-black/20 border-white text-white hover:bg-black/40">
                  Click here
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex overflow-x-auto no-scrollbar w-full whitespace-nowrap gap-4">
        {storeData?.data?.map((branch: BranchType) => (
          <p
            key={branch.id}
            onClick={() => setSelectedTab(branch.id)}
            className={`text-sm font-semibold cursor-pointer ${selectedTab === branch.id ? 'text-black underline' : 'text-gray-500'}`}
          >
            {branch.name}
          </p>
        ))}
      </div>
      <CommonTable
        headers={headers}
        data={branchEmployees?.data}
        className="h-[calc(100vh-445px)]"
        renderRow={(product: BranchEmployeeType, index: number) => (
          <>
            <TableCell className="py-2">{index + 1}</TableCell>
            <TableCell className="py-2">{product.name}</TableCell>
            <TableCell className="py-2">{product.job_title}</TableCell>
            <TableCell className="py-2">{product.department}</TableCell>
            <TableCell className="py-2">{product.status ? 'Active' : 'Inactive'}</TableCell>
          </>
        )}
      />
      {/* <div className="flex items-center justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          itemsPerPageOptions={itemsPerPageOptions}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
          }}
        />
      </div> */}
    </div>
  );
}
