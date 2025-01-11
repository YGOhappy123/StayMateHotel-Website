import statisticService, { StatisticCriteria } from '@/services/statisticService'
import Button from '@/components/common/Button'
import HighestBookingCountGuestTable from '@/pages/DashboardPage/OverallDashboardPage/HighestBookingCountGuestTable'
import HighestTotalPaymentGuestTable from '@/pages/DashboardPage/OverallDashboardPage/HighestTotalPaymentGuestTable'
import MostBookedRoomTable from '@/pages/DashboardPage/OverallDashboardPage/MostBookedRoomTable'
import RevenuesChart from '@/pages/DashboardPage/OverallDashboardPage/RevenuesChart'
import StatisticCard from '@/pages/DashboardPage/OverallDashboardPage/StatisticCard'

const STATISTIC_CRITERIA_BUTTONS = [
    {
        label: 'Hôm nay',
        value: 'daily'
    },
    {
        label: 'Tuần này',
        value: 'weekly'
    },
    {
        label: 'Tháng này',
        value: 'monthly'
    },
    {
        label: 'Năm nay',
        value: 'yearly'
    }
]

const OverallDashboardPage = () => {
    const { type, setType, getStatisticsQuery, getPopularDataQuery, getRevenuesChartQuery } = statisticService({ enableFetching: true })

    const guests = getStatisticsQuery.data?.guests
    const bookings = getStatisticsQuery.data?.bookings
    const revenues = getStatisticsQuery.data?.revenues
    const revenueChartData = getRevenuesChartQuery.data
    const mostBookedRooms = getPopularDataQuery.data?.mostBookedRooms
    const highestBookingCountGuests = getPopularDataQuery.data?.highestBookingCountGuests
    const highestTotalPaymentGuests = getPopularDataQuery.data?.highestTotalPaymentGuests

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between p-4">
                <h2 className="text-2xl font-bold">Quản lý phòng khách sạn</h2>
                <div className="flex justify-center gap-4">
                    {STATISTIC_CRITERIA_BUTTONS.map(button => (
                        <Button
                            key={button.value}
                            text={button.label}
                            variant={type === button.value ? 'gradient' : undefined}
                            onClick={() => setType(button.value as StatisticCriteria)}
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-3">
                    <StatisticCard
                        loading={getStatisticsQuery.isLoading}
                        value={revenues?.currentCount ?? 0}
                        previousValue={revenues?.previousCount ?? 0}
                        label="Doanh thu"
                        unit="Vnđ"
                        to="/dashboard"
                    />
                    <StatisticCard
                        loading={getStatisticsQuery.isLoading}
                        value={guests?.currentCount ?? 0}
                        previousValue={guests?.previousCount ?? 0}
                        label="Khách hàng mới"
                        unit="Tài khoản"
                        to="/dashboard/guests"
                    />
                    <StatisticCard
                        loading={getStatisticsQuery.isLoading}
                        value={bookings?.currentCount ?? 0}
                        previousValue={bookings?.previousCount ?? 0}
                        label="Đơn đặt phòng mới"
                        unit="Đơn"
                        to="/dashboard/bookings"
                    />
                </div>

                <div className="col-span-2">
                    <RevenuesChart
                        loading={getRevenuesChartQuery.isLoading}
                        data={revenueChartData}
                        title={`Biểu đồ doanh thu trong ${STATISTIC_CRITERIA_BUTTONS.find(item => item.value === type)?.label.toLocaleLowerCase()}`}
                    />
                </div>

                <MostBookedRoomTable rooms={mostBookedRooms ?? []} />
                <HighestBookingCountGuestTable guests={highestBookingCountGuests ?? []} />
                <HighestTotalPaymentGuestTable guests={highestTotalPaymentGuests ?? []} />
            </div>
        </div>
    )
}

export default OverallDashboardPage
