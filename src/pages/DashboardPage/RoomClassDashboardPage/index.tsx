import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Dialog, DialogTrigger } from '@/components/ui/Dialog'
import { Popover, PopoverTrigger } from '@/components/ui/Popover'
import dayjs from 'dayjs'

import { exportToCSV } from '@/utils/exportCsvFile'
import Button from '@/components/common/Button'
import RoomClassTable from '@/pages/DashboardPage/RoomClassDashboardPage/RoomClassTable'
import CreateRoomClassDialog from '@/pages/DashboardPage/RoomClassDashboardPage/CreateRoomClassDialog'
import UpdateRoomClassDialog from '@/pages/DashboardPage/RoomClassDashboardPage/UpdateRoomClassDialog'
import RoomClassFilter from '@/pages/DashboardPage/RoomClassDashboardPage/RoomClassFilter'
import roomClassService from '@/services/roomClassService'
import useAxiosIns from '@/hooks/useAxiosIns'

const RoomClassDashboardPage = () => {
    const axios = useAxiosIns()
    const {
        roomClasses,
        total,
        page,
        limit,
        setPage,
        buildQuery,
        onFilterSearch,
        onResetFilterSearch,
        getCsvRoomClassesQuery,
        createNewRoomClassMutation,
        updateRoomClassMutation,
        deleteRoomClassMutation
    } = roomClassService({ enableFetching: true })

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [selectedRoomClass, setSelectedRoomClass] = useState<IRoomClass | null>(null)
    const [havingFilters, setHavingFilters] = useState(false)

    const fetchAllFeaturesQuery = useQuery(['room-classes-all'], {
        queryFn: () => {
            return axios.get<IResponseData<IFeature[]>>(`/features`)
        },
        refetchOnWindowFocus: false,
        enabled: true,
        select: res => res.data
    })

    const features = fetchAllFeaturesQuery.data?.data || []

    useEffect(() => {
        if (isAddModalOpen || isUpdateModalOpen || isFilterOpen) {
            fetchAllFeaturesQuery.refetch()
        }
    }, [isAddModalOpen, isUpdateModalOpen, isFilterOpen])

    const exportCsvFile = () => {
        getCsvRoomClassesQuery.refetch().then(res => {
            const csvRoomClasses = res.data?.data?.data || []

            const formattedRoomClasses = csvRoomClasses.map(roomClass => ({
                ['Mã Loại Phòng']: roomClass.id,
                ['Tên Loại Phòng']: roomClass.className,
                ['Giá Thuê Theo Ngày']: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(roomClass.basePrice as number),
                ['Ngày Tạo']: dayjs(roomClass.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                ['Người Tạo']: `${roomClass.createdBy?.lastName} ${roomClass.createdBy?.firstName}`
            }))

            exportToCSV(formattedRoomClasses, `SMH_Danh_sách_loại_phòng_${dayjs(Date.now()).format('DD/MM/YYYY')}`, [
                { wch: 10 },
                { wch: 20 },
                { wch: 20 },
                { wch: 30 },
                { wch: 30 },
                { wch: 30 },
                { wch: 30 },
                { wch: 30 }
            ])
        })
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between p-4">
                <h2 className="text-2xl font-bold">Quản lý loại phòng khách sạn</h2>
                <div className="flex justify-center gap-4">
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <div className="relative min-w-[120px] cursor-pointer rounded-md border-2 border-solid border-black bg-black/10 px-6 py-3 font-medium text-black hover:opacity-90">
                                Tìm kiếm
                                {havingFilters && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600"></div>}
                            </div>
                        </PopoverTrigger>
                        <RoomClassFilter
                            features={features}
                            setHavingFilters={setHavingFilters}
                            onChange={buildQuery}
                            onSearch={onFilterSearch}
                            onReset={onResetFilterSearch}
                        />
                    </Popover>

                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger>
                            <div className="min-w-[120px] rounded-md border-2 border-solid border-blue-600 bg-blue-100 px-6 py-3 font-medium text-blue-600 hover:opacity-90">
                                Thêm mới
                            </div>
                        </DialogTrigger>
                        <CreateRoomClassDialog
                            features={features}
                            isOpen={isAddModalOpen}
                            closeDialog={() => setIsAddModalOpen(false)}
                            createNewRoomClassMutation={createNewRoomClassMutation}
                        />
                    </Dialog>

                    <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                        <UpdateRoomClassDialog
                            features={features}
                            selectedRoomClass={selectedRoomClass}
                            isOpen={isUpdateModalOpen}
                            closeDialog={() => setIsUpdateModalOpen(false)}
                            updateRoomClassMutation={updateRoomClassMutation}
                        />
                    </Dialog>

                    <Button text="Xuất CSV" variant="primary" onClick={exportCsvFile} />
                </div>
            </div>

            <RoomClassTable
                roomClasses={roomClasses}
                total={total}
                page={page}
                limit={limit}
                setPage={setPage}
                onSelectRoomClass={(roomClass: IRoomClass) => {
                    setSelectedRoomClass(roomClass)
                    setIsUpdateModalOpen(true)
                }}
                deleteRoomClassMutation={deleteRoomClassMutation}
            />
        </div>
    )
}

export default RoomClassDashboardPage
