import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

export type FeatureSortAndFilterParams = {
    searchFeatureName: string
    searchRoomClasses: number[]
    searchAdminName: string
    sort: string
    range: string[] | any[] | undefined
}

const featureService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [features, setFeatures] = useState<IFeature[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(8)
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')

    const buildQuery = ({ searchFeatureName, searchAdminName, searchRoomClasses, sort, range }: FeatureSortAndFilterParams) => {
        const query: any = {}
        if (searchFeatureName) query.name = searchFeatureName.trim()
        if (searchAdminName) query.createdById = searchAdminName
        if (searchRoomClasses.length > 0) query.roomClasses = searchRoomClasses
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

    const searchFeaturesQuery = useQuery(['search-features', query, sort], {
        queryFn: () => {
            return axios.get<IResponseData<IFeature[]>>(`/features?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`)
        },
        keepPreviousData: true,
        enabled: false,
        onError: onError,
        onSuccess: res => {
            if (!res) return
            setFeatures(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const getAllFeaturesQuery = useQuery(['features', page, limit], {
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IFeature[]>>(`/features?skip=${limit * (page - 1)}&limit=${limit}`)
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
            setFeatures(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const getCsvFeaturesQuery = useQuery(['search-csv-features', query, sort], {
        queryFn: () => {
            return axios.get<IResponseData<IFeature[]>>(`/features?filter=${query}&sort=${sort}`)
        },
        keepPreviousData: true,
        enabled: false,
        onError: onError
    })

    const onFilterSearch = () => {
        setIsSearching(true)
        searchFeaturesQuery.refetch()
    }

    const onResetFilterSearch = () => {
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllFeaturesQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchFeaturesQuery.refetch()
        }
    }, [page])

    const createNewFeatureMutation = useMutation({
        mutationFn: (data: Partial<IFeature>) => {
            return axios.post<IResponseData<IFeature>>('/features', data)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-features')
                searchFeaturesQuery.refetch()
            } else {
                queryClient.invalidateQueries('features')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateFeatureMutation = useMutation({
        mutationFn: (payload: { featureId: number; data: Partial<IFeature> }) => {
            return axios.patch<IResponseData<IFeature>>(`/features/${payload.featureId}`, payload.data)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-features')
                searchFeaturesQuery.refetch()
            } else {
                queryClient.invalidateQueries('features')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const deleteFeatureMutation = useMutation({
        mutationFn: (featureId: number) => {
            return axios.delete<IResponseData<any>>(`/features/${featureId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-features')
                searchFeaturesQuery.refetch()
            } else {
                queryClient.invalidateQueries('features')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        features,
        total,
        page,
        limit,
        setPage,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,

        searchFeaturesQuery,
        getAllFeaturesQuery,
        getCsvFeaturesQuery,
        createNewFeatureMutation,
        updateFeatureMutation,
        deleteFeatureMutation
    }
}

export default featureService
