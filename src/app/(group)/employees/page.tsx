"use client";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { CommonTable } from "@/components/common/Table";
import { TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropodwn-menu";
import { useState } from "react";
import { useDeleteEmployeeMutation, useFetchEmployeesQuery } from "@/features/store/services/branches";
import { BranchEmployeeType } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Users, UserCheck, Clock, UserPlus } from 'lucide-react'
import Image from "next/image";
import Avatar from "../../../../public/avatar.png";
import { CreateEmployeeModal } from "@/components/molecules/employee/AddEmployeeModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { toast } from "react-toastify";
import { getImageUrl } from "@/lib/utils";

const headers = [
  { key: "", label: "#" },
  { key: "name", label: "Name" },
  { key: "job_title", label: "Job Title" },
  { key: "department", label: "Department" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

export default function Employees() {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<BranchEmployeeType | null>(null);
  const [deleteEmployee, { isLoading: deleteEmployeeLoading }] = useDeleteEmployeeMutation();
  const { data: employees, refetch } = useFetchEmployeesQuery({});
  console.log(employees, 'employeesemployees');

  const handleEdit = (employee: BranchEmployeeType) => {
    setSelectedEmployee(employee);
    setOpen(true);
  }

  const handleDelete = (employee: BranchEmployeeType) => {
    setSelectedEmployee(employee);
    setOpenDelete(true);
  }

  const handleConfirmDelete = async () => {
    try {
      const response: any = await deleteEmployee(selectedEmployee?.id);
      if (response.error) {
        toast.error(response.error.data.message || 'Something went wrong');
      } else {
        toast.success('Employee deleted successfully');
        refetch();
        setOpenDelete(false);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  }

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setOpen(true);
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:px-6 md:pt-6 space-y-4 bg-white rounded-lg">
      <ConfirmationModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete Employee"
        description="Are you sure you want to delete this employee?"
        onConfirm={handleConfirmDelete}
        loading={deleteEmployeeLoading}
      />
      <CreateEmployeeModal open={open} setOpen={setOpen} refetch={refetch} selectedEmployee={selectedEmployee} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Employees</h1>
        <Button onClick={handleAddEmployee} className="text-white bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="flex gap-6 mb-10">
        <div className="w-6/12">
          <div className="w-full grid grid-cols-2 gap-4">
            <Card className="h-20">
              <CardContent className="px-5 py-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <Users className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Employee</p>
                    <h3 className="text-2xl font-bold">{employees?.data?.activeEmployees}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-20">
              <CardContent className="px-5 py-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <UserCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Employee</p>
                    <h3 className="text-2xl font-bold">{employees?.data?.activeEmployees}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 mt-5">
            <Card className="h-20">
              <CardContent className="px-5 py-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <Clock className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">On Leave</p>
                    <h3 className="text-2xl font-bold">17</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-20">
              <CardContent className="px-5 py-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <UserPlus className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Onboarding</p>
                    <h3 className="text-2xl font-bold">27</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-6/12">
          <Card>
            <CardContent className="py-4 px-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Pending Approval</h2>
                  <p className="text-sm text-muted-foreground">6 Request</p>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      name: "Jane Cooper",
                      image: "/placeholder.svg",
                      initials: "JC"
                    },
                    {
                      name: "Wade Warren",
                      image: "/placeholder.svg",
                      initials: "WW"
                    },
                    {
                      name: "Esther Howard",
                      image: "/placeholder.svg",
                      initials: "EH"
                    }
                  ].map((employee) => (
                    <div
                      key={employee.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <Image src={Avatar} alt={''} width={25} height={25} className="object-cover rounded-full" />
                        <span className="font-medium text-sm">{employee.name}</span>
                      </div>
                      <div className="flex items-center space-x-4 cursor-pointer">
                        <span className="text-sm text-muted-foreground">
                          Leave request
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CommonTable
        headers={headers}
        data={employees?.data?.employees}
        className="h-[calc(100vh-415px)]"
        renderRow={(product: BranchEmployeeType, index: number) => (
          <>
            <TableCell className="py-2">{index + 1}</TableCell>
            <TableCell className="py-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden relative">
                <Image src={getImageUrl(product.imageObject?.id)} alt={product.name} fill objectFit="cover" className="w-full h-full" />
              </div>
              <span className="font-medium">{product.name}</span>
            </TableCell>
            <TableCell className="py-2">{product.job_title}</TableCell>
            <TableCell className="py-2">{product.department}</TableCell>
            <TableCell className="py-2">{product.status ? 'Active' : 'Inactive'}</TableCell>
            <TableCell className="py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px] bg-white">
                  <DropdownMenuItem onClick={() => handleEdit(product)} className="cursor-pointer">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(product)} className="cursor-pointer">
                    <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
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
