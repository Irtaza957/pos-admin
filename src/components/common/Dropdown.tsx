import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

interface DropdownProps {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function Dropdown({ label, options, value, onChange, error }: DropdownProps) {
    return <>
        <Label>{label}</Label>
        <Select name="role" onValueChange={(value) => onChange(value)} value={value}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup className="bg-white">
                    <SelectLabel>{label}</SelectLabel>
                    {options?.length ? options?.map((option, optionIndex) => (
                        <SelectItem key={optionIndex} value={option.value}>
                            {option.label}
                        </SelectItem>
                    )) : <SelectItem value="no-data" disabled>No data found</SelectItem>}
                </SelectGroup>
            </SelectContent>
        </Select>
        {error && <p className="text-red-500 text-sm">{error as string}</p>}
    </>
}
