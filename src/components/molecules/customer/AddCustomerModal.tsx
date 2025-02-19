"use client"

import { Dispatch, SetStateAction, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { usePostCustomersMutation, useUpdateCustomerMutation } from "@/features/store/services/customer"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postCustomerSchema } from "@/lib/schemas"
import { z } from "zod"
import { toast } from "react-toastify"
import { CustomerType } from "@/lib/types"

type PostCustomerSchema = z.infer<typeof postCustomerSchema>;
interface CreateCustomerModalProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
    refetch: () => void
    selectedCustomer: CustomerType | null
}

export function CreateCustomerModal({ open, setOpen, refetch, selectedCustomer }: CreateCustomerModalProps) {
    const [postCustomer, { isLoading: postCustomerLoading }] = usePostCustomersMutation()
    const [updateCustomer, { isLoading: updateCustomerLoading }] = useUpdateCustomerMutation()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<PostCustomerSchema>({
        resolver: zodResolver(postCustomerSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
        },
    })

    const onSubmit = async (data: PostCustomerSchema) => {
        try {
            let response: any
            if (selectedCustomer?.id) {
                response = await updateCustomer({ id: selectedCustomer.id, data })
            } else {
                response = await postCustomer({ ...data, blackListed: false })
            }
            console.log("response", response)
            if (response.error) {
                toast.error(response.error.data.message || "Something went wrong")
            } else {
                toast.success("Customer created successfully")
                refetch()
                reset()
                setOpen(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (selectedCustomer) {
            setValue("name", selectedCustomer?.name)
            setValue("phone", selectedCustomer?.phone)
            setValue("email", selectedCustomer?.email)
        }
    }, [selectedCustomer, setValue])

    useEffect(() => {
        if (!open) {
            reset()
        }
    }, [open, reset])
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="focus:outline-none">
                <DialogHeader>
                    <DialogTitle>{selectedCustomer?.id ? 'Edit' : 'Create'} Customer</DialogTitle>
                </DialogHeader>
                <form className="grid gap-4 py-4">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Input
                                id="name"
                                label="Name"
                                placeholder="Coca-Cola"
                                {...register("name")}
                                error={errors.name?.message}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Input
                                id="reference"
                                label="Phone"
                                placeholder="081234567890"
                                {...register("phone")}
                                error={errors.phone?.message}
                            />
                        </div>
                    </div>
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Input
                                id="reference"
                                label="Email"
                                placeholder="example@gmail.com"
                                {...register("email")}
                                error={errors.email?.message}
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white"
                        onClick={handleSubmit(onSubmit)}
                        loading={postCustomerLoading || updateCustomerLoading}
                        disabled={postCustomerLoading || updateCustomerLoading}
                    >
                        {selectedCustomer?.id ? 'Update' : 'Save'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}