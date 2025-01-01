import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

export type ServiceSortAndFilterParams = {
    searchServiceName: string
    searchServiceQuery: string
    sort: string
    range: string[] | any[] | undefined
}

const serviceService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [services, setServices] = useState<IService[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(8)
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')

    const buildQuery = ({ searchServiceName, searchServiceQuery, sort, range }: ServiceSortAndFilterParams) => {
        const query: any = {}
        if (searchServiceName) query.name = searchServiceName.trim()
        if (searchServiceQuery) query.serviceQuery = searchServiceQuery
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

    const searchServicesQuery = useQuery(['search-services', query, sort], {
        queryFn: () => {
            return axios.get<IResponseData<IService[]>>(`/services?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`)
        },
        keepPreviousData: true,
        enabled: false,
        onError: onError,
        onSuccess: res => {
            if (!res) return
            setServices(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const getAllServicesQuery = useQuery(['services', page, limit], {
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IService[]>>(`/services?skip=${limit * (page - 1)}&limit=${limit}`)
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
            setServices(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const onFilterSearch = () => {
        setIsSearching(true)
        searchServicesQuery.refetch()
    }

    const onResetFilterSearch = () => {
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllServicesQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchServicesQuery.refetch()
        }
    }, [page])

    const createNewServiceMutation = useMutation({
        mutationFn: (data: Partial<IService>) => {
            return axios.post<IResponseData<IService>>('/services', data)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-services')
                searchServicesQuery.refetch()
            } else {
                queryClient.invalidateQueries('services')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateServiceMutation = useMutation({
        mutationFn: (payload: { serviceId: number; data: Partial<IService> }) => {
            return axios.patch<IResponseData<IService>>(`/services/${payload.serviceId}`, payload.data)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-services')
                searchServicesQuery.refetch()
            } else {
                queryClient.invalidateQueries('services')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const deleteServiceMutation = useMutation({
        mutationFn: (serviceId: number) => {
            return axios.delete<IResponseData<any>>(`/services/${serviceId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-services')
                searchServicesQuery.refetch()
            } else {
                queryClient.invalidateQueries('services')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        services,
        total,
        page,
        limit,
        setPage,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,

        searchServicesQuery,
        getAllServicesQuery,
        createNewServiceMutation,
        updateServiceMutation,
        deleteServiceMutation
    }
}

export default serviceService
