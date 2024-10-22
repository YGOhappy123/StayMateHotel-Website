import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import toastConfig from '@/configs/toast'

export const onError = (error: Error) => {
    toast(
        ((error as AxiosError<IResponseData<unknown>>).response?.data?.message as string) || error.message,
        toastConfig('error')
    )
}
