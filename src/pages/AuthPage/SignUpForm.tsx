import { FormEvent, useState } from 'react'
import { FormType } from '@/pages/AuthPage'
import TextInput from '@/components/common/TextInput'
import PasswordInput from '@/components/common/PasswordInput'
import authService from '@/services/authService'
import Button from '@/components/common/Button'
import GoogleAuthButton from '@/pages/AuthPage/GoogleAuthButton'

type SignUpFormProps = {
    changeFormType: (type: FormType) => void
}

const SignUpForm = ({ changeFormType }: SignUpFormProps) => {
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        cfPassword: ''
    })

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        cfPassword: ''
    })

    const { signUpMutation } = authService()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formErrors = validateFormValues()

        if (!formErrors.firstName && !formErrors.lastName && !formErrors.username && !formErrors.password && !formErrors.cfPassword) {
            await signUpMutation.mutateAsync({
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                username: formValues.username,
                password: formValues.password,
                confirmPassword: formValues.cfPassword
            })
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { firstName, lastName, username, password, cfPassword } = formValues
        const formErrors = { ...errors }

        if (!lastName.trim()) formErrors.lastName = formErrors.lastName || 'Họ không được để trống.'
        if (!firstName.trim()) formErrors.firstName = formErrors.firstName || 'Tên không được để trống.'
        if (!username.trim()) formErrors.username = formErrors.username || 'Tên đăng nhập không được để trống.'
        if (username.length < 8 || username.length > 20) formErrors.username = formErrors.username || 'Tên đăng nhập phải dài từ 8 đến 20 ký tự.'
        if (!password.trim()) formErrors.password = formErrors.password || 'Mật khẩu không được để trống.'
        if (password.length < 8 || password.length > 20) formErrors.password = formErrors.password || 'Mật khẩu phải dài từ 8 đến 20 ký tự.'
        if (cfPassword !== password) formErrors.cfPassword = formErrors.cfPassword || 'Mật khẩu không trùng khớp.'

        return formErrors
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col px-5 py-7">
            <h2 className="mb-10 text-center text-4xl font-medium">Đăng Ký Tài Khoản</h2>

            <div className="mb-10 grid grid-cols-2 gap-3">
                <TextInput
                    fieldName="lastName"
                    placeholder="Họ"
                    error={errors.lastName}
                    value={formValues.lastName}
                    onChange={(value: string) => setFormValues(prev => ({ ...prev, lastName: value }))}
                    onFocus={() => setErrors(prev => ({ ...prev, lastName: '' }))}
                />
                <TextInput
                    fieldName="firstName"
                    placeholder="Tên"
                    error={errors.firstName}
                    value={formValues.firstName}
                    onChange={(value: string) => setFormValues(prev => ({ ...prev, firstName: value }))}
                    onFocus={() => setErrors(prev => ({ ...prev, firstName: '' }))}
                />
            </div>

            <div className="mb-10">
                <TextInput
                    fieldName="username"
                    placeholder="Tên đăng nhập"
                    autoComplete="username"
                    error={errors.username}
                    value={formValues.username}
                    onChange={(value: string) => setFormValues(prev => ({ ...prev, username: value }))}
                    onFocus={() => setErrors(prev => ({ ...prev, username: '' }))}
                />
            </div>

            <div className="mb-10 grid grid-cols-2 gap-3">
                <PasswordInput
                    fieldName="password"
                    placeholder="Mật khẩu"
                    autoComplete="new-password"
                    error={errors.password}
                    value={formValues.password}
                    onChange={(value: string) => setFormValues(prev => ({ ...prev, password: value }))}
                    onFocus={() => setErrors(prev => ({ ...prev, password: '' }))}
                />
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
                <Button text="Đăng Ký" type="submit" variant="gradient" className="w-full rounded font-semibold capitalize" />

                <div className="mt-10 w-full">
                    <div className="relative border-t border-[#101319]">
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-ivory px-4 font-medium text-[#101319]">
                            Hoặc đăng ký bằng
                        </span>
                    </div>
                    <GoogleAuthButton text="Đăng ký bằng tài khoản Google" />
                </div>

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

export default SignUpForm
