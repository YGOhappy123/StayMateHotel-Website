import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Dialog, DialogTrigger } from '@/components/ui/Dialog'
import { Popover, PopoverTrigger } from '@/components/ui/Popover'
import dayjs from 'dayjs'

import { exportToCSV } from '@/utils/exportCsvFile'
import { getMappedStatus } from '@/utils/roomStatusMapping'
import Button from '@/components/common/Button'
import RoomTable from '@/pages/DashboardPage/RoomDashboardPage/RoomTable'
import CreateRoomDialog from '@/pages/DashboardPage/RoomDashboardPage/CreateRoomDialog'
import UpdateRoomDialog from '@/pages/DashboardPage/RoomDashboardPage/UpdateRoomDialog'
import useAxiosIns from '@/hooks/useAxiosIns'
import roomService from '@/services/roomService'
import RoomFilter from '@/pages/DashboardPage/RoomDashboardPage/RoomFilter'

const RoomDashboardPage = () => {
    const axios = useAxiosIns()
    const {
        rooms,
        total,
        page,
        limit,
        setPage,
        buildQuery,
        onFilterSearch,
        onResetFilterSearch,
        createNewRoomMutation,
        updateRoomMutation,
        deleteRoomMutation,
        toggleMaintenanceMutation,
        markCleaningDoneMutation
    } = roomService({ enableFetching: true })

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null)
    const [havingFilters, setHavingFilters] = useState(false)

    const fetchAllFloorsQuery = useQuery(['floors-all'], {
        queryFn: () => {
            return axios.get<IResponseData<IFloor[]>>(`/floors`)
        },
        refetchOnWindowFocus: false,
        enabled: false,
        select: res => res.data
    })

    const fetchAllRoomClassesQuery = useQuery(['room-classes-all'], {
        queryFn: () => {
            return axios.get<IResponseData<IRoomClass[]>>(`/room-classes`)
        },
        refetchOnWindowFocus: false,
        enabled: false,
        select: res => res.data
    })

    const floors = fetchAllFloorsQuery.data?.data || [
        { id: 1, floorNumber: '101', createdAt: '' },
        { id: 2, floorNumber: '102', createdAt: '' }
    ]
    const roomClasses = fetchAllRoomClassesQuery.data?.data || [
        { id: 1, className: 'Family', createdAt: '', basePrice: 500000, capacity: 10 },
        { id: 2, className: 'VIP', createdAt: '', basePrice: 500000, capacity: 10 },
        { id: 3, className: 'Super VIP', createdAt: '', basePrice: 500000, capacity: 10 }
    ]

    useEffect(() => {
        if (isAddModalOpen || isUpdateModalOpen) {
            fetchAllFloorsQuery.refetch()
            fetchAllRoomClassesQuery.refetch()
        }
    }, [isAddModalOpen, isUpdateModalOpen])

    const exportCsvFile = () => {
        const formattedRooms = rooms.map(room => ({
            ['Mã Phòng']: room.id,
            ['Số Phòng']: room.roomNumber,
            ['Tầng']: room.floor?.floorNumber,
            ['Loại Phòng']: room.roomClass?.className,
            ['Giá Phòng Theo Ngày']: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                room.roomClass?.basePrice as number
            ),
            ['Trạng Thái Phòng']: getMappedStatus(room.status),
            ['Ngày Tạo']: dayjs(room.createdAt).format('DD/MM/YYYY HH:mm:ss'),
            ['Người Tạo']: `${room.createdBy?.lastName} ${room.createdBy?.firstName}`
        }))

        exportToCSV(formattedRooms, `SMH_Danh_sách_phòng_${dayjs(Date.now()).format('DD/MM/YYYY')}`, [
            { wch: 10 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 }
        ])
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between p-4">
                <h2 className="text-2xl font-bold">Quản lý phòng khách sạn</h2>
                <div className="flex justify-center gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="relative min-w-[120px] cursor-pointer rounded-md border-2 border-solid border-black bg-black/10 px-6 py-3 font-medium text-black hover:opacity-90">
                                Tìm kiếm
                                {havingFilters && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600"></div>}
                            </div>
                        </PopoverTrigger>
                        <RoomFilter
                            floors={floors}
                            roomClasses={roomClasses}
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
                        <CreateRoomDialog
                            isOpen={isAddModalOpen}
                            closeDialog={() => setIsAddModalOpen(false)}
                            floors={floors}
                            roomClasses={roomClasses}
                            createNewRoomMutation={createNewRoomMutation}
                        />
                    </Dialog>

                    <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                        <UpdateRoomDialog
                            selectedRoom={selectedRoom}
                            isOpen={isUpdateModalOpen}
                            closeDialog={() => setIsUpdateModalOpen(false)}
                            floors={floors}
                            roomClasses={roomClasses}
                            updateRoomMutation={updateRoomMutation}
                        />
                    </Dialog>

                    <Button text="Xuất CSV" variant="primary" onClick={exportCsvFile} />
                </div>
            </div>

            <RoomTable
                rooms={rooms}
                total={total}
                page={page}
                limit={limit}
                setPage={setPage}
                onSelectRoom={(room: IRoom) => {
                    setSelectedRoom(room)
                    setIsUpdateModalOpen(true)
                }}
                deleteRoomMutation={deleteRoomMutation}
                toggleMaintenanceMutation={toggleMaintenanceMutation}
                markCleaningDoneMutation={markCleaningDoneMutation}
            />
        </div>
    )
}

export default RoomDashboardPage
