import { FormEvent, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormType } from '@/pages/AuthPage'
import { toast } from 'react-toastify'
import toastConfig from '@/configs/toast'
import PasswordInput from '@/components/common/PasswordInput'
import authService from '@/services/authService'
import Button from '@/components/common/Button'

type ResetPasswordFormProps = {
    changeFormType: (type: FormType) => void
}

const ResetPasswordForm = ({ changeFormType }: ResetPasswordFormProps) => {
    const [formValues, setFormValues] = useState({
        password: '',
        cfPassword: ''
    })

    const [errors, setErrors] = useState({
        password: '',
        cfPassword: ''
    })

    const [query, setQuery] = useSearchParams()
    // const { signUpMutation } = authService()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const token = query.get('token') as string
        if (!token) {
            toast('Bạn chỉ có thể dùng tính năng này thông qua link được đính kèm trong email', toastConfig('info'))
            return
        }

        const formErrors = validateFormValues()

        if (!formErrors.password && !formErrors.cfPassword) {
            // await signUpMutation.mutateAsync({
            //     firstName: formValues.firstName,
            //     lastName: formValues.lastName,
            //     username: formValues.username,
            //     password: formValues.password,
            //     confirmPassword: formValues.cfPassword
            // })
            // query.delete('token')
            // query.set('type', 'signIn')
            // setQuery(query)
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { password, cfPassword } = formValues
        const formErrors = { ...errors }

        if (!password.trim()) formErrors.password = formErrors.password || 'Mật khẩu không được để trống.'
        if (password.length < 8 || password.length > 20) formErrors.password = formErrors.password || 'Mật khẩu phải dài từ 8 đến 20 ký tự.'
        if (cfPassword !== password) formErrors.cfPassword = formErrors.cfPassword || 'Mật khẩu không trùng khớp.'

        return formErrors
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col px-5 py-7">
            <h2 className="mb-10 text-center text-4xl font-medium">Đặt Lại Mật Khẩu</h2>

            <div className="mb-10">
                <PasswordInput
                    fieldName="password"
                    placeholder="Mật khẩu"
                    autoComplete="new-password"
                    error={errors.password}
                    value={formValues.password}
                    onChange={(value: string) => setFormValues(prev => ({ ...prev, password: value }))}
                    onFocus={() => setErrors(prev => ({ ...prev, password: '' }))}
                />
            </div>

            <div className="mb-10">
                <PasswordInput
                    fieldName="cfPassword"
                    placeholder="Xác nhận mật khẩu"
                    error={errors.cfPassword}
                    value={formValues.cfPassword}
                    onChange={(value: string) => setFormValues(prev => ({ ...prev, cfPassword: value }))}
                    onFocus={() => setErrors(prev => ({ ...prev, cfPassword: '' }))}
                />
            </div>

            <div className="flex flex-col items-center">
                <Button text="Xác Nhận" type="submit" variant="gradient" className="w-full rounded font-semibold capitalize" />

                <div className="mt-6">
                    <span className="font-medium">Đã có tài khoản? </span>
                    <span className="cursor-pointer font-bold text-primary hover:underline" onClick={() => changeFormType('signIn')}>
                        Đăng nhập
                    </span>
                </div>
            </div>
        </form>
    )
}

export default ResetPasswordForm
