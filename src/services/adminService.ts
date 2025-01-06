import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'

export type AdminSortAndFilterParams = {
    searchName: string
    searchEmail: string
    searchPhoneNumber: string
    sort: string
    range: string[] | any[] | undefined
}

const adminService = ({ enableFetching }: { enableFetching: boolean }) => {
    const queryClient = useQueryClient()
    const axios = useAxiosIns()
    const [admins, setAdmins] = useState<IAdmin[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isSearching, setIsSearching] = useState(false)

    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(8)
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')

    const buildQuery = ({ searchName, searchEmail, searchPhoneNumber, sort, range }: AdminSortAndFilterParams) => {
        const query: any = {}
        if (searchName) query.name = searchName.trim()
        if (searchEmail) query.email = searchEmail.trim()
        if (searchPhoneNumber) query.phoneNumber = searchPhoneNumber.trim()
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

    const searchAdminsQuery = useQuery(['search-admins', query, sort], {
        queryFn: () => {
            return axios.get<IResponseData<IAdmin[]>>(`/admins?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}&sort=${sort}`)
        },
        keepPreviousData: true,
        enabled: false,
        onError: onError,
        onSuccess: res => {
            if (!res) return
            setAdmins(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const getAllAdminsQuery = useQuery(['admins', page, limit], {
        queryFn: () => {
            if (!isSearching) {
                return axios.get<IResponseData<IAdmin[]>>(`/admins?skip=${limit * (page - 1)}&limit=${limit}`)
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
            setAdmins(res.data.data)
            setTotal(res.data.total as number)
        }
    })

    const getCsvAdminsQuery = useQuery(['search-csv-admins', query, sort], {
        queryFn: () => {
            return axios.get<IResponseData<IAdmin[]>>(`/admins?filter=${query}&sort=${sort}`)
        },
        keepPreviousData: true,
        enabled: false,
        onError: onError
    })

    const onFilterSearch = () => {
        setPage(1)
        setIsSearching(true)
        setTimeout(() => searchAdminsQuery.refetch(), 300)
    }

    const onResetFilterSearch = () => {
        setPage(1)
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => getAllAdminsQuery.refetch(), 300)
    }

    useEffect(() => {
        if (isSearching) {
            searchAdminsQuery.refetch()
        }
    }, [page])

    const createNewAdminMutation = useMutation({
        mutationFn: (data: Partial<IAdmin>) => {
            return axios.post<IResponseData<IAdmin>>('/admins', data)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-admins')
                searchAdminsQuery.refetch()
            } else {
                queryClient.invalidateQueries('admins')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const updateAdminMutation = useMutation({
        mutationFn: ({ data }: { data: Partial<IAdmin> }) => axios.patch<IResponseData<any>>(`/admins/profile`, data),
        onSuccess: res => {
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    const toggleActiveMutation = useMutation({
        mutationFn: (adminId: number) => {
            return axios.post<IResponseData<any>>(`/admins/toggle-active/${adminId}`)
        },
        onError: onError,
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-admins')
                searchAdminsQuery.refetch()
            } else {
                queryClient.invalidateQueries('admins')
            }
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        admins,
        total,
        page,
        limit,
        setPage,
        onFilterSearch,
        onResetFilterSearch,
        buildQuery,

        searchAdminsQuery,
        getAllAdminsQuery,
        getCsvAdminsQuery,
        createNewAdminMutation,
        updateAdminMutation,
        toggleActiveMutation
    }
}

export default adminService
