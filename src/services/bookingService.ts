import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import dayjs from 'dayjs'

export type WishedRoom = {
    numberOfGuests: number
}

const bookingService = () => {
    const axios = useAxiosIns()
    const [query, setQuery] = useState<string>('{}')

    const buildQuery = ({ range, roomsAndGuests }: { range: string[] | any[] | undefined; roomsAndGuests: WishedRoom[] }) => {
        const query: any = {}
        if (range && range[0]) query.checkInDate = dayjs(range[0]).format('YYYY-MM-DD')
        if (range && range[1]) query.checkOutDate = dayjs(range[1]).format('YYYY-MM-DD')
        query.guests = roomsAndGuests.map(rm => rm.numberOfGuests)

        setQuery(JSON.stringify(query))
    }

    const getAvailableRoomsQuery = useQuery(['available-rooms', query], {
        queryFn: () => axios.get<IResponseData<IRoom[][]>>(`/bookings/available-rooms?filter=${query}`),
        keepPreviousData: false,
        enabled: false,
        onError: onError
    })

    const placeBookingMutation = useMutation({
        mutationFn: (data: Partial<IBooking>) => {
            return axios.post<IResponseData<number>>('/bookings/make-booking', data)
        },
        onError: onError
    })

    return {
        query,
        buildQuery,
        getAvailableRoomsQuery,
        placeBookingMutation
    }
}

export default bookingService
