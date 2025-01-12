import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import { onError } from '@/utils/errorsHandler'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'
import { getMappedSort } from '@/utils/apiSortMapping'

export type BookServicePayload = {
    bookingId: number
    serviceId: number
    quantity: number
}
export type BookingServiceSortAndFilterParams = {
    searchServiceName?: string;
    searchServiceQuery?: string;
    searchMinPrice: string;
    searchMaxPrice: string;
    sort?: string;
    range?: string[] | any[] | undefined
    status?: string;
    searchCustomerName?: string;
    searchBookingServiceId?: string;
    searchBookingId?: string;
};
const serviceReservationService = ({ enableFetching }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const queryClient = useQueryClient()
    const [bookingServices, setBookingServices] = useState<IBookingService[]>([])
    const [bookingServicesCount, setBookingServicesCount] = useState<Record<BookingServiceStatus, number>>()
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit] = useState<number>(6)
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')

    const buildQuery = ({
        searchServiceName,
        searchServiceQuery,
        searchMinPrice,
        searchMaxPrice,
        sort,
        range,
        status,
        searchCustomerName,
        searchBookingServiceId,
        searchBookingId,
    }: BookingServiceSortAndFilterParams) => {
        const query: any = {}

        if (searchServiceName) query.serviceName = searchServiceName.trim()
        if (searchCustomerName) query.customerName = searchCustomerName.trim()
        if (searchServiceQuery) query.serviceQuery = searchServiceQuery
        if (searchMinPrice) query.minPrice = searchMinPrice
        if (searchMaxPrice) query.maxPrice = searchMaxPrice
        if (status) query.status = status 
        if (searchBookingServiceId) query.bookingServiceId = searchBookingServiceId;
        if (searchBookingId) query.bookingId = searchBookingId;
        if (range) {
            if (range[0]) query.startTime = dayjs(range[0]).format('YYYY-MM-DD')
            if (range[1]) query.endTime = dayjs(range[1]).format('YYYY-MM-DD')
        }

        setQuery(JSON.stringify(query))

        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const searchBookingServicesQuery = useQuery(['search-booking-services', query, sort], {
        queryFn: () => {
            return axios.get<IResponseData<IBookingService[]>>(
                `/bookings/booking-services?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`
            )
        },
        keepPreviousData: true,
        enabled: false,
        onError: onError,
        onSuccess: res => {
            if (!res) return
            setBookingServices(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const getAllBookingServicesQuery = useQuery(['booking-services', page, limit], {
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IBookingService[]>>(`/bookings/booking-services?skip=${limit * (page - 1)}&limit=${limit}`)
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
            setBookingServices(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const getCsvBookingServicesQuery = useQuery(['search-csv-booking-services', query, sort], {
        queryFn: () => {
            return axios.get<IResponseData<IBookingService[]>>(`/bookings/booking-services?filter=${query}&sort=${sort}`)
        },
        keepPreviousData: true,
        enabled: false,
        onError: onError
    })

    useQuery(['count-booking-services-by-status'], {
        queryFn: () => {
            return axios.get<IResponseData<Record<BookingServiceStatus, number>>>('/bookings/booking-services/count-by-status')
        },
        keepPreviousData: true,
        enabled: enableFetching,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        onError: onError,
        onSuccess: res => {
            if (!res) return
            setBookingServicesCount(res.data.data)
        }
    })

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchBookingServicesQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllBookingServicesQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchBookingServicesQuery.refetch()
        }
    }, [page])

    const bookServiceMutation = useMutation({
        mutationFn: (data: BookServicePayload) => {
            return axios.post<IResponseData<any>>(`/bookings/${data.bookingId}/book-service`, {
                serviceId: data.serviceId,
                quantity: data.quantity
            })
        },
        onError: onError,
        onSuccess: res => {
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const acceptBookingMutation = useMutation({
        mutationFn: (bookingServiceId: number) => {
            return axios.post<IResponseData<any>>(`/bookings/accept-booking-services/${bookingServiceId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-booking-services')
                searchBookingServicesQuery.refetch()
            } else {
                queryClient.invalidateQueries('booking-services')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const rejectBookingMutation = useMutation({
        mutationFn: (bookingServiceId: number) => {
            return axios.post<IResponseData<any>>(`/bookings/reject-booking-services/${bookingServiceId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-booking-services')
                searchBookingServicesQuery.refetch()
            } else {
                queryClient.invalidateQueries('booking-services')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const handOverBookingMutation = useMutation({
        mutationFn: (bookingServiceId: number) => {
            return axios.post<IResponseData<any>>(`/bookings/hand-over-booking-services/${bookingServiceId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-booking-services')
                searchBookingServicesQuery.refetch()
            } else {
                queryClient.invalidateQueries('booking-services')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        bookingServices,
        bookingServicesCount,
        total,
        page,
        limit,

        setPage,
        buildQuery,
        onFilterSearch,
        onResetFilterSearch,

        bookServiceMutation,
        getCsvBookingServicesQuery,
        acceptBookingMutation,
        rejectBookingMutation,
        handOverBookingMutation
    }
}

export default serviceReservationService
