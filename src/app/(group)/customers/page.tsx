"use client"
import { Button } from "@/components/ui/button"
import { FilterIcon } from '../../../assets'
import { useEffect, useMemo, useState } from "react";
import { customerHeaders, customerTabs, itemsPerPageOptions } from "@/lib/constants";
import { cn } from "@/lib/utils/index";
import { CommonTable } from "@/components/common/Table";
import { TableCell } from "@/components/ui/table";
import { Pagination } from "@/components/common/Pagination";
import { MoreHorizontal, Pencil, Trash2, Ban } from "lucide-react";
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropodwn-menu";
import { CreateCustomerModal } from "@/components/molecules/customer/AddCustomerModal";
import { useDeleteCustomersMutation, useFetchCustomersQuery, useUpdateCustomerStatusMutation } from "@/features/store/services/customer";
import PageLoader from "@/components/ui/PageLoader";
import { CustomerFilterType, CustomerType } from "@/lib/types";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import CustomerFilter from "@/components/molecules/customer/Filter";

export default function Customers() {
  const [openFilter, setOpenFilter] = useState(false)
  const [selectedTab, setSelectedTab] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [openModal, setOpenModal] = useState(false)
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
  const [openBlockModal, setOpenBlockModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [filter, setFilter] = useState<CustomerFilterType>({
    name: '',
    phone_number: '',
    email: '',
    last_order_date: '',
    status: '',
    withDeleted: 'no',
  })

  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomersMutation();
  const [updateCustomerStatus, { isLoading: isUpdatingStatus }] = useUpdateCustomerStatusMutation();

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page: currentPage,
      take: itemsPerPage,
      order: "ASC",
    };

    Object.entries(filter).forEach(([key, value]) => {
      if (value) params[key] = value;
    });

    return params;
  }, [currentPage, itemsPerPage, filter]);

  const { data, isLoading, refetch } = useFetchCustomersQuery(queryParams);
  const handleEdit = (customer: CustomerType) => {
    setSelectedCustomer(customer)
    setOpenModal(true)
  }

  const handleBlock = (customer: CustomerType) => {
    setSelectedCustomer(customer)
    setOpenBlockModal(true)
  }

  const handleDelete = async (customer: CustomerType) => {
    setSelectedCustomer(customer)
    setOpenConfirmationModal(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedCustomer) {
      const response: any = await deleteCustomer(selectedCustomer.id)
      if (response.error) {
        toast.error(response.error.data.message || "Failed to delete customer")
      } else {
        toast.success("Customer deleted successfully")
        refetch()
        setOpenConfirmationModal(false)
      }
    }
  }

  const handleAddCustomer = () => {
    setSelectedCustomer(null)
    setOpenModal(true)
  }

  const handleFilter = (filters: CustomerFilterType) => {
    setFilter({ ...filters, last_order_date: filters.last_order_date ? new Date(filters.last_order_date)?.toISOString() : '' });
    setCurrentPage(1)
  }

  const handleResetFilter = () => {
    setFilter({
      name: '',
      phone_number: '',
      email: '',
      last_order_date: '',
      status: '',
      withDeleted: 'no',
    })
    setOpenFilter(false)
  }

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)
    setFilter({
      ...filter,
      withDeleted: tab === 'Deleted' ? 'yes' : 'no',
    })
    setCurrentPage(1)
  }

  const handleConfirmBlock = async () => {
    if (selectedCustomer) {
      const response: any = await updateCustomerStatus({ id: selectedCustomer.id })
      if (response.error) {
        toast.error(response.error.data.message || "Failed to block customer")
      } else {
        toast.success("Customer blocked successfully")
        refetch()
        setOpenBlockModal(false)
      }
    }
  }

  useEffect(() => {
    if (data?.data?.meta) {
      setTotalPages(Math.ceil(data?.data?.meta?.itemsCount / itemsPerPage));
    }
  }, [data, itemsPerPage])

  return (
    <div className="p-4 md:px-6 md:pt-6 space-y-4 bg-white rounded-lg">
      {isLoading && <PageLoader />}
      <CreateCustomerModal open={openModal} setOpen={setOpenModal} refetch={refetch} selectedCustomer={selectedCustomer} />
      <ConfirmationModal
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        title="Delete Customer"
        description="Are you sure you want to delete this customer?"
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
      <ConfirmationModal
        open={openBlockModal}
        setOpen={setOpenBlockModal}
        title="Block Customer"
        description="Are you sure you want to block this customer?"
        onConfirm={handleConfirmBlock}
        loading={isUpdatingStatus}
      />
      <div className="flex flex-col w-full sm:flex-row items-center justify-between gap-4">
        <div className="font-semibold mt-1 w-full">Customers</div>
        <div className="flex items-center justify-end gap-3 w-full relative">
          <Button onClick={() => setOpenFilter(!openFilter)} icon={FilterIcon} className="bg-emerald-500 text-white hover:bg-emerald-600">
            Filter
          </Button>
          {openFilter && <CustomerFilter filterData={filter} handleFilter={handleFilter} handleResetFilter={handleResetFilter} setOpenFilter={setOpenFilter} />}
          <Button
            onClick={handleAddCustomer}
            className="bg-emerald-500 text-white hover:bg-emerald-600 whitespace-nowrap">
            Create Customer
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        {customerTabs.map((item, index) => (
          <Button
            key={index}
            variant="outline"
            className={cn(selectedTab === item ? 'text-primary' : 'text-primary_text')}
            onClick={() => handleTabChange(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <CommonTable
        headers={customerHeaders}
        data={data?.data?.data}
        renderRow={(customer: CustomerType, index) => (
          <>
            <TableCell className="py-2">{index + 1}</TableCell>
            <TableCell className="py-2">{customer.name}</TableCell>
            <TableCell className="py-2">{customer.phone}</TableCell>
            <TableCell className="py-2">{customer.email}</TableCell>
            <TableCell className="py-2">{customer.totalOrders}</TableCell>
            <TableCell className="py-2">{customer.lastOrderId || 'N/A'}</TableCell>
            <TableCell className="py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px] bg-white">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(customer)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleBlock(customer)}>
                    <Ban className="mr-2 h-4 w-4" />
                    Block
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleDelete(customer)}>
                    <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </>
        )}
      />

      <div className="flex items-center justify-end">
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
      </div>
    </div>
  )
}

