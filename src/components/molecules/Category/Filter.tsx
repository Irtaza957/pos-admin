import FiltersLayout from "@/components/common/FiltersLayout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CategoryFilterType } from "@/lib/types"
import { useEffect, useState } from "react"
import { Dispatch, SetStateAction } from "react"

interface CategoryFilterProps {
    handleFilter: (filter: CategoryFilterType) => void
    handleClearFilter: () => void
    filters: CategoryFilterType
    setOpenFilter: Dispatch<SetStateAction<boolean>>
}

export default function CategoryFilter({ filters, handleFilter, handleClearFilter, setOpenFilter }: CategoryFilterProps) {
    const [filter, setFilter] = useState<CategoryFilterType>({
        name: '',
        date: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ ...filter, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        handleFilter(filter)
    }

    const handleClear = (e?: React.FormEvent<HTMLButtonElement>) => {
        e?.preventDefault()
        setFilter({
            name: '',
            date: '',
        })
        handleClearFilter()
    }

    useEffect(() => {
        if (filters) {
            setFilter(filters)
        }
    }, [filters])

    return (
        <FiltersLayout setOpenFilter={setOpenFilter} handleResetFilter={handleClear} handleApplyFilter={handleSubmit}>
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
        </FiltersLayout>
    )
}

