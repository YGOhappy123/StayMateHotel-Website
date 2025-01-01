import { useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'

type CreateServiceDialogProps = {
    isOpen: boolean
    closeDialog: () => void
    createNewServiceMutation: any // Chỉnh sửa tùy theo dữ liệu API
}

const CreateServiceDialog = ({ isOpen, closeDialog, createNewServiceMutation }: CreateServiceDialogProps) => {
    const [formValues, setFormValues] = useState({
        name: '',
        price: '',
        description: '',
        isAvailable: true,
    })

    const [errors, setErrors] = useState({
        name: '',
        price: '',
        description: '',
    })

    const handleSubmit = async () => {
        const formErrors = validateFormValues()

        if (!formErrors.name && !formErrors.price && !formErrors.description) {
            await createNewServiceMutation
                .mutateAsync({ ...formValues }) // Gửi request tạo Service mới
                .then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { name, price, description } = formValues
        const formErrors = { ...errors }

        if (!name.trim()) formErrors.name = formErrors.name || 'Tên dịch vụ không được để trống.'
        if (!price.trim() || isNaN(Number(price))) formErrors.price = formErrors.price || 'Giá dịch vụ phải là số hợp lệ.'
        if (!description.trim()) formErrors.description = formErrors.description || 'Mô tả dịch vụ không được để trống.'

        return formErrors
    }

    useEffect(() => {
        if (isOpen) {
            setFormValues({
                name: '',
                price: '',
                description: '',
                isAvailable: true,
            })
            setErrors({
                name: '',
                price: '',
                description: '',
            })
        }
    }, [isOpen])

    return (
        <DialogContent className="max-w-[1000px] bg-white">
            <DialogHeader>
                <DialogTitle>Tạo dịch vụ mới</DialogTitle>
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
                            onFocus={() => setErrors(prev => ({ ...prev, name: '' }))} // Xóa lỗi khi focus
                            labelClassName="bg-white"
                        />
                    </div>
                    <div className="mb-10">
                        <TextInput
                            fieldName="price"
                            placeholder="Giá dịch vụ"
                            error={errors.price}
                            value={formValues.price}
                            onChange={(value: string) => setFormValues(prev => ({ ...prev, price: value }))}
                            onFocus={() => setErrors(prev => ({ ...prev, price: '' }))} // Xóa lỗi khi focus
                            labelClassName="bg-white"
                        />
                    </div>
                    <div className="mb-10">
                        <TextInput
                            fieldName="description"
                            placeholder="Mô tả dịch vụ"
                            error={errors.description}
                            value={formValues.description}
                            onChange={(value: string) => setFormValues(prev => ({ ...prev, description: value }))}
                            onFocus={() => setErrors(prev => ({ ...prev, description: '' }))} // Xóa lỗi khi focus
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

export default CreateServiceDialog
