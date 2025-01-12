import { useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'

type UpdateFeatureDialogProps = {
    selectedFeature: IFeature | null
    isOpen: boolean
    closeDialog: () => void
    updateFeatureMutation: any 
}

const UpdateFeatureDialog = ({ selectedFeature, isOpen, closeDialog, updateFeatureMutation }: UpdateFeatureDialogProps) => {
    const [formValues, setFormValues] = useState({
        name: '',
        //description: '',
    })

    const [errors, setErrors] = useState({
        name: '',
        //description: '',
    })

    const handleSubmit = async () => {
        const formErrors = validateFormValues()

        if (!formErrors.name ) {
            await updateFeatureMutation
                .mutateAsync({
                    featureId: selectedFeature?.id!,
                    data: { ...formValues }
                })
                .then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { name } = formValues
        const formErrors = { ...errors }

        if (!name.trim()) formErrors.name = formErrors.name || 'Tên tiện ích không được để trống.'

        return formErrors
    }

    useEffect(() => {
        if (isOpen && selectedFeature) {
            setFormValues({
                name: selectedFeature.name,
            })
            setErrors({
                name: '',
            })
        }
    }, [isOpen, selectedFeature])

    return (
        <DialogContent className="max-w-[1000px] bg-white">
            <DialogHeader>
                <DialogTitle>Cập nhật thông tin tiện ích</DialogTitle>
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
                            onFocus={() => setErrors(prev => ({ ...prev, name: '' }))}
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

export default UpdateFeatureDialog
