import { useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'



type UpdateRoomClassDialogProps = {
    selectedRoomClass: IRoomClass | null
    isOpen: boolean
    closeDialog: () => void
    updateRoomClassMutation: any
    
}

const UpdateRoomClassDialog = ({ selectedRoomClass, isOpen, closeDialog, updateRoomClassMutation}: UpdateRoomClassDialogProps) => {
    
    

    const [formValues, setFormValues] = useState({
        className: '',
        basePrice: 0,
        capacity: 0,
    
    })

    const [errors, setErrors] = useState({
        className: '',
        basePrice: '',
        capacity: '',
    })

    const handleSubmit = async () => {
        const formErrors = validateFormValues()

        if (!formErrors.className) {
            await updateRoomClassMutation
                .mutateAsync({
                    roomClassId: selectedRoomClass?.id!,
                    data: { ...formValues}
                })
                .then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { className} = formValues
        const formErrors = { ...errors }

        if (!className.trim()) formErrors.className = formErrors.className || 'Tên loại phòng không được để trống.'
       

        return formErrors
    }

    useEffect(() => {
        if (isOpen && selectedRoomClass) {
            setFormValues({
                className: selectedRoomClass.className,
                basePrice: selectedRoomClass.basePrice,
                capacity: selectedRoomClass.capacity,
            })
            
            setErrors({
                className: '',
                basePrice: '',
                capacity: '',
                
            })
        }
    }, [isOpen])

    return (
        <DialogContent className="max-w-[1000px] bg-white">
            <DialogHeader>
                <DialogTitle>Cập nhật thông tin loại phòng</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="border-b-2"></div>
            <div className="grid grid-cols-2 gap-4">
                <div>images carousel</div>

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
                            onChange={(value: string) => 
                                setFormValues(prev => ({ ...prev, basePrice: Number(value) }))
                            }
                            onFocus={() => 
                                setErrors(prev => ({ ...prev, basePrice: '' }))
                            }
                            labelClassName="bg-white"
                        />
                    </div>

                    <div className="mb-10">
                        <TextInput
                            fieldName="capacity"
                            placeholder="Số Lượng Người"
                            error={errors.capacity}
                            value={formValues.capacity.toString()}
                            onChange={(value: string) => 
                                setFormValues(prev => ({ ...prev, capacity: Number(value) }))
                            }
                            onFocus={() => 
                                setErrors(prev => ({ ...prev, capacity: '' }))
                            }
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

export default UpdateRoomClassDialog
