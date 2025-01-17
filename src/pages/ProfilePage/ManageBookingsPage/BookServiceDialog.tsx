import { useEffect, useState } from 'react'
import { UseMutationResult, UseQueryResult } from 'react-query'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { BookServicePayload } from '@/services/serviceReservationService'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'
import SelectInput from '@/components/common/SelectInput'

type BookServiceDialogProps = {
    isOpen: boolean
    closeDialog: () => void
    bookingId: number
    services: IService[]
    bookServiceMutation: UseMutationResult<any, Error, BookServicePayload, unknown>
    fetchMyBookingsQuery: UseQueryResult<IResponseData<IBooking[]>, unknown>
}

const BookServiceDialog = ({ isOpen, closeDialog, bookingId, services, bookServiceMutation, fetchMyBookingsQuery }: BookServiceDialogProps) => {
    const [formValues, setFormValues] = useState({
        serviceId: 0,
        quantity: 0
    })

    const [errors, setErrors] = useState({
        serviceId: '',
        quantity: ''
    })

    const handleSubmit = async () => {
        const formErrors = validateFormValues()

        if (!formErrors.serviceId && !formErrors.quantity) {
            await bookServiceMutation
                .mutateAsync({
                    bookingId: bookingId,
                    serviceId: formValues.serviceId,
                    quantity: formValues.quantity
                })
                .then(() => fetchMyBookingsQuery.refetch())
                .then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { serviceId, quantity } = formValues
        const formErrors = { ...errors }

        if (!serviceId) formErrors.serviceId = formErrors.serviceId || 'Loại dịch vụ không được để trống.'
        if (quantity <= 0) formErrors.quantity = formErrors.quantity || 'Số lượng không được bằng 0.'
        if (quantity > 100) formErrors.quantity = formErrors.quantity || 'Số lượng không lớn hơn 100.'

        return formErrors
    }

    useEffect(() => {
        if (isOpen) {
            setFormValues({
                serviceId: 0,
                quantity: 0
            })
            setErrors({
                serviceId: '',
                quantity: ''
            })
        }
    }, [isOpen])

    return (
        <DialogContent className="max-w-[500px] bg-white">
            <DialogHeader>
                <DialogTitle>Đặt dịch vụ</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="border-b-2"></div>
            <p className="mb-3">
                Hãy chọn loại dịch vụ và số lượng bạn muốn đặt. Bạn sẽ chỉ phải chi trả các dịch vụ đã được bàn giao. Dịch vụ sẽ được thoanh toán sau
                khi bạn trả phòng.
            </p>
            <div className="grid grid-cols-1 gap-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-10">
                        <SelectInput
                            fieldName="serviceId"
                            placeholder="Dịch vụ"
                            options={services.map(service => ({ value: service.id, label: service.name }))}
                            error={errors.serviceId}
                            value={formValues.serviceId}
                            onChange={(value: string | number) =>
                                setFormValues(prev => ({ ...prev, serviceId: Number(value), quantity: value ? 1 : 0 }))
                            }
                            onFocus={() => setErrors(prev => ({ ...prev, serviceId: '' }))}
                            labelClassName="bg-white"
                        />
                    </div>

                    <div className="mb-10">
                        <TextInput
                            fieldName="unitPrice"
                            placeholder="Đơn giá của mỗi dịch vụ"
                            error={''}
                            value={services.find(sv => sv.id === formValues.serviceId)?.price?.toString() || '0'}
                            onChange={() => {}}
                            onFocus={() => {}}
                            type="number"
                            disabled={true}
                            labelClassName="bg-white"
                        />
                    </div>

                    <div className="mb-5">
                        <TextInput
                            fieldName="quantity"
                            placeholder="Số lượng"
                            error={errors.quantity}
                            value={formValues.quantity?.toString()}
                            onChange={(value: string) =>
                                setFormValues(prev => ({ ...prev, quantity: Number.parseInt(value) >= 0 ? Number.parseInt(value) : 0 }))
                            }
                            onFocus={() => setErrors(prev => ({ ...prev, quantity: '' }))}
                            type="number"
                            disabled={!formValues.serviceId}
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

export default BookServiceDialog
