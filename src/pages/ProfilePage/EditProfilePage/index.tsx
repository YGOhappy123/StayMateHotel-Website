import { FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { setUser } from '@/slices/authSlice'
import adminService from '@/services/adminService'
import customerService from '@/services/customerService'
import useTitle from '@/hooks/useTitle'
import TextInput from '@/components/common/TextInput'
import Button from '@/components/common/Button'

const EditProfilePage = () => {
    useTitle('Stay Mate Hotel | Hồ Sơ')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user)
    const { updateProfileMutation } = customerService({ enableFetching: false })
    const { updateAdminMutation } = adminService({ enableFetching: false })

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: ''
    })

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: ''
    })

    useEffect(() => {
        setDefaultFormValues()
    }, [user])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formErrors = validateFormValues()

        if (!formErrors.firstName && !formErrors.lastName && !formErrors.email && !formErrors.phoneNumber && !formErrors.address) {
            if (user.role === 'Guest') {
                updateProfileMutation
                    .mutateAsync({
                        data: {
                            ...formValues,
                            email: formValues.email || undefined,
                            phoneNumber: formValues.phoneNumber || undefined,
                            address: formValues.address || undefined
                        }
                    })
                    .then(() => updateAuthUser())
                    .catch(() => setDefaultFormValues())
            } else {
                const { email, ...information } = formValues
                updateAdminMutation
                    .mutateAsync({ data: information })
                    .then(() => updateAuthUser())
                    .catch(() => setDefaultFormValues())
            }
        } else {
            setErrors(formErrors)
        }
    }

    const updateAuthUser = () => {
        const newUserData = { ...user }
        newUserData.firstName = formValues.firstName
        newUserData.lastName = formValues.lastName
        if (formValues.email) newUserData.email = formValues.email
        if (formValues.phoneNumber) newUserData.phoneNumber = formValues.phoneNumber
        if (formValues.address) newUserData.address = formValues.address

        dispatch(setUser(newUserData as IUser))
    }

    const validateFormValues = () => {
        const { firstName, lastName, email, phoneNumber } = formValues
        const formErrors = { ...errors }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

        if (!lastName.trim()) formErrors.lastName = formErrors.lastName || 'Họ không được để trống.'
        if (!firstName.trim()) formErrors.firstName = formErrors.firstName || 'Tên không được để trống.'
        if (email.trim() && !emailRegex.test(email)) formErrors.email = formErrors.email || 'Địa chỉ email của bạn không hợp lệ.'
        if (phoneNumber.trim() && !phoneRegex.test(phoneNumber))
            formErrors.phoneNumber = formErrors.phoneNumber || 'Số điện thoại của bạn không hợp lệ.'

        return formErrors
    }

    const setDefaultFormValues = () => {
        setFormValues({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user?.email ?? '',
            phoneNumber: user?.phoneNumber ?? '',
            address: user?.address ?? ''
        })
    }

    return (
        <div className="w-full lg:w-auto lg:flex-1">
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                <h3 className="font-oswald -mb-4 text-4xl uppercase leading-[50px] text-primary">Chi tiết tài khoản</h3>
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
                <TextInput
                    fieldName="email"
                    placeholder="Địa chỉ email"
                    disabled={user.role === 'Admin'}
                    error={errors.email}
                    value={formValues.email}
                    onChange={(value: string) => setFormValues(prev => ({ ...prev, email: value }))}
                    onFocus={() => setErrors(prev => ({ ...prev, email: '' }))}
                />
                <TextInput
                    fieldName="phoneNumber"
                    placeholder="Số điện thoại"
                    error={errors.phoneNumber}
                    value={formValues.phoneNumber}
                    onChange={(value: string) => setFormValues(prev => ({ ...prev, phoneNumber: value }))}
                    onFocus={() => setErrors(prev => ({ ...prev, phoneNumber: '' }))}
                />
                {user.role === 'Guest' && (
                    <TextInput
                        fieldName="address"
                        placeholder="Địa chỉ"
                        error={errors.address}
                        value={formValues.address}
                        onChange={(value: string) => setFormValues(prev => ({ ...prev, address: value }))}
                        onFocus={() => setErrors(prev => ({ ...prev, address: '' }))}
                    />
                )}
                <Button text="Cập nhật thông tin" type="submit" variant="gradient" className="w-full rounded-full text-lg font-semibold capitalize" />
            </form>
        </div>
    )
}

export default EditProfilePage
