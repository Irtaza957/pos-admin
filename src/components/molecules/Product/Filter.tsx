import FiltersLayout from "@/components/common/FiltersLayout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductFilterType } from "@/lib/types"
import { Dispatch, SetStateAction, useState } from "react"
interface ProductFilterProps {
    handleFilter: (filter: ProductFilterType) => void
    handleClearFilter: () => void
    setOpenFilter: Dispatch<SetStateAction<boolean>>
}

export default function ProductFilter({ handleFilter, handleClearFilter, setOpenFilter }: ProductFilterProps) {
    const [filter, setFilter] = useState<ProductFilterType>({
        name: '',
        price: '',
        category: '',
        date: '',
        withDeleted: 'false',
        orderStatus: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ ...filter, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        handleFilter(filter)
    }

    return (
        <FiltersLayout setOpenFilter={setOpenFilter} handleResetFilter={handleClearFilter} handleApplyFilter={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter name" onChange={handleChange} name="name" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" placeholder="Enter name" type="date" onChange={handleChange} name="date" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" placeholder="Enter name" onChange={handleChange} name="category" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                        id="price"
                        placeholder="Enter name"
                        type="number"
                        min="0"
                        step="0.01"
                        onChange={handleChange}
                        name="price"
                    />
                </div>
            </div>
        </FiltersLayout>
    )
}

