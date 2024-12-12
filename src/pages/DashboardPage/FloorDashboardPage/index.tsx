import { useState } from 'react'
import { Dialog, DialogTrigger } from '@/components/ui/Dialog'
import { Popover, PopoverTrigger } from '@/components/ui/Popover'
import dayjs from 'dayjs'

import { exportToCSV } from '@/utils/exportCsvFile'
import Button from '@/components/common/Button'
import FloorTable from '@/pages/DashboardPage/FloorDashboardPage/FloorTable'
import CreateFloorDialog from '@/pages/DashboardPage/FloorDashboardPage/CreateFloorDialog'
import UpdateFloorDialog from '@/pages/DashboardPage/FloorDashboardPage/UpdateFloorDialog'
import floorService from '@/services/floorService'
import FloorFilter from '@/pages/DashboardPage/FloorDashboardPage/FloorFilter'

const FloorDashboardPage = () => {
    const {
        floors,
        total,
        page,
        limit,
        setPage,
        buildQuery,
        onFilterSearch,
        onResetFilterSearch,
        createNewFloorMutation,
        updateFloorMutation,
        deleteFloorMutation
    } = floorService({ enableFetching: true })

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [selectedFloor, setSelectedFloor] = useState<IFloor | null>(null)
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        const formattedFloors = floors.map(floor => ({
            ['Mã Tầng']: floor.id,
            ['Số Tầng']: floor.floorNumber,
            ['Ngày Tạo']: dayjs(floor.createdAt).format('DD/MM/YYYY HH:mm:ss'),
            ['Người Tạo']: `${floor.createdBy?.lastName} ${floor.createdBy?.firstName}`
        }))

        exportToCSV(formattedFloors, `SMH_Danh_sách_tầng_${dayjs(Date.now()).format('DD/MM/YYYY')}`, [
            { wch: 10 },
            { wch: 20 },
            { wch: 30 },
            { wch: 30 }
        ])
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between p-4">
                <h2 className="text-2xl font-bold">Quản lý tầng khách sạn</h2>
                <div className="flex justify-center gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="relative min-w-[120px] cursor-pointer rounded-md border-2 border-solid border-black bg-black/10 px-6 py-3 font-medium text-black hover:opacity-90">
                                Tìm kiếm
                                {havingFilters && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600"></div>}
                            </div>
                        </PopoverTrigger>
                        <FloorFilter
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
                        <CreateFloorDialog
                            isOpen={isAddModalOpen}
                            closeDialog={() => setIsAddModalOpen(false)}
                            createNewFloorMutation={createNewFloorMutation}
                        />
                    </Dialog>

                    <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                        <UpdateFloorDialog
                            selectedFloor={selectedFloor}
                            isOpen={isUpdateModalOpen}
                            closeDialog={() => setIsUpdateModalOpen(false)}
                            updateFloorMutation={updateFloorMutation}
                        />
                    </Dialog>

                    <Button text="Xuất CSV" variant="primary" onClick={exportCsvFile} />
                </div>
            </div>

            <FloorTable
                floors={floors}
                total={total}
                page={page}
                limit={limit}
                setPage={setPage}
                onSelectFloor={(floor: IFloor) => {
                    setSelectedFloor(floor)
                    setIsUpdateModalOpen(true)
                }}
                deleteFloorMutation={deleteFloorMutation}
            />
        </div>
    )
}

export default FloorDashboardPage
