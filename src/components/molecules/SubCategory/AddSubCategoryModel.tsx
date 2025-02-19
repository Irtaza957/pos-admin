"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSubCategorySchema } from "@/lib/schemas";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/form";
import { usePostSubCategoriesMutation, useUpdateSubCategoriesMutation } from "@/features/store/services/subcategory";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchCategoriesQuery } from "@/features/store/services/category";
import { toast } from "react-toastify";
import { CategoryType } from "@/lib/types";

interface AddSubCategoryModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refetch?: () => void;
  category?: CategoryType | null;
}

type postSubCategorySchema = z.infer<typeof postSubCategorySchema>;
type Category = {
  id: string;
  name: string;
};

export function AddSubCategoryModal({ open, setOpen, refetch, category }: AddSubCategoryModalProps) {
  const [postsubCategory, { isLoading }] = usePostSubCategoriesMutation();
  const [updateSubCategory, { isLoading: isUpdating }] = useUpdateSubCategoriesMutation();
  const { data: categoryData } = useFetchCategoriesQuery({});

  const form = useForm<postSubCategorySchema>({
    resolver: zodResolver(postSubCategorySchema),
    defaultValues: {
      name: "",
      // image: "",
      description: "",
      category_id: "",
    },
  });

  const handleSubmit = async (data: postSubCategorySchema) => {
    console.log("data====", data);

    try {
      let response: any;
      if (category?.id) {
        const payload = { name: data.name, description: data.description };
        response = await updateSubCategory({ id: category.id, body: payload });
      } else {
        response = await postsubCategory(data);
      }
      console.log("Api Response", response);

      if (response?.error) {
        toast.error(response?.error?.data?.message || "Something went wrong!");
      } else {
        toast.success(`Sub Category ${category?.id ? 'updated' : 'created'} successfully`);
        refetch?.();
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      console.log("error adding sub category: ", error);
    }
  };

  useEffect(() => {
    if (category) {
      form.setValue("name", category.name);
      form.setValue("description", category.description);
      form.setValue("category_id", category.category_id || "");
    }
  }, [category, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="focus:outline-none">
        <DialogHeader>
          <DialogTitle>{category?.id ? 'Update' : 'Create'} Sub Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4 py-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="add category name" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="add category description" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <div className="grid gap-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input placeholder="add category image" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}

            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CategoryId</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="bg-white">
                            <SelectLabel>Category</SelectLabel>
                            {categoryData?.data?.items?.map((category: Category, categoryIndex: number) => (
                              <SelectItem key={categoryIndex} value={category.id}>
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

            <Button loading={isLoading || isUpdating} disabled={isLoading || isUpdating} type="submit" className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white">
              {category?.id ? 'Update' : 'Save'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
