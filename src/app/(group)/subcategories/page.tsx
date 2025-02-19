"use client";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "../../../assets";
import { useEffect, useMemo, useState } from "react";
import { categoryTabs } from "@/lib/constants";
import { cn } from "@/lib/utils/index";
import { CommonTable } from "@/components/common/Table";
import { TableCell } from "@/components/ui/table";
import Image from "next/image";
import { Pagination } from "@/components/common/Pagination";
import Avatar from "../../../../public/avatar.png";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import CategoryFilter from "@/components/molecules/Category/Filter";
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropodwn-menu";
import { AddSubCategoryModal } from "@/components/molecules/SubCategory/AddSubCategoryModel";
import { useDeleteSubCategoriesMutation, useFetchSubCategoriesQuery } from "@/features/store/services/subcategory";
import PageLoader from "@/components/ui/PageLoader";
import { CategoryFilterType, CategoryType } from "@/lib/types";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const headers = [
  { key: "", label: "#" },
  { key: "image", label: "Image" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "created_at", label: "Created" },
  { key: "actions", label: "" },
];

const itemsPerPageOptions = [5, 10, 20, 50];

export default function SubCategories() {
  const [openFilter, setOpenFilter] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [totalPages, setTotalPages] = useState(0);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<CategoryType | null>(null);
  const [filter, setFilter] = useState<CategoryFilterType>({
    name: '',
    date: '',
    withDeleted: 'no',
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
  const { data, isFetching, refetch } = useFetchSubCategoriesQuery(queryParams);
  const [deleteSubCategory, { isLoading: isDeleting }] = useDeleteSubCategoriesMutation();

  const handleDeleteConfirm = async () => {
    try {
      const response: any = await deleteSubCategory(selectedSubcategory?.id);
      if (response.error) {
        toast.error(response.error?.data?.message || "Something went wrong!");
      } else {
        toast.success("Sub Category deleted successfully!");
        refetch();
        setOpenConfirmModal(false);
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleDelete = async (subcategory: CategoryType) => {
    setOpenConfirmModal(true);
    setSelectedSubcategory(subcategory);
  };

  const handleFilter = (filter: CategoryFilterType) => {
    setFilter({ ...filter, date: filter?.date ? new Date(filter?.date).toISOString() : '' });
    setCurrentPage(1);
  }

  const handleClearFilter = () => {
    setFilter({
      name: '',
      date: '',
    });
    setOpenFilter(false);
    setCurrentPage(1);
  }

  const handleEdit = (subcategory: CategoryType) => {
    setSelectedSubcategory(subcategory);
    setOpenModal(true);
  }

  const handleAddSubCategory = () => {
    setSelectedSubcategory(null);
    setOpenModal(true);
  }

  const handleSelectedTab = (index: number) => {
    setFilter({
      ...filter,
      withDeleted: index === 1 ? 'yes' : 'no',
    });
    setSelectedTab(index);
    setCurrentPage(1);
  }

  useEffect(() => {
    if (data?.data?.meta) {
      setTotalPages(Math.ceil(data?.data?.meta?.itemsCount / itemsPerPage));
    }
  }, [data, itemsPerPage]);

  return (
    <div className="p-4 md:px-6 md:pt-6 space-y-4 bg-white rounded-lg">
      <ConfirmationModal
        open={openConfirmModal}
        setOpen={setOpenConfirmModal}
        onConfirm={handleDeleteConfirm}
        title="Delete Sub Category"
        description="Are you sure you want to delete this subcategory?"
        loading={isDeleting}
      />
      {isFetching && <PageLoader />}
      <AddSubCategoryModal open={openModal} setOpen={setOpenModal} refetch={refetch} category={selectedSubcategory} />
      <div className="flex flex-col w-full sm:flex-row items-center justify-between gap-4">
        <div className="font-semibold mt-1 w-full">Sub Categories</div>
        <div className="flex items-center justify-end gap-3 w-full relative">
          <Button onClick={() => setOpenFilter(!openFilter)} icon={FilterIcon} className="bg-emerald-500 text-white hover:bg-emerald-600">
            Filter
          </Button>
          {openFilter && <CategoryFilter handleFilter={handleFilter} handleClearFilter={handleClearFilter} filters={filter} setOpenFilter={setOpenFilter} />}
          <Button onClick={handleAddSubCategory} className="bg-emerald-500 text-white hover:bg-emerald-600 whitespace-nowrap">
            Create Sub Cateogy
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        {categoryTabs.map((item, index) => (
          <Button key={index} variant="outline" className={cn(selectedTab === index ? "text-primary" : "text-primary_text")} onClick={() => handleSelectedTab(index)}>
            {item}
          </Button>
        ))}
      </div>
      <CommonTable
        headers={headers}
        data={data?.data?.items}
        renderRow={(subcategory: CategoryType, index: number) => (
          <>
            <TableCell className="py-2">{index + 1}</TableCell>
            <TableCell className="py-2">
              <Image src={Avatar} alt={subcategory.name} width={40} height={40} className="object-cover rounded-[6px]" />
            </TableCell>
            <TableCell className="py-2">{subcategory.name}</TableCell>
            <TableCell className="py-2">{subcategory.description}</TableCell>
            <TableCell className="py-2 whitespace-nowrap">{dayjs(subcategory.created_at).format('DD-MM-YYYY HH:mm')}</TableCell>
            <TableCell className="py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px] bg-white">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(subcategory)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleDelete(subcategory)}>
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
