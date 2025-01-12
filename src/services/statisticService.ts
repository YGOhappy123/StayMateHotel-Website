import { useState } from 'react'
import { useQuery } from 'react-query'
import { onError } from '@/utils/errorsHandler'
import useAxiosIns from '@/hooks/useAxiosIns'

interface IStatistics {
    currentCount: number
    previousCount: number
}

type StatisticsResponse = {
    guests: IStatistics
    bookings: IStatistics
    revenues: IStatistics
}

type PopularDataResponse = {
    mostBookedRooms: IRoom[]
    highestBookingCountGuests: IGuest[]
    highestTotalPaymentGuests: IGuest[]
}

export type StatisticCriteria = 'daily' | 'weekly' | 'monthly' | 'yearly'

const statisticService = ({ enableFetching }: { enableFetching: boolean }) => {
    const axios = useAxiosIns()
    const [type, setType] = useState<StatisticCriteria>('daily')

    const getStatisticsQuery = useQuery(['statistics', type], {
        queryFn: () => axios.get<IResponseData<StatisticsResponse>>(`/statistic?type=${type}`),
        refetchOnWindowFocus: true,
        refetchInterval: 10000,
        refetchIntervalInBackground: true,
        enabled: enableFetching,
        onError: onError,
        select: res => res.data.data
    })

    const getPopularDataQuery = useQuery(['statistics-popular', type], {
        queryFn: () => axios.get<IResponseData<PopularDataResponse>>(`/statistic/popular?type=${type}`),
        refetchOnWindowFocus: true,
        refetchInterval: 10000,
        refetchIntervalInBackground: true,
        enabled: enableFetching,
        onError: onError,
        select: res => res.data.data
    })

    const getRevenuesChartQuery = useQuery(['revenues-chart', type], {
        queryFn: () => axios.get<IResponseData<any>>(`/statistic/revenues?type=${type}`),
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        enabled: enableFetching,
        select: res => res.data?.data
    })

    return {
        getStatisticsQuery,
        getPopularDataQuery,
        getRevenuesChartQuery,
        type,
        setType
    }
}

export default statisticService
