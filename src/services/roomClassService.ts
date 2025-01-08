import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

export type RoomClassSortAndFilterParams = {
    searchClassName: string
    searchFeatures: number[]
    searchMinPrice: string
    searchMaxPrice: string
    searchMinCapacity: string
    searchMaxCapacity: string
    sort: string
    range: string[] | any[] | undefined
}

const roomClassService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [roomClasses, setRoomClasses] = useState<IRoomClass[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(8)
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')

    const buildQuery = ({
        searchClassName,
        searchFeatures,
        searchMinPrice,
        searchMaxPrice,
        searchMinCapacity,
        searchMaxCapacity,
        sort,
        range
    }: RoomClassSortAndFilterParams) => {
        const query: any = {}
        if (searchClassName) query.className = searchClassName.trim()
        if (searchMinCapacity) query.minCapacity = searchMinCapacity
        if (searchMaxCapacity) query.maxCapacity = searchMaxCapacity
        if (searchMinPrice) query.minPrice = searchMinPrice
        if (searchMaxPrice) query.maxPrice = searchMaxPrice
        if (searchFeatures.length > 0) query.features = searchFeatures
        if (range) {
            if (range[0]) {
                query.startTime = dayjs(range[0]).format('YYYY-MM-DD')
            }
            if (range[1]) {
                query.endTime = dayjs(range[1]).format('YYYY-MM-DD')
            }
        }
        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify(getMappedSort(sort)))
    }

    const searchRoomClassesQuery = useQuery(['search-roomClasses', query, sort], {
        queryFn: () => {
            return axios.get<IResponseData<IRoomClass[]>>(`/roomClasses?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`)
        },
        keepPreviousData: true,
        enabled: false,
        onError: onError,
        onSuccess: res => {
            if (!res) return
            setRoomClasses(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const getAllRoomClassesQuery = useQuery(['roomClasses', page, limit], {
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IRoomClass[]>>(`/roomClasses?skip=${limit * (page - 1)}&limit=${limit}`)
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
            setRoomClasses(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const getCsvRoomClassesQuery = useQuery(['search-csv-roomClasses', query, sort], {
        queryFn: () => {
            return axios.get<IResponseData<IRoomClass[]>>(`/roomClasses?filter=${query}&sort=${sort}`)
        },
        keepPreviousData: true,
        enabled: false,
        onError: onError
    })

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchRoomClassesQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllRoomClassesQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchRoomClassesQuery.refetch()
        }
    }, [page])

    const createNewRoomClassMutation = useMutation({
        mutationFn: (data: Partial<IRoomClass>) => {
            return axios.post<IResponseData<IRoomClass>>('/roomClasses', data)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-roomClasses')
                searchRoomClassesQuery.refetch()
            } else {
                queryClient.invalidateQueries('roomClasses')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateRoomClassMutation = useMutation({
        mutationFn: (payload: { roomClassId: number; data: Partial<IRoomClass> }) => {
            return axios.patch<IResponseData<IRoomClass>>(`/roomClasses/${payload.roomClassId}`, payload.data)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-roomClasses')
                searchRoomClassesQuery.refetch()
            } else {
                queryClient.invalidateQueries('roomClasses')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const deleteRoomClassMutation = useMutation({
        mutationFn: (roomClassId: number) => {
            return axios.delete<IResponseData<any>>(`/roomClasses/${roomClassId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-roomClasses')
                searchRoomClassesQuery.refetch()
            } else {
                queryClient.invalidateQueries('roomClasses')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        roomClasses,
        total,
        page,
        limit,
        setPage,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,

        searchRoomClassesQuery,
        getAllRoomClassesQuery,
        getCsvRoomClassesQuery,
        createNewRoomClassMutation,
        updateRoomClassMutation,
        deleteRoomClassMutation
    }
}

export default roomClassService
