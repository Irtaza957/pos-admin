"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImagePlus, SquarePlus } from "lucide-react";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/form";
import { postProductSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostproductsMutation, useUpdateProductMutation } from "@/features/store/services/product";

import { useFetchCategoriesQuery } from "@/features/store/services/category";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { useFetchSubCategoriesQuery } from "@/features/store/services/subcategory";
import { useFetchStoresQuery } from "@/features/store/services/branches";
import { toast } from "react-toastify";
import { Product } from "@/lib/types";
import { getImageUrl, uploadImage } from "@/lib/utils";
import Image from "next/image";
import { AddCategoryModal } from "../Category/AddCategoryModal";
import { AddSubCategoryModal } from "../SubCategory/AddSubCategoryModel";

interface CreateProductModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refetch?: () => void;
  selectedProduct?: Product | null;
}
type PostproductSchema = z.infer<typeof postProductSchema>;
type Category = {
  id: string;
  name: string;
};

type SubCategory = {
  id: string;
  name: string;
};

type storeData = {
  id: string;
  name: string;
};

export function CreateProductModal({ open, setOpen, refetch, selectedProduct }: CreateProductModalProps) {
  const [imageUrl, setImageUrl] = useState<File | string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openSubCategoryModal, setOpenSubCategoryModal] = useState(false);

  const [postProduct, { isLoading: categoryLoading }] = usePostproductsMutation();
  const { data: categoryData, refetch: refetchCategory } = useFetchCategoriesQuery({});

  const { data: subCategoryData, refetch: refetchSubCategory } = useFetchSubCategoriesQuery({});
  const { data: storeData } = useFetchStoresQuery({});
  const [updateProduct, { isLoading: updateProductLoading }] = useUpdateProductMutation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(file);
    }
  };

  const form = useForm<PostproductSchema>({
    resolver: zodResolver(postProductSchema),
    defaultValues: {
      name: "",
      price: 0,
      restaurant_id: "",
      category_id: "",
      sub_category_id: "",
      active: false,
      quantity: 0,
    },
  });

  const handleSubmit = async (data: PostproductSchema) => {
    let imageId;
    try {
      const response: any = await uploadImage(imageUrl as File);
      imageId = response?.data?.data?.id;
    } catch (error) {
      console.log("Product Image Post Error +++", error);
    }

    let response: any;
    if (selectedProduct?.id) {
      const payload = {
        name: data.name,
        description: '',
        price: Number(data.price),
        image: imageId,
        quantity: Number(data.quantity),
        active: data.active,
      };
      response = await updateProduct({ id: selectedProduct?.id, data: payload });
    } else {
      response = await postProduct({ ...data, image: imageId });
    }

    console.log("Product Post +++", data, response);
    if (response?.error) {
      toast.error(response?.error?.data?.message || "Something went wrong!");
    } else {
      toast.success("Product created successfully");
      refetch?.();
      setOpen(false);
      form.reset();
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      console.log("selectedProduct", selectedProduct);
      const { setValue } = form;
      setValue("name", selectedProduct?.name);
      setValue("price", selectedProduct?.price);
      setValue("restaurant_id", selectedProduct?.restaurant_id);
      setValue("category_id", selectedProduct?.category_id);
      setValue("sub_category_id", selectedProduct?.sub_category_id);
      setValue("active", selectedProduct?.active);
      setValue("quantity", selectedProduct?.quantity);
      console.log(getImageUrl(selectedProduct?.image), "getImageUrl");
      setImageUrl(getImageUrl(selectedProduct?.image));
    }
  }, [selectedProduct, form]);

  useEffect(() => {
    if (!open) {
      form.reset();
      setImageUrl(null);
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <AddCategoryModal open={openModal} setOpen={setOpenModal} refetch={refetchCategory} />
      <AddSubCategoryModal open={openSubCategoryModal} setOpen={setOpenSubCategoryModal} refetch={refetchSubCategory} />
      <DialogContent className="focus:outline-none w-[70%] lg:w-[50%]">
        <DialogHeader>
          <DialogTitle>{selectedProduct?.id ? "Update" : "Create"} Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4 py-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="coca-cola" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="restaurant_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store</FormLabel>
                      <FormControl>
                        <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Store" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup className="bg-white">
                              <SelectLabel>Stores</SelectLabel>
                              {storeData?.data?.map((store: storeData) => (
                                <SelectItem key={store.id} value={store.id}>
                                  {store.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-1 w-full items-center justify-center">
                <div className="space-y-2 w-[90%]">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="bg-white">
                                <SelectLabel>Category</SelectLabel>
                                {categoryData?.data?.items?.map((category: Category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <SquarePlus className="w-6 h-6 text-gray-400 cursor-pointer mt-8" onClick={() => setOpenModal(true)} />
              </div>
              <div className="space-y-2 flex gap-1 w-full items-center justify-center">

                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="sub_category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub Category</FormLabel>
                        <FormControl>
                          <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a Sub Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="bg-white">
                                <SelectLabel>SubCategory</SelectLabel>
                                {subCategoryData?.data?.items?.map((subCategory: SubCategory) => (
                                  <SelectItem key={subCategory.id} value={subCategory.id}>
                                    {subCategory.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <SquarePlus className="w-6 h-6 text-gray-400 cursor-pointer !mt-8" onClick={() => setOpenModal(true)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value === "true")} // Convert string to boolean

                          value={field.value?.toString()} // Convert boolean to string for Select compatibility
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="true">Fixed</SelectItem>
                            <SelectItem value="false">Percentage</SelectItem>
                          </SelectContent>
                        </Select>

                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="tax_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Amount</FormLabel>

                      <FormControl>
                        <Input placeholder="10" type="number" {...field} />
                      </FormControl>


                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>

                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)} // Convert string to boolean


                          value={field.value?.toString()} // Convert boolean to string for Select compatibility
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Unit" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="kg">KG</SelectItem>
                            <SelectItem value="g">G</SelectItem>
                            <SelectItem value="ml">ML</SelectItem>
                            <SelectItem value="l">L</SelectItem>
                          </SelectContent>
                        </Select>


                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value === "true")} // Convert string to boolean
                          value={field.value?.toString()} // Convert boolean to string for Select compatibility
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="quantty" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="150" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="expiry_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>

                      <FormControl>
                        <Input placeholder="2025-01-01" type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 place-items-center">
              <div className="relative w-full h-[200px] bg-gray-100 rounded-lg overflow-hidden">
                {imageUrl ? (
                  <Image src={typeof imageUrl === "object" ? URL.createObjectURL(imageUrl) : imageUrl} alt="Product preview" fill objectFit="cover" className="w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <ImagePlus className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
            <Button loading={categoryLoading || updateProductLoading} disabled={categoryLoading || updateProductLoading} type="submit" className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white">
              {selectedProduct?.id ? "Update" : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
