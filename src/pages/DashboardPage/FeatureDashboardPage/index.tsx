import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Dialog, DialogTrigger } from '@/components/ui/Dialog'
import { Popover, PopoverTrigger } from '@/components/ui/Popover'
import dayjs from 'dayjs'

import { exportToCSV } from '@/utils/exportCsvFile'
import Button from '@/components/common/Button'
import FeatureTable from '@/pages/DashboardPage/FeatureDashboardPage/FeatureTable'
import CreateFeatureDialog from '@/pages/DashboardPage/FeatureDashboardPage/CreateFeatureDialog'
import UpdateFeatureDialog from '@/pages/DashboardPage/FeatureDashboardPage/UpdateFeatureDialog'
import FeatureFilter from '@/pages/DashboardPage/FeatureDashboardPage/FeatureFilter'
import featureService from '@/services/featureService'
import useAxiosIns from '@/hooks/useAxiosIns'

const FeatureDashboardPage = () => {
    const axios = useAxiosIns()
    const {
        features,
        total,
        page,
        limit,
        setPage,
        buildQuery,
        onFilterSearch,
        onResetFilterSearch,
        getCsvFeaturesQuery,
        createNewFeatureMutation,
        updateFeatureMutation,
        deleteFeatureMutation
    } = featureService({ enableFetching: true })

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [selectedFeature, setSelectedFeature] = useState<IFeature | null>(null)
    const [havingFilters, setHavingFilters] = useState(false)

    const fetchAllRoomClassesQuery = useQuery(['features-all'], {
        queryFn: () => axios.get<IResponseData<IRoomClass[]>>(`/roomClasses`),
        refetchOnWindowFocus: false,
        enabled: true,
        select: res => res.data,
        onSuccess: data => console.log('Room classes data:', data),
        onError: error => console.error('Error fetching room classes:', error),
    })
    const roomClasses = fetchAllRoomClassesQuery.data?.data || []

    const fetchAllAdminsQuery = useQuery(['admins-all'], {
        queryFn: () => axios.get<IResponseData<IAdmin[]>>(`/admins`),
        refetchOnWindowFocus: false,
        enabled: true,
        select: res => res.data,
        onSuccess: data => console.log('Admins data:', data),
        onError: error => console.error('Error fetching Admins:', error),
    })
    const admins = fetchAllAdminsQuery.data?.data || []
    

    useEffect(() => {
        if (isAddModalOpen || isUpdateModalOpen) {
            //
        }
    }, [isAddModalOpen, isUpdateModalOpen])

    const exportCsvFile = () => {
        getCsvFeaturesQuery.refetch().then(res => {
            if (!getCsvFeaturesQuery.data) return; 
            const csvFeatures = res.data?.data?.data ?? []
            const formattedFeatures = csvFeatures.map(feature => ({
                ['Mã Tiện ích']: feature.id,
                ['Tên Tiện ích']: feature.name,
                ['Ngày Tạo']: dayjs(feature.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                ['Người Tạo']: `${feature.createdBy?.lastName} ${feature.createdBy?.firstName}`,
            }));

            exportToCSV(formattedFeatures, `SMH_Danh_sách_tiện_ích_${dayjs(Date.now()).format('DD_MM_YYYY')}`, [
                { wch: 10 },
                { wch: 30 },
                { wch: 30 },
                { wch: 30 },
            ]);
        });
    };


    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between p-4">
                <h2 className="text-2xl font-bold">Quản lý tiện ích</h2>
                <div className="flex justify-center gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="relative min-w-[120px] cursor-pointer rounded-md border-2 border-solid border-black bg-black/10 px-6 py-3 font-medium text-black hover:opacity-90">
                                Tìm kiếm
                                {havingFilters && (
                                    <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600"></div>
                                )}
                            </div>
                        </PopoverTrigger>
                        <FeatureFilter
                            roomClasses={roomClasses}
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
                        <CreateFeatureDialog
                            isOpen={isAddModalOpen}
                            closeDialog={() => setIsAddModalOpen(false)}
                            createNewFeatureMutation={createNewFeatureMutation}
                        />
                    </Dialog>

                    <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                        <UpdateFeatureDialog
                            selectedFeature={selectedFeature}
                            isOpen={isUpdateModalOpen}
                            closeDialog={() => setIsUpdateModalOpen(false)}
                            updateFeatureMutation={updateFeatureMutation}
                        />
                    </Dialog>

                    <Button text="Xuất CSV" variant="primary" onClick={exportCsvFile} />
                </div>
            </div>

            <FeatureTable
                features={features}
                total={total}
                page={page}
                limit={limit}
                setPage={setPage}
                onSelectFeature={(feature: IFeature) => {
                    setSelectedFeature(feature)
                    setIsUpdateModalOpen(true)
                }}
                deleteFeatureMutation={deleteFeatureMutation}
            />
        </div>
    )
}

export default FeatureDashboardPage
