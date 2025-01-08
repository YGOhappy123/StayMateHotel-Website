import { useEffect, useState } from 'react'
import { UseMutationResult } from 'react-query'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { getMappedPaymentMethod } from '@/utils/bookingStatusMapping'
import { PaymentPayload } from '@/services/bookingService'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'
import SelectInput from '@/components/common/SelectInput'

type PaymentDialogProps = {
    mode: 'deposit' | 'payment'
    bookingId: number
    maxValue?: number
    isOpen: boolean
    title: string
    body?: string
    closeDialog: () => void
    submitPaymentMutation: UseMutationResult<any, Error, PaymentPayload, unknown>
}

const PaymentDialog = ({ mode, bookingId, maxValue = 0, isOpen, title, body, closeDialog, submitPaymentMutation }: PaymentDialogProps) => {
    const SUPPORTED_PAYMENT_METHODS = ['Cash', 'CreditCard', 'Transfer']

    const [formValues, setFormValues] = useState<{
        paymentMethod: PaymentMethod
        paymentAmount: number
    }>({
        paymentMethod: 'Cash',
        paymentAmount: 0
    })

    const [errors, setErrors] = useState({
        paymentMethod: '',
        paymentAmount: ''
    })

    const handleSubmit = async () => {
        const formErrors = validateFormValues()

        if (!formErrors.paymentAmount) {
            await submitPaymentMutation
                .mutateAsync(
                    mode === 'deposit'
                        ? {
                              bookingId: bookingId,
                              method: formValues.paymentMethod
                          }
                        : {
                              bookingId: bookingId,
                              amount: formValues.paymentAmount,
                              method: formValues.paymentMethod
                          }
                )
                .then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { paymentAmount } = formValues
        const formErrors = { ...errors }

        if (mode === 'payment') {
            if (paymentAmount <= 0) formErrors.paymentAmount = formErrors.paymentAmount || 'Giá trị thanh toán không được bằng 0.'
            if (paymentAmount > maxValue)
                formErrors.paymentAmount =
                    formErrors.paymentAmount ||
                    `Giá trị thanh toán vượt số tiền còn lại (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        maxValue
                    )}).`
            if (paymentAmount % 1000 !== 0) formErrors.paymentAmount = formErrors.paymentAmount || 'Giá trị thanh toán phải chia hết cho 1000.'
        }

        return formErrors
    }

    useEffect(() => {
        if (isOpen) {
            setFormValues({
                paymentMethod: 'Cash',
                paymentAmount: 0
            })
            setErrors({
                paymentMethod: '',
                paymentAmount: ''
            })
        }
    }, [isOpen])

    return (
        <DialogContent className="max-w-[500px] bg-white">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="border-b-2"></div>
            {body && <p className="mb-3">{body}</p>}
            <div className="grid grid-cols-1 gap-4">
                <form onSubmit={handleSubmit}>
                    {mode === 'payment' && (
                        <div className="mb-10 mt-3">
                            <TextInput
                                fieldName="paymentAmount"
                                placeholder="Giá trị thanh toán"
                                error={errors.paymentAmount}
                                value={formValues.paymentAmount?.toString()}
                                onChange={(value: string) =>
                                    setFormValues(prev => ({ ...prev, paymentAmount: Number.parseInt(value) >= 0 ? Number.parseInt(value) : 0 }))
                                }
                                onFocus={() => setErrors(prev => ({ ...prev, paymentAmount: '' }))}
                                type="number"
                                labelClassName="bg-white"
                            />
                        </div>
                    )}

                    <div className="mb-5">
                        <SelectInput
                            fieldName="paymentMethod"
                            placeholder="Phương thức thanh toán"
                            options={SUPPORTED_PAYMENT_METHODS.map(method => ({ value: method, label: getMappedPaymentMethod(method) }))}
                            error={errors.paymentMethod}
                            value={formValues.paymentMethod}
                            onChange={(value: string | number) => setFormValues(prev => ({ ...prev, paymentMethod: value as PaymentMethod }))}
                            onFocus={() => setErrors(prev => ({ ...prev, paymentMethod: '' }))}
                            labelClassName="bg-white"
                            havingDefaultOptions={false}
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

export default PaymentDialog
