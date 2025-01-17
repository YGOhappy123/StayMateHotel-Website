import { useEffect, useState } from 'react'
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'

type CreateFeatureDialogProps = {
    isOpen: boolean
    closeDialog: () => void
    createNewFeatureMutation: any 
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
                .mutateAsync({ ...formValues }) 
                .then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { name } = formValues
        const formErrors = { ...errors }

        if (!name.trim()) formErrors.name = 'Tên tiện ích không được để trống.' 
        else if (name.trim().length > 50) formErrors.name = 'Tên tiện ích không được vượt quá 50 ký tự.'

        return formErrors
    }

    const handleNameChange = (value: string) => {
        const trimmedValue = value.trim();
        if (trimmedValue.length > 50) {
            setErrors(prev => ({
                ...prev,
                name: 'Tên tiện ích không được vượt quá 50 ký tự.',
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                name: '',
            }));
        }
        setFormValues(prev => ({ ...prev, name: trimmedValue }));
    };

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
                            onChange={(value: string) => handleNameChange(value)} 
                            onFocus={() => setErrors(prev => ({ ...prev, name: '' }))} 
                            labelClassName="bg-white"
                        />
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
