import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Dialog, DialogTrigger } from '@/components/ui/Dialog'
import { Popover, PopoverTrigger } from '@/components/ui/Popover'
import dayjs from 'dayjs'

import { exportToCSV } from '@/utils/exportCsvFile'
import Button from '@/components/common/Button'
import ServiceTable from '@/pages/DashboardPage/ServiceDashboardPage/ServiceTable'
import CreateServiceDialog from '@/pages/DashboardPage/ServiceDashboardPage/CreateServiceDialog'
import UpdateServiceDialog from '@/pages/DashboardPage/ServiceDashboardPage/UpdateServiceDialog'
import ServiceFilter from '@/pages/DashboardPage/ServiceDashboardPage/ServiceFilter'
import serviceService from '@/services/serviceService'
import useAxiosIns from '@/hooks/useAxiosIns'

const ServiceDashboardPage = () => {
    const axios = useAxiosIns()
    const {
        services,
        total,
        page,
        limit,
        setPage,
        buildQuery,
        onFilterSearch,
        onResetFilterSearch,
        getCsvServicesQuery,
        createNewServiceMutation,
        updateServiceMutation,
        deleteServiceMutation
    } = serviceService({ enableFetching: true })

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [selectedService, setSelectedService] = useState<IService | null>(null)
    const [havingFilters, setHavingFilters] = useState(false)

    const fetchAllAdminsQuery = useQuery(['admins-all'], {
        queryFn: () => axios.get<IResponseData<IAdmin[]>>(`/admins`),
        refetchOnWindowFocus: false,
        enabled: true,
        select: res => res.data
    })
    const admins = fetchAllAdminsQuery.data?.data || []

    useEffect(() => {
        if (isAddModalOpen || isUpdateModalOpen || isFilterOpen) {
            //
        }
    }, [isAddModalOpen, isUpdateModalOpen, isFilterOpen])

    const exportCsvFile = () => {
        getCsvServicesQuery.refetch().then(res => {
            const csvServices = res.data?.data?.data || []

            const formattedServices = csvServices.map(service => ({
                ['Mã Dịch Vụ']: service.id,
                ['Tên Dịch Vụ']: service.name,
                ['Giá Dịch Vụ']: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price as number),
                ['Ngày Tạo']: dayjs(service.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                ['Người Tạo']: `${service.createdBy?.lastName} ${service.createdBy?.firstName}`
            }))

            exportToCSV(formattedServices, `SMH_Danh_sách_dịch_vụ_${dayjs(Date.now()).format('DD/MM/YYYY')}`, [
                { wch: 10 },
                { wch: 20 },
                { wch: 20 },
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
                <h2 className="text-2xl font-bold">Quản lý dịch vụ</h2>
                <div className="flex justify-center gap-4">
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <div className="relative min-w-[120px] cursor-pointer rounded-md border-2 border-solid border-black bg-black/10 px-6 py-3 font-medium text-black hover:opacity-90">
                                Tìm kiếm
                                {havingFilters && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600"></div>}
                            </div>
                        </PopoverTrigger>
                        <ServiceFilter
                            admins={admins}
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
                        <CreateServiceDialog
                            isOpen={isAddModalOpen}
                            closeDialog={() => setIsAddModalOpen(false)}
                            createNewServiceMutation={createNewServiceMutation}
                        />
                    </Dialog>

                    <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                        <UpdateServiceDialog
                            selectedService={selectedService}
                            isOpen={isUpdateModalOpen}
                            closeDialog={() => setIsUpdateModalOpen(false)}
                            updateServiceMutation={updateServiceMutation}
                        />
                    </Dialog>

                    <Button text="Xuất CSV" variant="primary" onClick={exportCsvFile} />
                </div>
            </div>

            <ServiceTable
                services={services}
                total={total}
                page={page}
                limit={limit}
                setPage={setPage}
                onSelectService={(service: IService) => {
                    setSelectedService(service)
                    setIsUpdateModalOpen(true)
                }}
                deleteServiceMutation={deleteServiceMutation}
            />
        </div>
    )
}

export default ServiceDashboardPage
