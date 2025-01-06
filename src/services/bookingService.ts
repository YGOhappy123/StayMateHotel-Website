import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import dayjs from 'dayjs'

export type WishedRoom = {
    numberOfGuests: number
}

const bookingService = ({ enableFetching }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const [roomQuery, setRoomQuery] = useState<string>('')

    const buildRoomsQuery = ({ range, roomsAndGuests }: { range: string[] | any[] | undefined; roomsAndGuests: WishedRoom[] }) => {
        const query: any = {}
        if (range && range[0]) query.checkInDate = dayjs(range[0]).format('YYYY-MM-DD')
        if (range && range[1]) query.checkOutDate = dayjs(range[1]).format('YYYY-MM-DD')
        query.guests = roomsAndGuests.map(rm => rm.numberOfGuests)

        setRoomQuery(JSON.stringify(query))
    }

    const getAvailableRoomsQuery = useQuery(['available-rooms', roomQuery], {
        queryFn: () => axios.get<IResponseData<IRoom[][]>>(`/bookings/available-rooms?filter=${roomQuery}`),
        keepPreviousData: false,
        enabled: false,
        onError: onError
    })

    const queryClient = useQueryClient()
    const [bookings, setBookings] = useState<IBooking[]>([])
    const [bookingsCount, setBookingsCount] = useState<Record<BookingStatus, number>>()
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(6)
    const [bookingQuery, setBookingQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')

    const searchBookingsQuery = useQuery(['search-bookings', bookingQuery, sort], {
        queryFn: () => {
            return axios.get<IResponseData<IBooking[]>>(`/bookings?skip=${limit * (page - 1)}&limit=${limit}&filter=${bookingQuery}&sort=${sort}`)
        },
        keepPreviousData: true,
        enabled: false,
        onError: onError,
        onSuccess: res => {
            if (!res) return
            setBookings(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const getAllBookingsQuery = useQuery(['bookings', page, limit], {
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IBooking[]>>(`/bookings?skip=${limit * (page - 1)}&limit=${limit}`)
            }
        },
        keepPreviousData: true,
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        onError: onError,
        onSuccess: res => {
            if (!res) return
            setBookings(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const getCsvBookingsQuery = useQuery(['search-csv-bookings', bookingQuery, sort], {
        queryFn: () => {
            return axios.get<IResponseData<IBooking[]>>(`/bookings?filter=${bookingQuery}&sort=${sort}`)
        },
        keepPreviousData: true,
        enabled: false,
        onError: onError
    })

    const countBookingsByStatusQuery = useQuery(['count-bookings-by-status'], {
        queryFn: () => {
            return axios.get<IResponseData<Record<BookingStatus, number>>>('/bookings/count-by-status')
        },
        keepPreviousData: true,
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        onError: onError,
        onSuccess: res => {
            if (!res) return
            setBookingsCount(res.data.data)
        }
    })

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchBookingsQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setBookingQuery('')
        setSort('')
        setTimeout(() => getAllBookingsQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchBookingsQuery.refetch()
        }
    }, [page])

    const placeBookingMutation = useMutation({
        mutationFn: (data: Partial<IBooking>) => {
            return axios.post<IResponseData<number>>('/bookings/make-booking', data)
        },
        onError: onError
    })

    return {
        buildRoomsQuery,
        getAvailableRoomsQuery,

        bookings,
        bookingsCount,
        total,
        page,
        limit,
        setPage,
        onFilterSearch,
        onResetFilterSearch,
        getCsvBookingsQuery,
        placeBookingMutation
    }
}

export default bookingService
