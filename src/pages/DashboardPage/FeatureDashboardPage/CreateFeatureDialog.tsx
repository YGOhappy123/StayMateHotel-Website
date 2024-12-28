import { useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
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
        description: '',
    })

    const [errors, setErrors] = useState({
        name: '',
        description: '',
    })

    const handleSubmit = async () => {
        const formErrors = validateFormValues()

        if (!formErrors.name && !formErrors.description) {
            await createNewFeatureMutation
                .mutateAsync({ ...formValues }) // Gửi request tạo Feature mới
                .then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { name, description } = formValues
        const formErrors = { ...errors }

        if (!name.trim()) formErrors.name = formErrors.name || 'Tên tiện ích không được để trống.'
        if (!description.trim()) formErrors.description = formErrors.description || 'Mô tả tiện ích không được để trống.'

        return formErrors
    }

    useEffect(() => {
        if (isOpen) {
            setFormValues({
                name: '',
                description: '',
            })
            setErrors({
                name: '',
                description: '',
            })
        }
    }, [isOpen])

    return (
        <DialogContent className="max-w-[1000px] bg-white">
            <DialogHeader>
                <DialogTitle>Tạo tiện ích mới</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="border-b-2"></div>
            <div className="grid grid-cols-2 gap-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-10">
                        <TextInput
                            fieldName="name"
                            placeholder="Tên tiện ích"
                            error={errors.name}
                            value={formValues.name}
                            onChange={(value: string) => setFormValues(prev => ({ ...prev, name: value }))}
                            onFocus={() => setErrors(prev => ({ ...prev, name: '' }))} // Xóa lỗi khi focus
                            labelClassName="bg-white"
                        />
                    </div>
                    {/*<div className="mb-10">*/}
                    {/*    <TextInput*/}
                    {/*        //fieldName="description"*/}
                    {/*       // placeholder="Mô tả tiện ích"*/}
                    {/*        error={errors.description}*/}
                    {/*        value={formValues.description}*/}
                    {/*        onChange={(value: string) => setFormValues(prev => ({ ...prev, description: value }))}*/}
                    {/*        onFocus={() => setErrors(prev => ({ ...prev, description: '' }))} // Xóa lỗi khi focus*/}
                    {/*        labelClassName="bg-white"*/}
                    {/*    />*/}
                    {/*</div>*/}
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

export default CreateFeatureDialog
