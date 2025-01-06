import { FormEvent, useEffect, useState } from 'react'
import authService from '@/services/authService'
import useTitle from '@/hooks/useTitle'
import Button from '@/components/common/Button'
import PasswordInput from '@/components/common/PasswordInput'

const ChangePasswordPage = () => {
    useTitle('Stay Mate Hotel | Đổi Mật Khẩu')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { updatePasswordMutation } = authService()

    const [formValues, setFormValues] = useState({
        oldPassword: '',
        newPassword: '',
        cfPassword: ''
    })

    const [errors, setErrors] = useState({
        oldPassword: '',
        newPassword: '',
        cfPassword: ''
    })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formErrors = validateFormValues()

        if (!formErrors.oldPassword && !formErrors.newPassword && !formErrors.cfPassword) {
            updatePasswordMutation
                .mutateAsync({
                    oldPassword: formValues.oldPassword,
                    newPassword: formValues.newPassword,
                    confirmPassword: formValues.cfPassword
                })
                .finally(() => setDefaultFormValues())
        } else {
            setErrors(formErrors)
        }
    }

    const setDefaultFormValues = () => {
        setFormValues({
            oldPassword: '',
            newPassword: '',
            cfPassword: ''
        })
    }

    const validateFormValues = () => {
        const { oldPassword, newPassword, cfPassword } = formValues
        const formErrors = { ...errors }

        if (!oldPassword.trim()) formErrors.oldPassword = formErrors.oldPassword || 'Mật khẩu không được để trống.'
        if (!newPassword.trim()) formErrors.newPassword = formErrors.newPassword || 'Mật khẩu không được để trống.'
        if (newPassword.length < 8 || newPassword.length > 20)
            formErrors.newPassword = formErrors.newPassword || 'Mật khẩu phải dài từ 8 đến 20 ký tự.'
        if (cfPassword !== newPassword) formErrors.cfPassword = formErrors.cfPassword || 'Mật khẩu không trùng khớp.'

        return formErrors
    }

    return (
        <div className="w-full lg:w-auto lg:flex-1">
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                <h3 className="font-oswald -mb-4 text-4xl uppercase leading-[50px] text-primary">Thay đổi mật khẩu</h3>
                <PasswordInput
                    fieldName="oldPassword"
                    placeholder="Mật khẩu cũ"
                    error={errors.oldPassword}
                    value={formValues.oldPassword}
                    onChange={(value: string) => setFormValues(prev => ({ ...prev, oldPassword: value }))}
                    onFocus={() => setErrors(prev => ({ ...prev, oldPassword: '' }))}
                />
                <PasswordInput
                    fieldName="newPassword"
                    placeholder="Mật khẩu mới"
                    error={errors.newPassword}
                    value={formValues.newPassword}
                    onChange={(value: string) => setFormValues(prev => ({ ...prev, newPassword: value }))}
                    onFocus={() => setErrors(prev => ({ ...prev, newPassword: '' }))}
                />
                <PasswordInput
                    fieldName="cfPassword"
                    placeholder="Xác nhận mật khẩu"
                    error={errors.cfPassword}
                    value={formValues.cfPassword}
                    onChange={(value: string) => setFormValues(prev => ({ ...prev, cfPassword: value }))}
                    onFocus={() => setErrors(prev => ({ ...prev, cfPassword: '' }))}
                />
                <Button text="Đổi mật khẩu" type="submit" variant="gradient" className="w-full rounded-full text-lg font-semibold capitalize" />
            </form>
        </div>
    )
}

export default ChangePasswordPage
