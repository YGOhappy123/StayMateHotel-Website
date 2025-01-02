import { useEffect, useState } from 'react'
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'

type CreateFeatureDialogProps = {
    isOpen: boolean
    closeDialog: () => void
    createNewFeatureMutation: any // Chỉnh sửa tùy theo dữ liệu API
}

const CreateFeatureDialog = ({ isOpen, closeDialog, createNewFeatureMutation }: CreateFeatureDialogProps) => {
    const [formValues, setFormValues] = useState({
        name: '',
    })

    const [errors, setErrors] = useState({
        name: '',
    })

    const handleSubmit = async () => {
        const formErrors = validateFormValues()

        if (!formErrors.name) {
            await createNewFeatureMutation
                .mutateAsync({ ...formValues }) // Gửi request tạo Feature mới
                .then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { name } = formValues
        const formErrors = { ...errors }

        if (!name.trim()) formErrors.name = 'Tên tiện ích không được để trống.' // Lỗi tên tiện ích trống

        return formErrors
    }

    useEffect(() => {
        if (isOpen) {
            setFormValues({
                name: '',
            })
            setErrors({
                name: '',
            })
        }
    }, [isOpen])

    return (
        <DialogContent className="max-w-[500px] bg-white p-6 rounded-lg shadow-lg">
            <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-center">Tạo tiện ích mới</DialogTitle>
            </DialogHeader>
            <div className="border-b-2"></div>
            <div className="my-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <TextInput
                            fieldName="name"
                            placeholder="Tên tiện ích"
                            error={errors.name}
                            value={formValues.name}
                            onChange={(value: string) => setFormValues(prev => ({ ...prev, name: value }))}
                            onFocus={() => setErrors(prev => ({ ...prev, name: '' }))} // Xóa lỗi khi focus vào
                            labelClassName="bg-white"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-sm"
                        />
                        {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                    </div>
                </form>
            </div>
            <div className="border-b-2"></div>
            <DialogFooter className="flex justify-between mt-6">
                <Button text="Hủy bỏ" variant="danger" onClick={closeDialog} />
                <Button text="Xác nhận" variant="success" onClick={handleSubmit} />
            </DialogFooter>
        </DialogContent>
    )
}

export default CreateFeatureDialog
