"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePostCategoriesMutation, useUpdateCategoriesMutation } from "@/features/store/services/category";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postCategorySchema } from "@/lib/schemas";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/form";
import { toast } from "react-toastify";
import { CategoryType } from "@/lib/types";

interface AddCategoryModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  category?: CategoryType | null;
  refetch: () => void;
}

type PostCategorySchema = z.infer<typeof postCategorySchema>;

export function AddCategoryModal({ open, setOpen, refetch, category }: AddCategoryModalProps) {
  const [postCategory, { isLoading: categoryLoading }] = usePostCategoriesMutation();
  const [updateCategory, { isLoading: updateCategoryLoading }] = useUpdateCategoriesMutation();

  const form = useForm<PostCategorySchema>({
    resolver: zodResolver(postCategorySchema),
    defaultValues: {
      name: "",
      // image: "",
      description: "",
    },
  });
  console.log("category", category);

  const handleSubmit = async (data: PostCategorySchema) => {
    try {
      let response: any
      if (category?.id) {
        response = await updateCategory({ id: category.id, body: data });
      } else {
        response = await postCategory(data);
      }
      if (response.error) {
        toast.error(response.error?.data?.message || "Something went wrong!");
      } else {
        toast.success(`Category ${category?.id ? 'updated' : 'created'} successfully`);
        refetch();
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    if (category) {
      const { setValue } = form
      setValue("name", category.name);
      setValue("description", category.description);
    }
  }, [category, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="focus:outline-none">
        <DialogHeader>
          <DialogTitle>{category ? 'Update' : 'Create'} Category</DialogTitle>
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
                      <Input placeholder="add category name" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button loading={categoryLoading || updateCategoryLoading} disabled={categoryLoading || updateCategoryLoading} type="submit" className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white">
              {category ? 'Update' : 'Save'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
