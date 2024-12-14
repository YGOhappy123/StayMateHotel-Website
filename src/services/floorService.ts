import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

export type FloorSortAndFilterParams = {
    searchFloorNumber: string
    sort: string
    range: string[] | any[] | undefined
}

const floorService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [floors, setFloors] = useState<IFloor[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(8)
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')

    const buildQuery = ({ searchFloorNumber, sort, range }: FloorSortAndFilterParams) => {
        const query: any = {}
        if (searchFloorNumber) query.floorNumber = searchFloorNumber.trim()
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

    const searchFloorsQuery = useQuery(['search-floors', query, sort], {
        queryFn: () => {
            return axios.get<IResponseData<IFloor[]>>(`/floors?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`)
        },
        keepPreviousData: true,
        enabled: false,
        onError: onError,
        onSuccess: res => {
            if (!res) return
            setFloors(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const getAllFloorsQuery = useQuery(['floors', page, limit], {
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IFloor[]>>(`/floors?skip=${limit * (page - 1)}&limit=${limit}`)
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
            setFloors(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchFloorsQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllFloorsQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchFloorsQuery.refetch()
        }
    }, [page])

    const createNewFloorMutation = useMutation({
        mutationFn: (data: Partial<IFloor>) => {
            return axios.post<IResponseData<IFloor>>('/floors', data)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-floors')
                searchFloorsQuery.refetch()
            } else {
                queryClient.invalidateQueries('floors')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateFloorMutation = useMutation({
        mutationFn: (payload: { floorId: number; data: Partial<IFloor> }) => {
            return axios.patch<IResponseData<IFloor>>(`/floors/${payload.floorId}`, payload.data)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-floors')
                searchFloorsQuery.refetch()
            } else {
                queryClient.invalidateQueries('floors')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const deleteFloorMutation = useMutation({
        mutationFn: (floorId: number) => {
            return axios.delete<IResponseData<any>>(`/floors/${floorId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-floors')
                searchFloorsQuery.refetch()
            } else {
                queryClient.invalidateQueries('floors')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        floors,
        total,
        page,
        limit,
        setPage,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,

        searchFloorsQuery,
        getAllFloorsQuery,
        createNewFloorMutation,
        updateFloorMutation,
        deleteFloorMutation
    }
}

export default floorService
