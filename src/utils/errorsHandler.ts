import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { getMappedMessage } from '@/utils/resMessageMapping'
import toastConfig from '@/configs/toast'

export const onError = (error: Error) => {
    const errorMessage = ((error as AxiosError<IResponseData<unknown>>).response?.data?.message as string) || error.message
    toast(getMappedMessage(errorMessage), toastConfig('error'))
}
