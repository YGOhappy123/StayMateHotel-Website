import { FormEvent, useState } from 'react'
import { FormType } from '@/pages/AuthPage'
import TextInput from '@/components/common/TextInput'
import PasswordInput from '@/components/common/PasswordInput'
import authService from '@/services/authService'

type SignInFormProps = {
    changeFormType: (type: FormType) => void
}

const SignInForm = ({ changeFormType }: SignInFormProps) => {
    const [formValues, setFormValues] = useState({
        username: '',
        password: ''
    })

    const [errors, setErrors] = useState({
        username: '',
        password: ''
    })

    const { signInMutation } = authService()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formErrors = validateFormValues()

        if (!formErrors.username && !formErrors.password) {
            await signInMutation.mutateAsync({
                username: formValues.username,
                password: formValues.password
            })
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { username, password } = formValues
        const formErrors = { ...errors }

        if (!username) formErrors.username = formErrors.username || 'Tên đăng nhập không được để trống.'
        if (username.length < 8 || username.length > 20) formErrors.username = formErrors.username || 'Tên đăng nhập phải dài từ 8 đến 20 ký tự.'
        if (!password) formErrors.password = formErrors.password || 'Mật khẩu không được để trống.'
        if (password.length < 8 || password.length > 20) formErrors.password = formErrors.password || 'Mật khẩu phải dài từ 8 đến 20 ký tự.'

        return formErrors
    }

    return (
        <form onSubmit={handleSubmit} className="flex h-full flex-col p-10">
            <h2 className="mb-14 text-center text-4xl font-medium">Đăng Nhập Tài Khoản</h2>
            <div>
                <TextInput
                    fieldName="username"
                    placeholder="Tên đăng nhập"
                    error={errors.username}
                    value={formValues.username}
                    onChange={(value: string) => setFormValues(prev => ({ ...prev, username: value }))}
                    onFocus={() => setErrors(prev => ({ ...prev, username: '' }))}
                />
            </div>
            <div>
                <PasswordInput
                    fieldName="password"
                    placeholder="Mật khẩu"
                    error={errors.password}
                    value={formValues.password}
                    onChange={(value: string) => setFormValues(prev => ({ ...prev, password: value }))}
                    onFocus={() => setErrors(prev => ({ ...prev, password: '' }))}
                />
            </div>
            <div className="flex flex-col items-center">
                <button
                    type="submit"
                    className="w-full rounded bg-gradient-to-r from-accent to-primary py-[14px] font-semibold capitalize text-white hover:opacity-90"
                >
                    Đăng Nhập
                </button>
                <div className="mt-6">
                    <span className="font-medium">Chưa có tài khoản? </span>
                    <span className="cursor-pointer font-bold text-primary hover:underline" onClick={() => changeFormType('signUp')}>
                        Đăng ký
                    </span>
                </div>
            </div>
        </form>
    )
}

export default SignInForm
