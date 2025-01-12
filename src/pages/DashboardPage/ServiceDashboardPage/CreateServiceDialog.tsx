import { useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'

type CreateServiceDialogProps = {
    isOpen: boolean
    closeDialog: () => void
    createNewServiceMutation: any 
}

const CreateServiceDialog = ({ isOpen, closeDialog, createNewServiceMutation }: CreateServiceDialogProps) => {
    const [formValues, setFormValues] = useState({
        name: '',
        price: '',
        isAvailable: true,  
    })

    const [errors, setErrors] = useState({
        name: '',
        price: '',
    })

    const handleSubmit = async () => {
        const formErrors = validateFormValues()

        if (!formErrors.name && !formErrors.price) {
            await createNewServiceMutation
                .mutateAsync({ ...formValues }) 
                .then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { name, price } = formValues
        const formErrors = { ...errors }

        if (!name.trim()) formErrors.name = 'Tên dịch vụ không được để trống.'
        if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) formErrors.price = 'Giá dịch vụ phải là số hợp lệ và lớn hơn 0.'

        return formErrors
    }

    const handlePriceChange = (value: string) => {
        if (/[a-zA-Z]/.test(value)) {
            setErrors(prev => ({
                ...prev,
                price: 'Giá trị phải là số, không được chứa chữ cái.',
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                price: '',
            }));
        }
        setFormValues(prev => ({ ...prev, price: value }));
    };

    useEffect(() => {
        if (isOpen) {
            setFormValues({
                name: '',
                price: '',
                isAvailable: true,  
            })
            setErrors({
                name: '',
                price: '',
            })
        }
    }, [isOpen])

    return (
        <DialogContent className="max-w-[600px] bg-white">
            <DialogHeader>
                <DialogTitle>Tạo dịch vụ mới</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="border-b-2"></div>
            <div className="grid grid-cols-1 gap-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
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
                    <div className="mb-4">
                        <TextInput
                            fieldName="price"
                            placeholder="Giá dịch vụ (VND)"
                            error={errors.price}
                            value={formValues.price}
                            onChange={(value: string) => handlePriceChange(value)}  
                            onFocus={() => setErrors(prev => ({ ...prev, price: '' }))}
                            labelClassName="bg-white"
                        />
                        {/*<span className="absolute right-0 top-0 px-2 py-1 text-sm text-gray-500">VND</span>*/}
                    </div>
                    {/* Thêm ô trạng thái "Có sẵn"*/}
                    <div className="mb-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formValues.isAvailable}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, isAvailable: e.target.checked })
                                }
                            />
                            <span>Trạng thái: {formValues.isAvailable ? 'Có sẵn' : 'Không có sẵn'}</span>
                        </label>
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
