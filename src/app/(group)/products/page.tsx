"use client";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "../../../assets";
import ProductFilter from "@/components/molecules/Product/Filter";
import { useEffect, useMemo, useState } from "react";
import { CreateProductModal } from "@/components/molecules/Product/AddProductModal";
import { productTabs } from "@/lib/constants";
import { cn, getImageUrl } from "@/lib/utils/index";
import { CommonTable } from "@/components/common/Table";
import { TableCell } from "@/components/ui/table";
import Image from "next/image";
import { Pagination } from "@/components/common/Pagination";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useDeleteProductsMutation, useFetchProductsQuery } from "@/features/store/services/product";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropodwn-menu";
import PageLoader from "@/components/ui/PageLoader";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { toast } from "react-toastify";
import { Product, ProductFilterType } from "@/lib/types";

const headers = [
  { key: "", label: "#" },
  { key: "image", label: "Image" },
  { key: "name", label: "Name" },
  { key: "store", label: "Store" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "active", label: "Active" },
  { key: "actions", label: "" },
];

const itemsPerPageOptions = [5, 10, 20, 50];

export default function ProductTable() {
  const [openFilter, setOpenFilter] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState<ProductFilterType>({
    name: "",
    price: "",
    category: "",
    date: "",
    withDeleted: "no",
    orderStatus: "",
  });

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

  const { data, isFetching, refetch } = useFetchProductsQuery(queryParams);
  console.log(data?.data, "data?.data");

  const [deleteProducts, { isLoading: isDeleting }] = useDeleteProductsMutation();

  const handleDelete = (product: Product) => {
    setOpenConfirmationModal(true);
    setSelectedProduct(product);
  };

  const handleEdit = (product: Product) => {
    setOpenModal(true);
    setSelectedProduct(product);
  };

  const handleConfirmDelete = async () => {
    try {
      const response: any = await deleteProducts(selectedProduct?.id);
      console.log("Product deleted successfully!", response);
      if (response?.error) {
        toast.error(response?.error?.data?.message || "Something went wrong!");
      } else {
        toast.success("Product deleted successfully!");
        refetch?.();
        setOpenConfirmationModal(false);
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleAddProduct = () => {
    setOpenModal(true);
    setSelectedProduct(null);
  };

  const handleFilter = (filter: ProductFilterType) => {
    setFilter({ ...filter, date: filter.date ? new Date(filter.date)?.toISOString() : "" });
    setCurrentPage(1);
  };
  const handleClearFilter = () => {
    setFilter({
      name: "",
      price: "",
      category: "",
      date: "",
      withDeleted: "no",
      orderStatus: "",
    });
    setOpenFilter(false);
  };

  const handleSelectTab = (index: number) => {
    setFilter({
      ...filter,
      withDeleted: index === 3 ? "yes" : "no",
      orderStatus: index === 1 ? "completed" : index === 2 ? "pending" : "",
    });
    setSelectedTab(index);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (data?.data?.meta) {
      setTotalPages(Math.ceil(data?.data?.meta?.itemsCount / itemsPerPage));
    }
  }, [data, itemsPerPage]);

  return (
    <div className="p-4 md:px-6 md:pt-6 space-y-4 bg-white rounded-lg">
      {isFetching && <PageLoader />}
      <CreateProductModal open={openModal} setOpen={setOpenModal} refetch={refetch} selectedProduct={selectedProduct} />
      <ConfirmationModal
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        title="Delete Product"
        description="Are you sure you want to delete this product?"
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
      <div className="flex flex-col w-full sm:flex-row items-center justify-between gap-4">
        <div className="font-semibold mt-1 w-full">Products</div>
        <div className="flex items-center justify-end gap-3 w-full relative">
          <Button onClick={() => setOpenFilter(!openFilter)} icon={FilterIcon} className="bg-emerald-500 text-white hover:bg-emerald-600">
            Filter
          </Button>
          {openFilter && <ProductFilter handleFilter={handleFilter} handleClearFilter={handleClearFilter} setOpenFilter={setOpenFilter} />}
          <Button onClick={handleAddProduct} className="bg-emerald-500 text-white hover:bg-emerald-600 whitespace-nowrap">
            Create Product
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        {productTabs.map((item, index) => (
          <Button key={index} variant="outline" className={cn(selectedTab === index ? "text-primary" : "text-primary_text")} onClick={() => handleSelectTab(index)}>
            {item}
          </Button>
        ))}
      </div>
      <CommonTable
        headers={headers}
        data={data?.data?.items}
        renderRow={(product: Product, index: number) => (
          <>
            <TableCell className="py-2">{index + 1}</TableCell>
            <TableCell className="py-2">
              <Image src={getImageUrl(product.image)} alt={product.name} width={40} height={40} className="object-cover rounded-[6px]" />
            </TableCell>
            <TableCell className="py-2">{product.name}</TableCell>
            {/* <TableCell className="py-2">{product.restaurant.name}</TableCell> */}
            <TableCell className="py-2">resturent name</TableCell>
            {/* <TableCell className="py-2">{product.category.name}</TableCell> */}
            <TableCell className="py-2">Category name</TableCell>
            <TableCell className="py-2">{product.price}</TableCell>
            <TableCell className="py-2">{product.active ? "Yes" : "No"}</TableCell>
            <TableCell className="py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px] bg-white">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(product)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleDelete(product)}>
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
  );
}
