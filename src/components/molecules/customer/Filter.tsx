import FiltersLayout from "@/components/common/FiltersLayout"
import { Input } from "@/components/ui/input"
import { CustomerFilterType } from "@/lib/types"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
interface CustomerFilterProps {
    filterData: CustomerFilterType,
    handleFilter: (filters: CustomerFilterType) => void
    handleResetFilter: () => void
    setOpenFilter: Dispatch<SetStateAction<boolean>>
}

export default function CustomerFilter({ filterData, handleFilter, handleResetFilter, setOpenFilter }: CustomerFilterProps) {
    const [filter, setFilter] = useState<CustomerFilterType>({
        name: '',
        phone_number: '',
        email: '',
        last_order_date: '',
        status: '',
        withDeleted: 'false',
    })

    const handleApplyFilter = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        handleFilter(filter)
    }

    useEffect(() => {
        setFilter(filterData)
    }, [filterData])

    return (
        <FiltersLayout handleResetFilter={handleResetFilter} handleApplyFilter={handleApplyFilter} setOpenFilter={setOpenFilter}>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Input
                        id="name"
                        label="Name"
                        placeholder="Enter name"
                        value={filter.name}
                        onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                    />
                </div>
                <div className="grid gap-2">
                    <Input
                        id="phone_number"
                        label="Phone"
                        placeholder="Enter phone"
                        value={filter.phone_number}
                        type="number"
                        onChange={(e) => setFilter({ ...filter, phone_number: e.target.value })}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Input
                        id="email"
                        label="Email"
                        placeholder="Enter email"
                        value={filter.email}
                        onChange={(e) => setFilter({ ...filter, email: e.target.value })}
                    />
                </div>
                <div className="grid gap-2">
                    <Input
                        id="last_order_date"
                        label="Last Order Date"
                        placeholder="Enter last order date"
                        type="date"
                        value={filter.last_order_date}
                        onChange={(e) => setFilter({ ...filter, last_order_date: e.target.value })}
                    />
                </div>
            </div>
            <div className="grid gap-4">
                <div className="gap-2">
                    <Input
                        id="status"
                        label="Status"
                        placeholder="Enter status"
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    />
                </div>
            </div>
        </FiltersLayout>
        // <Card className="w-full max-w-md absolute top-10 right-0 bg-white mt-1">
        //     <CardContent className="p-6">
        //         <form className="grid gap-6">

        //             <div className="flex gap-2">
        //                 <Button onClick={handleResetFilter} variant="outline" className="w-full text-white bg-red-500 hover:bg-red-600">
        //                     Reset
        //                 </Button>
        //                 <Button onClick={handleApplyFilter} className="w-full text-white bg-emerald-500 hover:bg-emerald-600">
        //                     Save
        //                 </Button>
        //             </div>
        //         </form>
        //     </CardContent>
        // </Card>
    )
}

