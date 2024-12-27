import { FormEvent, useState } from 'react'
import { FormType } from '@/pages/AuthPage'
import authService from '@/services/authService'
import TextInput from '@/components/common/TextInput'
import Button from '@/components/common/Button'

type ForgotPasswordFormProps = {
    changeFormType: (type: FormType) => void
}

const ForgotPasswordForm = ({ changeFormType }: ForgotPasswordFormProps) => {
    const [formValues, setFormValues] = useState({
        email: ''
    })

    const [errors, setErrors] = useState({
        email: ''
    })

    // const { signInMutation } = authService()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formErrors = validateFormValues()

        if (!formErrors.email) {
            // await signInMutation.mutateAsync({
            //     email: formValues.email,
            //     password: formValues.password
            // })
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { email } = formValues
        const formErrors = { ...errors }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if (!email.trim()) formErrors.email = formErrors.email || 'Địa chỉ email không được để trống.'
        if (!emailRegex.test(email)) formErrors.email = formErrors.email || 'Địa chỉ email không hợp lệ.'

        return formErrors
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col px-5 py-7">
            <h2 className="mb-10 text-center text-4xl font-medium">Quên Mật Khẩu</h2>

            <div className="mb-10">
                <TextInput
                    fieldName="email"
                    placeholder="Địa chỉ email"
                    error={errors.email}
                    value={formValues.email}
                    onChange={(value: string) => setFormValues(prev => ({ ...prev, email: value }))}
                    onFocus={() => setErrors(prev => ({ ...prev, email: '' }))}
                />
            </div>

            <div className="flex flex-col items-center">
                <Button text="Đặt Lại Mật Khẩu" type="submit" variant="gradient" className="w-full rounded font-semibold capitalize" />

                <div className="mt-6">
                    <span className="font-medium">Đã có tài khoản? </span>
                    <span className="cursor-pointer font-bold text-primary hover:underline" onClick={() => changeFormType('signIn')}>
                        Đăng nhập
                    </span>
                </div>

                <div className="mt-2">
                    <span className="font-medium">Chưa có tài khoản? </span>
                    <span className="cursor-pointer font-bold text-primary hover:underline" onClick={() => changeFormType('signUp')}>
                        Đăng ký
                    </span>
                </div>
            </div>
        </form>
    )
}

export default ForgotPasswordForm
