"use client";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "../../../assets";
import { useEffect, useMemo, useState } from "react";
import { orderTabs } from "@/lib/constants";
import { cn } from "@/lib/utils/index";
import { CommonTable } from "@/components/common/Table";
import { TableCell } from "@/components/ui/table";
import { Pagination } from "@/components/common/Pagination";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropodwn-menu";
import { useFetchOrderQuery, useUpdateOrderStatusMutation } from "@/features/store/services/order";
import PageLoader from "@/components/ui/PageLoader";
import { OrderFilterType, OrderType } from "@/lib/types";
import OrdersFilter from "@/components/molecules/order/Filter";
import { toast } from "react-toastify";

const headers = [
  { key: "", label: "#" },
  { key: "customer_name", label: "Customer Name" },
  { key: "store.name", label: "Store" },
  { key: "tax_percent", label: "Tax Percent" },
  { key: "total", label: "Price" },
  { key: "orderStatus", label: "Status" },
  { key: "actions", label: "Actions" },
];

const itemsPerPageOptions = [5, 10, 20, 50];

export default function Orders() {
  const [filter, setFilter] = useState<OrderFilterType>({
    name: "",
    store: "",
    price: "",
    status: "",
    orderStatus: "",
    date: "",
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [totalPages, setTotalPages] = useState(0);

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
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

  const { data, isLoading, refetch } = useFetchOrderQuery(queryParams);

  const handleFilter = (filters: OrderFilterType) => {
    setFilter({ ...filters });
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setFilter({
      name: "",
      store: "",
      price: "",
      status: "",
      orderStatus: "",
      date: "",
    });
  };

  const handleSelectTab = (index: number) => {
    setFilter({
      ...filter,
      orderStatus: index === 2 ? "pending" : index === 3 ? "completed" : index === 4 ? "canceled" : "",
      date: index === 1 ? new Date()?.toISOString() : "",
    });
    setSelectedTab(index);
    setCurrentPage(1);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response: any = await updateOrderStatus({ id: id, status });
      if (response.error) {
        toast.error(response.error.data.message || "Somehitng went wrong!");
      } else {
        refetch();
        toast.success("Status Updated Successfully!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (data?.data?.meta) {
      setTotalPages(Math.ceil(data?.data?.meta?.itemsCount / itemsPerPage));
    }
  }, [data, itemsPerPage]);

  return (
    <div className="p-4 md:px-6 md:pt-6 space-y-4 bg-white rounded-lg">
      {isLoading && <PageLoader />}
      <div className="flex flex-col w-full sm:flex-row items-center justify-between gap-4">
        <div className="font-semibold mt-1 w-full">Orders</div>
        <div className="flex items-center justify-end gap-3 w-full relative">
          <Button onClick={() => setOpenFilter(!openFilter)} icon={FilterIcon} className="bg-emerald-500 text-white hover:bg-emerald-600">
            Filter
          </Button>
          {openFilter && (
            <OrdersFilter filterData={filter} handleFilter={handleFilter} handleResetFilter={handleResetFilter} setOpenFilter={setOpenFilter} openFilter={openFilter} />
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {orderTabs.map((item, index) => (
          <Button key={index} variant="outline" className={cn(selectedTab === index ? "text-primary" : "text-primary_text")} onClick={() => handleSelectTab(index)}>
            {item}
          </Button>
        ))}
      </div>
      <CommonTable
        headers={headers}
        data={data?.data?.items}
        renderRow={(product: OrderType, index: number) => (
          <>
            <TableCell className="py-2">{index + 1}</TableCell>
            <TableCell className="py-2">{product.customer_name}</TableCell>
            <TableCell className="py-2">{product.store.name}</TableCell>
            <TableCell className="py-2">{product.tax_percent}</TableCell>
            <TableCell className="py-2">{product.total}</TableCell>
            <TableCell className={`py-2 ${product.orderStatus === "pending" ? "text-yellow-500" : product.orderStatus === "completed" ? "text-green-500" : "text-red-500"}`}>
              {product.orderStatus?.charAt(0).toUpperCase() + product.orderStatus?.slice(1)}
            </TableCell>
            <TableCell className="py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px] bg-white">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateStatus(product?.id, "pending")}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateStatus(product?.id, "canceled")}>
                    Cancel
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateStatus(product?.id, "completed")}>
                    Complete
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
  );
}
