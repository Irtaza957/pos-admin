import React, { Dispatch, SetStateAction } from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
interface FiltersLayoutProps {
    children: React.ReactNode;
    handleResetFilter: (e?: React.FormEvent<HTMLButtonElement>) => void;
    handleApplyFilter: (e: React.FormEvent<HTMLButtonElement>) => void;
    setOpenFilter?: Dispatch<SetStateAction<boolean>>
}

const FiltersLayout = ({ children, handleResetFilter, handleApplyFilter }: FiltersLayoutProps) => {
    // const ref = useRef<HTMLDivElement>(null);
    // useOnClickOutside(ref, () => setOpenFilter(false));
    return (
        <Card className="w-full max-w-md absolute top-10 right-0 bg-white mt-1">
            <CardContent className="p-6">
                <div className="grid gap-6">
                    {children}
                    <div className="flex gap-2">
                        <Button onClick={handleResetFilter} variant="outline" className="w-full text-white bg-red-500 hover:bg-red-600">
                            Reset
                        </Button>
                        <Button onClick={handleApplyFilter} className="w-full text-white bg-emerald-500 hover:bg-emerald-600">
                            Save
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default FiltersLayout