import { useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'

import roomClassService from '@/services/roomClassService'

type CreateRoomClassDialogProps = {
    isOpen: boolean
    closeDialog: () => void
    createNewRoomClassMutation: any
}

const CreateRoomClassDialog = ({ isOpen, closeDialog, createNewRoomClassMutation }: CreateRoomClassDialogProps) => {


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

        if (!formErrors.className && !formErrors.basePrice && !formErrors.capacity) {
            await createNewRoomClassMutation.mutateAsync({ ...formValues}).then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { className, basePrice, capacity } = formValues
        const formErrors = { ...errors }

        if (!className.trim()) formErrors.className = formErrors.className || 'Tên loại phòng không được để trống.'
        if (basePrice < 0) formErrors.basePrice = formErrors.basePrice || 'Giá tiền không được âm.'
        if (basePrice > 2147483647) formErrors.basePrice = formErrors.basePrice || 'Giá tiền vượt mức quy định.'
        if (capacity < 0) formErrors.capacity = formErrors.capacity || 'Số lượng không được âm.'
        if (capacity > 2147483647) formErrors.capacity = formErrors.capacity || 'Số lượng vượt mức quy định.'

        return formErrors
    }

    useEffect(() => {
        if (isOpen) {
            setFormValues({
                className: '',
                basePrice: 0,
                capacity: 0,
             
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
                <DialogTitle>Tạo loại phòng mới</DialogTitle>
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
                            type='number'
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
                            type='number'
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