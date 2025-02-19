"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImagePlus } from "lucide-react";
import { postEmployeeSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "react-toastify";
import { BranchEmployeeType, BranchType } from "@/lib/types";
import { useAddEmployeeMutation, useFetchStoresQuery, useUpdateEmployeeMutation } from "@/features/store/services/branches";
import { roles } from "@/lib/constants";
import { Dropdown } from "@/components/common/Dropdown";
import { getImageUrl, uploadImage } from "@/lib/utils";
import Image from "next/image";

interface PostEmployeeSchema {
    name: string;
    job_title: string;
    role: string;
    restaurant_id: string;
    department: string;
    mail: string;
    password: string;
    phone: string;
    username: string;
}
interface CreateEmployeeModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    refetch?: () => void;
    selectedEmployee?: BranchEmployeeType | null;
}

export function CreateEmployeeModal({ open, setOpen, refetch, selectedEmployee }: CreateEmployeeModalProps) {
    const [imageUrl, setImageUrl] = useState<File | string | null>(null);

    const { data: storeData } = useFetchStoresQuery({}, {
        skip: !open,
        refetchOnMountOrArgChange: true,
    });
    const [addEmployee, { isLoading: employeeLoading }] = useAddEmployeeMutation();
    const [updateEmployee, { isLoading: employeeUpdateLoading }] = useUpdateEmployeeMutation();
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageUrl(file);
        }
    };
    const {
        reset,
        register,
        formState: { errors },
        setValue,
        handleSubmit,
        watch,
    } = useForm({
        resolver: zodResolver(postEmployeeSchema),
        defaultValues: {
            name: "",
            job_title: "",
            role: "",
            restaurant_id: "",
            department: '',
            mail: '',
            password: '',
            phone: '',
            username: '',
        },
    });
    const role = watch("role");
    const restaurant_id = watch("restaurant_id");

    const handleSave = async (data: PostEmployeeSchema) => {
        let imageId
        try {
            const response: any = await uploadImage(imageUrl as File);
            imageId = response?.data?.data?.id;
        } catch (error) {
            console.log("Product Image Post Error +++", error);
        }

        let response: any;
        const payload = {
            name: data.name,
            username: data.username,
            email: data.mail,
            password: data.password,
            phone_number: data.phone,
            role: data.role,
            department: data.department,
            restaurant_id: data.restaurant_id,
            job_title: data.job_title,
            profile_image: imageId,
        };
        if (selectedEmployee?.id) {
            response = await updateEmployee({ id: selectedEmployee?.id, data: payload });
        } else {
            response = await addEmployee(payload);
        }

        if (response?.error) {
            toast.error(response?.error?.data?.message || "Something went wrong!");
        } else {
            toast.success(`${selectedEmployee?.id ? "Updated" : "Created"} successfully`);
            refetch?.();
            setOpen(false);
            reset();
        }
    };

    useEffect(() => {
        if (selectedEmployee) {
            console.log("selectedEmployee", selectedEmployee);
            setValue("name", selectedEmployee?.name);
            setValue("username", selectedEmployee?.username);
            setValue("role", selectedEmployee?.role);
            setValue("restaurant_id", selectedEmployee?.restaurant_id);
            setValue("department", selectedEmployee?.department);
            setValue("mail", selectedEmployee?.email);
            setValue("password", selectedEmployee?.password);
            setValue("phone", selectedEmployee?.phone_number);
            setValue("job_title", selectedEmployee?.job_title);
            setImageUrl(getImageUrl(selectedEmployee?.imageObject?.id));
        }
    }, [selectedEmployee, setValue]);

    useEffect(() => {
        if (!open) {
            reset();
            setImageUrl(null);
        }
    }, [open, reset]);
    console.log(errors, "errorserrors");
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="focus:outline-none">
                <DialogHeader>
                    <DialogTitle>{selectedEmployee?.id ? "Update" : "Create"} Employee</DialogTitle>
                </DialogHeader>
                <form className="grid gap-4 py-4">
                    <div className="grid gap-4 place-items-center">
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
                        <div className="space-y-2">
                            <Input
                                id="username"
                                label="Username"
                                placeholder="Enter Username"
                                {...register("username")}
                                error={errors.username?.message}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                id="job_title"
                                label="Job Title"
                                placeholder="Enter Job Title"
                                {...register("job_title")}
                                error={errors.job_title?.message}
                            />
                        </div>
                        <div className="space-y-2">
                            <Dropdown
                                label="Role"
                                options={roles}
                                value={role}
                                onChange={(value) => setValue("role", value)}
                                error={errors.role?.message}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Dropdown
                                label="Restaurant"
                                options={storeData?.data?.map((store: BranchType) => ({ value: store.id, label: store.name }))}
                                value={restaurant_id}
                                onChange={(value) => setValue("restaurant_id", value)}
                                error={errors.restaurant_id?.message}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                id="department"
                                label="Department"
                                placeholder="Enter Department"
                                {...register("department")}
                                error={errors.department?.message}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                id="mail"
                                label="Mail"
                                placeholder="Enter Mail"
                                {...register("mail")}
                                error={errors.mail?.message}
                            />
                        </div>
                        {selectedEmployee?.id ?
                            <div className="space-y-2">
                                <Input
                                    id="phone"
                                    label="Phone"
                                    placeholder="Enter Phone"
                                    {...register("phone")}
                                    error={errors.phone?.message}
                                />
                            </div> :
                            <div className="space-y-2">
                                <Input
                                    id="password"
                                    label="Password"
                                    placeholder="Enter Password"
                                    {...register("password")}
                                    error={errors.password?.message}
                                />
                            </div>
                        }
                    </div>
                    {!selectedEmployee?.id ?
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input
                                    id="phone"
                                    label="Phone"
                                    placeholder="Enter Phone"
                                    {...register("phone")}
                                    error={errors.phone?.message}
                                />
                            </div>
                        </div> : null
                    }
                    <Button onClick={handleSubmit(handleSave)} loading={employeeLoading || employeeUpdateLoading} disabled={employeeLoading || employeeUpdateLoading} type="submit" className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white">
                        {selectedEmployee?.id ? "Update" : "Save"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
