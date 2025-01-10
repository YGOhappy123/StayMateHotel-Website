import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import dayjs from 'dayjs'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

export type WishedRoom = {
    numberOfGuests: number
}

export type PaymentPayload = {
    bookingId: number
    amount?: number
    method: PaymentMethod
}

export type BookingSortAndFilterParams = {
    searchBookingId: string
    searchGuestName: string
    searchEmail: string
    searchPhoneNumber: string
    searchRoomNumber: string
    searchStatus: string
    searchMinTotalAmount: string
    searchMaxTotalAmount: string
    sort: string
    rangeBookingTime: string[] | any[] | undefined
    rangeCheckInTime: string[] | any[] | undefined
    rangeCheckOutTime: string[] | any[] | undefined
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
    const [limit] = useState<number>(6)
    const [bookingQuery, setBookingQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')

    const buildBookingQuery = ({
        searchBookingId,
        searchGuestName,
        searchEmail,
        searchPhoneNumber,
        searchRoomNumber,
        searchStatus,
        searchMinTotalAmount,
        searchMaxTotalAmount,
        sort,
        rangeBookingTime,
        rangeCheckInTime,
        rangeCheckOutTime
    }: BookingSortAndFilterParams) => {
        const query: any = {}
        if (searchBookingId) query.id = searchBookingId
        if (searchGuestName) query.guestName = searchGuestName.trim()
        if (searchEmail) query.email = searchEmail.trim()
        if (searchPhoneNumber) query.phoneNumber = searchPhoneNumber.trim()
        if (searchRoomNumber) query.roomNumber = searchRoomNumber.trim()
        if (searchStatus) query.status = searchStatus
        if (searchMinTotalAmount) query.minTotalAmount = searchMinTotalAmount
        if (searchMaxTotalAmount) query.maxTotalAmount = searchMaxTotalAmount
        if (rangeBookingTime) {
            if (rangeBookingTime[0]) {
                query.startBookingTime = dayjs(rangeBookingTime[0]).format('YYYY-MM-DD')
            }
            if (rangeBookingTime[1]) {
                query.endBookingTime = dayjs(rangeBookingTime[1]).format('YYYY-MM-DD')
            }
        }
        if (rangeCheckInTime) {
            if (rangeCheckInTime[0]) {
                query.startCheckInTime = dayjs(rangeCheckInTime[0]).format('YYYY-MM-DD')
            }
            if (rangeCheckInTime[1]) {
                query.endCheckInTime = dayjs(rangeCheckInTime[1]).format('YYYY-MM-DD')
            }
        }
        if (rangeCheckOutTime) {
            if (rangeCheckOutTime[0]) {
                query.startCheckOutTime = dayjs(rangeCheckOutTime[0]).format('YYYY-MM-DD')
            }
            if (rangeCheckOutTime[1]) {
                query.endCheckOutTime = dayjs(rangeCheckOutTime[1]).format('YYYY-MM-DD')
            }
        }
        setBookingQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

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

    useQuery(['count-bookings-by-status'], {
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

    const acceptBookingMutation = useMutation({
        mutationFn: (bookingId: number) => {
            return axios.post<IResponseData<any>>(`/bookings/accept-booking/${bookingId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-bookings')
                searchBookingsQuery.refetch()
            } else {
                queryClient.invalidateQueries('bookings')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const checkInBookingMutation = useMutation({
        mutationFn: (bookingId: number) => {
            return axios.post<IResponseData<any>>(`/bookings/check-in/${bookingId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-bookings')
                searchBookingsQuery.refetch()
            } else {
                queryClient.invalidateQueries('bookings')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const checkOutBookingMutation = useMutation({
        mutationFn: (bookingId: number) => {
            return axios.post<IResponseData<any>>(`/bookings/check-out/${bookingId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-bookings')
                searchBookingsQuery.refetch()
            } else {
                queryClient.invalidateQueries('bookings')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const depositMutation = useMutation({
        mutationFn: (data: PaymentPayload) => {
            return axios.post<IResponseData<any>>(`/bookings/deposit/${data.bookingId}`, {
                method: data.method
            })
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-bookings')
                searchBookingsQuery.refetch()
            } else {
                queryClient.invalidateQueries('bookings')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const makePaymentMutation = useMutation({
        mutationFn: (data: PaymentPayload) => {
            return axios.post<IResponseData<any>>(`/bookings/make-payment/${data.bookingId}`, {
                amount: data.amount,
                method: data.method
            })
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-bookings')
                searchBookingsQuery.refetch()
            } else {
                queryClient.invalidateQueries('bookings')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const cancelBookingMutation = useMutation({
        mutationFn: (bookingId: number) => {
            return axios.post<IResponseData<any>>(`/bookings/cancel-booking/${bookingId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-bookings')
                searchBookingsQuery.refetch()
            } else {
                queryClient.invalidateQueries('bookings')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
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
        buildBookingQuery,

        getCsvBookingsQuery,
        placeBookingMutation,
        acceptBookingMutation,
        cancelBookingMutation,
        checkInBookingMutation,
        checkOutBookingMutation,
        depositMutation,
        makePaymentMutation
    }
}

export default bookingService
