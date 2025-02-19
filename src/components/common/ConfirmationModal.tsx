import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'

interface ConfirmationModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    loading?: boolean;
}

const ConfirmationModal = ({ open, setOpen, title, description, onConfirm, loading }: ConfirmationModalProps) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="focus:outline-none w-[35%]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div>
                    {description && <DialogDescription className="mt-4 text-primary_text font-semibold text-lg text-center">{description}</DialogDescription>}
                    <div className="flex gap-2 mt-10 w-6/12 float-end">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className='w-full bg-red-500 hover:bg-red-600 text-white'
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={loading}
                            loading={loading}
                            onClick={onConfirm}
                            className='w-full bg-green-500 hover:bg-green-600 text-white'
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmationModal