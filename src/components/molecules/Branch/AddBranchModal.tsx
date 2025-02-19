"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImagePlus } from "lucide-react";
import { postBranchSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "react-toastify";
import { BranchType } from "@/lib/types";
import { useAddBranchMutation } from "@/features/store/services/branches";
import { uploadImage } from "@/lib/utils";
import Image from "next/image";

interface CreateProductModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    refetch?: () => void;
    selectedBranch?: BranchType;
}

export function CreateBranchModal({ open, setOpen, refetch, selectedBranch }: CreateProductModalProps) {
    const [imageUrl, setImageUrl] = useState<File | string | null>(null);
    const [addBranch, { isLoading: branchLoading }] = useAddBranchMutation();
    // const [postProductImage] = usePostProductImageMutation();
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageUrl(file);
        }
    };

    const { reset, register, formState: { errors }, handleSubmit } = useForm({
        resolver: zodResolver(postBranchSchema),
        defaultValues: {
            name: "",
            mail: "",
            location: "",
            type: '',
            website: '',
        },
    });

    const handleSave = async (data: any) => {
        let imageId;
        try {
            const response: any = await uploadImage(imageUrl as File);
            imageId = response?.data?.data?.id;
        } catch (error) {
            console.log("Branch Image Post Error +++", error);
        }

        let response: any;
        const payload = {
            name: data.name,
            email: data.mail,
            description: '',
            location: data.location,
            type: data.type,
            website: data.website,
            logo: imageId,
        };
        if (selectedBranch?.id) {
            // const payload = {
            //     name: data.name,
            //     description: '',
            //     price: Number(data.price),
            //     image: imageUrl,
            //     quantity: Number(data.quantity),
            //     active: data.active,
            // };
            // response = await updateProduct({ id: selectedBranch?.id, data: payload });
        } else {
            response = await addBranch(payload);
        }

        if (response?.error) {
            toast.error(response?.error?.data?.message || "Something went wrong!");
        } else {
            toast.success("Branch created successfully");
            refetch?.();
            setOpen(false);
            reset();
        }
    };

    // useEffect(() => {
    //     if (selectedBranch) {
    //         console.log("selectedBranch", selectedBranch);
    //         const { setValue } = form;
    //         setValue("name", selectedBranch?.name);
    //         setValue("price", String(selectedBranch?.price));
    //         setValue("restaurant_id", selectedBranch?.restaurant_id);
    //         setValue("category_id", selectedBranch?.category_id);
    //         setValue("sub_category_id", selectedBranch?.sub_category_id);
    //         setValue("active", selectedBranch?.active);
    //         setValue("quantity", String(selectedBranch?.quantity));
    //         setImageUrl(selectedBranch?.image);
    //     }
    // }, [selectedBranch]);

    useEffect(() => {
        if (!open) {
            reset();
            setImageUrl(null);
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="focus:outline-none w-[70%] lg:w-[50%]">
                <DialogHeader>
                    <DialogTitle>{selectedBranch?.id ? "Update" : "Create"} Branch</DialogTitle>
                </DialogHeader>
                <form className="grid gap-4 py-4">
                    <div className="grid gap-4 place-items-center">
                        <div className="relative w-full h-[200px] bg-gray-100 rounded-lg overflow-hidden">
                            {imageUrl ? (
                                <Image src={typeof imageUrl === "object" ? URL.createObjectURL(imageUrl) : imageUrl} alt="Product preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full">
                                    <ImagePlus className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                id="name"
                                label="Name"
                                placeholder="Enter Name"
                                {...register("name")}
                                error={errors.name?.message}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Input
                                    id="mail"
                                    label="Mail"
                                    placeholder="Enter Mail"
                                    {...register("mail")}
                                    error={errors.mail?.message}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                id="location"
                                label="Location"
                                placeholder="Enter Location"
                                {...register("location")}
                                error={errors.location?.message}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                id="type"
                                label="Type"
                                placeholder="Enter Type"
                                {...register("type")}
                                error={errors.type?.message}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                id="website"
                                label="Website"
                                placeholder="Enter Website"
                                {...register("website")}
                                error={errors.website?.message}
                            />
                        </div>
                    </div>
                    <Button onClick={handleSubmit(handleSave)} loading={branchLoading} disabled={branchLoading} type="submit" className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white">
                        {selectedBranch?.id ? "Update" : "Save"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
