import { useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'

type CreateRoomClassDialogProps = {
    features: IFeature[]
    isOpen: boolean
    closeDialog: () => void
    createNewRoomClassMutation: any
}

const CreateRoomClassDialog = ({ features, isOpen, closeDialog, createNewRoomClassMutation }: CreateRoomClassDialogProps) => {
    const [roomFeatures, setRoomFeatures] = useState<IRoomClassFeature[]>([])
    const [formValues, setFormValues] = useState({
        className: '',
        basePrice: 0,
        capacity: 0
    })

    const [errors, setErrors] = useState({
        className: '',
        basePrice: '',
        capacity: ''
    })

    const handleSubmit = async () => {
        const formErrors = validateFormValues()

        if (!formErrors.className && !formErrors.basePrice && !formErrors.capacity) {
            await createNewRoomClassMutation
                .mutateAsync({ ...formValues, features: [...roomFeatures].sort((a, b) => a.featureId - b.featureId) })
                .then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { className, basePrice, capacity } = formValues
        const formErrors = { ...errors }

        if (!className.trim()) formErrors.className = formErrors.className || 'Tên loại phòng không được để trống.'
        if (basePrice <= 0) formErrors.basePrice = formErrors.basePrice || 'Giá tiền không được âm hoặc bằng 0.'
        if (basePrice > 2147483647) formErrors.basePrice = formErrors.basePrice || 'Giá tiền vượt mức quy định.'
        if (capacity <= 0) formErrors.capacity = formErrors.capacity || 'Số lượng không được âm hoặc bằng 0.'
        if (capacity > 2147483647) formErrors.capacity = formErrors.capacity || 'Số lượng vượt mức quy định.'

        return formErrors
    }

    useEffect(() => {
        if (isOpen) {
            setFormValues({
                className: '',
                basePrice: 0,
                capacity: 0
            })
            setRoomFeatures([])
            setErrors({
                className: '',
                basePrice: '',
                capacity: ''
            })
        }
    }, [isOpen])

    return (
        <DialogContent className="max-w-[1000px] bg-white">
            <DialogHeader>
                <DialogTitle>Tạo loại phòng mới</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="border-b-2"></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex max-h-[240px] flex-col gap-2 overflow-y-auto pr-1">
                    <h3 className="mb-2 text-lg font-semibold">Chọn tiện ích của phòng</h3>
                    {features.map(feature => (
                        <div key={feature.id} className="flex items-center gap-2">
                            <p className="flex-1 truncate">{feature.name}</p>
                            <input
                                type="number"
                                className="block min-h-[auto] w-20 rounded border-2 border-neutral-500 bg-transparent px-3 font-medium leading-[2.15] text-primary caret-primary outline-none transition-all duration-200 ease-linear focus:border-primary"
                                value={roomFeatures.find(ft => ft.featureId === feature.id)?.quantity ?? '0'}
                                onKeyDown={e => e.preventDefault()}
                                onChange={e => {
                                    const value = Number.parseInt(e.target.value)
                                    setRoomFeatures(prev => {
                                        if (value > 0) {
                                            const existingFeature = prev.find(ft => ft.featureId === feature.id)
                                            if (existingFeature) {
                                                return prev.map(ft => (ft.featureId === feature.id ? { ...ft, quantity: value } : ft))
                                            } else {
                                                return [...prev, { featureId: feature.id, quantity: value }]
                                            }
                                        } else {
                                            return prev.filter(ft => ft.featureId !== feature.id)
                                        }
                                    })
                                }}
                            />
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-10">
                        <TextInput
                            fieldName="className"
                            placeholder="Tên loại phòng"
                            error={errors.className}
                            value={formValues.className}
                            onChange={(value: string) => setFormValues(prev => ({ ...prev, className: value }))}
                            onFocus={() => setErrors(prev => ({ ...prev, className: '' }))}
                            labelClassName="bg-white"
                        />
                    </div>
                    <div className="mb-10">
                        <TextInput
                            fieldName="basePrice"
                            placeholder="Giá Loại phòng"
                            error={errors.basePrice}
                            value={formValues.basePrice.toString()}
                            onChange={(value: string) => setFormValues(prev => ({ ...prev, basePrice: Number(value) }))}
                            onFocus={() => setErrors(prev => ({ ...prev, basePrice: '' }))}
                            type="number"
                            labelClassName="bg-white"
                        />
                    </div>

                    <div>
                        <TextInput
                            fieldName="capacity"
                            placeholder="Số Lượng Người"
                            error={errors.capacity}
                            value={formValues.capacity.toString()}
                            onChange={(value: string) => setFormValues(prev => ({ ...prev, capacity: Number(value) }))}
                            onFocus={() => setErrors(prev => ({ ...prev, capacity: '' }))}
                            type="number"
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

export default CreateRoomClassDialog
