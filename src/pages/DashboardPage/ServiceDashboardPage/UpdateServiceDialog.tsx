import { useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'
import NumberInput from '@/components/common/NumberInput' 

type UpdateServiceDialogProps = {
    selectedService: IService | null
    isOpen: boolean
    closeDialog: () => void
    updateServiceMutation: any 
}

const UpdateServiceDialog = ({ selectedService, isOpen, closeDialog, updateServiceMutation }: UpdateServiceDialogProps) => {
    const [formValues, setFormValues] = useState({
        name: '',
        price: 0, 
        isAvailable: false 
    })

    const [errors, setErrors] = useState({
        name: '',
        price: ''
    })

    const handleSubmit = async () => {
        const formErrors = validateFormValues()

        if (!formErrors.name && !formErrors.price) {
            await updateServiceMutation
                .mutateAsync({
                    serviceId: selectedService?.id!,  
                    data: { ...formValues }
                })
                .then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { name, price } = formValues
        const formErrors = { ...errors }

        if (!name.trim()) formErrors.name = formErrors.name || 'Tên dịch vụ không được để trống.'
        if (price <= 0) formErrors.price = formErrors.price || 'Giá dịch vụ phải lớn hơn 0.'

        return formErrors
    }

    useEffect(() => {
        if (isOpen && selectedService) {
            setFormValues({
                name: selectedService.name,
                price: selectedService.price,
                isAvailable: selectedService.isAvailable
            })
            setErrors({
                name: '',
                price: ''
            })
        }
    }, [isOpen, selectedService])

    return (
        <DialogContent className="max-w-[1000px] bg-white">
            <DialogHeader>
                <DialogTitle>Cập nhật thông tin dịch vụ</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="border-b-2"></div>
            <div className="grid grid-cols-2 gap-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-10">
                        <TextInput
                            fieldName="name"
                            placeholder="Tên dịch vụ"
                            error={errors.name}
                            value={formValues.name}
                            onChange={(value: string) => setFormValues(prev => ({ ...prev, name: value }))}
                            onFocus={() => setErrors(prev => ({ ...prev, name: '' }))}
                            labelClassName="bg-white"
                        />
                    </div>

                    <div className="mb-10">
                        <NumberInput
                            fieldName="price"
                            placeholder="Giá dịch vụ"
                            error={errors.price}
                            value={formValues.price}
                            onChange={(value: number) => setFormValues(prev => ({ ...prev, price: value }))}
                            onFocus={() => setErrors(prev => ({ ...prev, price: '' }))}
                            labelClassName="bg-white"
                        />
                    </div>

                    <div className="mb-10">
                        <label className="block font-medium text-sm text-gray-700">Trạng thái</label>
                        <input
                            type="checkbox"
                            checked={formValues.isAvailable}
                            onChange={() => setFormValues(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                            className="border p-2 rounded-md"
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

export default UpdateServiceDialog
