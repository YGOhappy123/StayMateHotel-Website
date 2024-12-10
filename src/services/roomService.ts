import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'
import { getMappedSort } from '@/utils/apiSortMapping'

export type RoomSortAndFilterParams = {
    searchRoomNumber: string
    searchPriceQuery: string
    searchFloor: number
    searchRoomClass: number
    sort: string
    range: string[] | any[] | undefined
}

const roomService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [rooms, setRooms] = useState<IRoom[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(8)
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')

    const buildQuery = ({ searchRoomNumber, searchPriceQuery, searchFloor, searchRoomClass, sort, range }: RoomSortAndFilterParams) => {
        const query: any = {}
        if (searchRoomNumber) query.roomNumber = searchRoomNumber.trim()
        if (searchFloor) query.floorId = searchFloor
        if (searchRoomClass) query.roomClassId = searchRoomClass
        if (searchPriceQuery) {
            const parsedPriceQuery = JSON.parse(searchPriceQuery)
            if (parsedPriceQuery['$gte']) query.minPrice = parsedPriceQuery['$gte']
            if (parsedPriceQuery['$lte']) query.maxPrice = parsedPriceQuery['$lte']
        }
        if (range) {
            query.startTime = dayjs(range[0]).format('YYYY-MM-DD')
            query.endTime = dayjs(range[1]).format('YYYY-MM-DD')
        }
        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const searchRoomsQuery = useQuery(['search-rooms', query, sort], {
        queryFn: () => {
            return axios.get<IResponseData<IRoom[]>>(`/rooms?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`)
        },
        keepPreviousData: true,
        enabled: false,
        onError: onError,
        onSuccess: res => {
            if (!res) return
            setRooms(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const getAllRoomsQuery = useQuery(['rooms', page, limit], {
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IRoom[]>>(`/rooms?skip=${limit * (page - 1)}&limit=${limit}`)
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
            setRooms(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const onFilterSearch = () => {
        searchRoomsQuery.refetch()
        setIsSearching(true)
    }

    const onResetFilterSearch = () => {
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllRoomsQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchRoomsQuery.refetch()
        }
    }, [page])

    const createNewRoomMutation = useMutation({
        mutationFn: (data: Partial<IRoom>) => {
            return axios.post<IResponseData<IRoom>>('/rooms', data)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-rooms')
                searchRoomsQuery.refetch()
            } else {
                queryClient.invalidateQueries('rooms')
            }
            toast(res.data.message, toastConfig('success'))
        }
    })

    const updateRoomMutation = useMutation({
        mutationFn: (payload: { roomId: number; data: Partial<IRoom> }) => {
            return axios.patch<IResponseData<IRoom>>(`/rooms/${payload.roomId}`, payload.data)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-rooms')
                searchRoomsQuery.refetch()
            } else {
                queryClient.invalidateQueries('rooms')
            }
            toast(res.data.message, toastConfig('success'))
        }
    })

    const deleteRoomMutation = useMutation({
        mutationFn: (roomId: number) => {
            return axios.delete<IResponseData<any>>(`/rooms/${roomId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-rooms')
                searchRoomsQuery.refetch()
            } else {
                queryClient.invalidateQueries('rooms')
            }
            toast(res.data.message, toastConfig('success'))
        }
    })

    const toggleMaintenanceMutation = useMutation({
        mutationFn: (roomId: number) => {
            return axios.post<IResponseData<any>>(`/rooms/toggle-maintenance/${roomId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-rooms')
                searchRoomsQuery.refetch()
            } else {
                queryClient.invalidateQueries('rooms')
            }
            toast(res.data.message, toastConfig('success'))
        }
    })

    const markCleaningDoneMutation = useMutation({
        mutationFn: (roomId: number) => {
            return axios.post<IResponseData<any>>(`/rooms/cleaning-done/${roomId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-rooms')
                searchRoomsQuery.refetch()
            } else {
                queryClient.invalidateQueries('rooms')
            }
            toast(res.data.message, toastConfig('success'))
        }
    })

    return {
        rooms,
        total,
        page,
        limit,
        setPage,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,
        searchRoomsQuery,
        getAllRoomsQuery,
        createNewRoomMutation,
        updateRoomMutation,
        deleteRoomMutation,
        toggleMaintenanceMutation,
        markCleaningDoneMutation
    }
}

export default roomService
