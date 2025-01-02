import { useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'

import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'

type CreateAdminDialogProps = {
    isOpen: boolean
    closeDialog: () => void
    createNewAdminMutation: any
}

const CreateAdminDialog = ({ isOpen, closeDialog, createNewAdminMutation }: CreateAdminDialogProps) => {
    const [formValues, setFormValues] = useState({
        lastName: '',
        firstName: '',
        phoneNumber: '',
        email: ''
    })

    const [errors, setErrors] = useState({
        lastName: '',
        firstName: '',
        phoneNumber: '',
        email: ''
    })

    const handleSubmit = async () => {
        const formErrors = validateFormValues()

        if (!formErrors.lastName && !formErrors.firstName && !formErrors.phoneNumber && !formErrors.email) {
            await createNewAdminMutation.mutateAsync({ ...formValues }).then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { lastName, firstName, email, phoneNumber } = formValues
        const formErrors = { ...errors }

        if (!lastName.trim()) formErrors.lastName = formErrors.lastName || 'Họ không được để trống.'
        if (!firstName.trim()) formErrors.firstName = formErrors.firstName || 'Tên không được để trống.'
        if (!email.trim()) formErrors.email = formErrors.email || 'Email không được để trống.'
        else if (
            !email
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
        )
            formErrors.email = formErrors.email || 'Email không hợp lệ.'
        if (!phoneNumber.trim()) formErrors.phoneNumber = formErrors.phoneNumber || 'Số điện thoại không được để trống.'
        else if (!phoneNumber.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/))
            formErrors.phoneNumber = formErrors.phoneNumber || 'Số điện thoại không hợp lệ.'

        return formErrors
    }

    useEffect(() => {
        if (isOpen) {
            setFormValues({
                lastName: '',
                firstName: '',
                phoneNumber: '',
                email: ''
            })
            setErrors({
                lastName: '',
                firstName: '',
                phoneNumber: '',
                email: ''
            })
        }
    }, [isOpen])

    return (
        <DialogContent className="max-w-[500px] bg-white">
            <DialogHeader>
                <DialogTitle>Tạo nhân viên mới</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="border-b-2"></div>
            <div className="grid grid-cols-1 gap-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-10">
                        <TextInput
                            fieldName="lastName"
                            placeholder="Họ"
                            error={errors.lastName}
                            value={formValues.lastName}
                            onChange={(value: string) => setFormValues(prev => ({ ...prev, lastName: value }))}
                            onFocus={() => setErrors(prev => ({ ...prev, lastName: '' }))}
                            labelClassName="bg-white"
                        />
                    </div>
                    <div className="mb-10">
                        <TextInput
                            fieldName="firstName"
                            placeholder="Tên"
                            error={errors.firstName}
                            value={formValues.firstName}
                            onChange={(value: string) => setFormValues(prev => ({ ...prev, firstName: value }))}
                            onFocus={() => setErrors(prev => ({ ...prev, firstName: '' }))}
                            labelClassName="bg-white"
                        />
                    </div>
                    <div className="mb-10">
                        <TextInput
                            fieldName="phoneNumber"
                            placeholder="Số điện thoại"
                            error={errors.phoneNumber}
                            value={formValues.phoneNumber}
                            onChange={(value: string) => setFormValues(prev => ({ ...prev, phoneNumber: value }))}
                            onFocus={() => setErrors(prev => ({ ...prev, phoneNumber: '' }))}
                            labelClassName="bg-white"
                        />
                    </div>
                    <div className="mb-5">
                        <TextInput
                            fieldName="email"
                            placeholder="Email"
                            error={errors.email}
                            value={formValues.email}
                            onChange={(value: string) => setFormValues(prev => ({ ...prev, email: value }))}
                            onFocus={() => setErrors(prev => ({ ...prev, email: '' }))}
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

export default CreateAdminDialog
