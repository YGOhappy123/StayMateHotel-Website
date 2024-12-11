import { ReactElement, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import Button from '@/components/common/Button'

type ConfirmationDialogProps = {
    Trigger: ReactElement
    title: string
    body: string
    dialogClassName?: string
    onConfirm: () => Promise<void>
}

const ConfirmationDialog = ({ Trigger, title, body, dialogClassName, onConfirm }: ConfirmationDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleClose = () => {
        setIsOpen(false)
    }

    const handleConfirm = async () => {
        await onConfirm().then(() => setIsOpen(false))
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{Trigger}</DialogTrigger>
            <DialogContent className={twMerge(`bg-white ${dialogClassName}`)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="border-b-2"></div>
                <p>{body}</p>
                <div className="border-b-2"></div>
                <DialogFooter>
                    <Button text="Hủy bỏ" variant="danger" onClick={handleClose} />
                    <Button text="Xác nhận" variant="success" onClick={handleConfirm} />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmationDialog
