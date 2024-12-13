import { useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'

import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'

type UpdateFloorDialogProps = {
    selectedFloor: IFloor | null
    isOpen: boolean
    closeDialog: () => void
    updateFloorMutation: any
}

const UpdateFloorDialog = ({ selectedFloor, isOpen, closeDialog, updateFloorMutation }: UpdateFloorDialogProps) => {
    const [formValues, setFormValues] = useState({
        floorNumber: ''
    })

    const [errors, setErrors] = useState({
        floorNumber: ''
    })

    const handleSubmit = async () => {
        const formErrors = validateFormValues()

        if (!formErrors.floorNumber) {
            await updateFloorMutation
                .mutateAsync({
                    floorId: selectedFloor?.id!,
                    data: { ...formValues }
                })
                .then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { floorNumber } = formValues
        const formErrors = { ...errors }

        if (!floorNumber.trim()) formErrors.floorNumber = formErrors.floorNumber || 'Mã tầng không được để trống.'

        return formErrors
    }

    useEffect(() => {
        if (isOpen && selectedFloor) {
            setFormValues({
                floorNumber: selectedFloor.floorNumber
            })
            setErrors({
                floorNumber: ''
            })
        }
    }, [isOpen])

    return (
        <DialogContent className="max-w-[500px] bg-white">
            <DialogHeader>
                <DialogTitle>Cập nhật thông tin tầng</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="border-b-2"></div>
            <div className="grid grid-cols-1 gap-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <TextInput
                            fieldName="floorNumber"
                            placeholder="Số tầng"
                            error={errors.floorNumber}
                            value={formValues.floorNumber}
                            onChange={(value: string) => setFormValues(prev => ({ ...prev, floorNumber: value }))}
                            onFocus={() => setErrors(prev => ({ ...prev, floorNumber: '' }))}
                            labelClassName="bg-white"
                        />
                    </div>
                </form>
            </div>
            <div className="border-b-2"></div>
            <DialogFooter>
                <Button text="Hủy bỏ" variant="danger" onClick={closeDialog} />
                <Button text="Xác nhận" variant="success" onClick={handleSubmit} />
            </DialogFooter>
        </DialogContent>
    )
}

export default UpdateFloorDialog
