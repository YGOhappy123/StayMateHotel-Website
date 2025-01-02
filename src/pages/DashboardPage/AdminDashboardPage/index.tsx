import { useState } from 'react'
import { Dialog, DialogTrigger } from '@/components/ui/Dialog'
import { Popover, PopoverTrigger } from '@/components/ui/Popover'
import dayjs from 'dayjs'

import { exportToCSV } from '@/utils/exportCsvFile'
import Button from '@/components/common/Button'
import AdminTable from '@/pages/DashboardPage/AdminDashboardPage/AdminTable'
import CreateAdminDialog from '@/pages/DashboardPage/AdminDashboardPage/CreateAdminDialog'
import adminService from '@/services/adminService'
import AdminFilter from '@/pages/DashboardPage/AdminDashboardPage/AdminFilter'

const AdminDashboardPage = () => {
    const {
        admins,
        total,
        page,
        limit,
        setPage,
        buildQuery,
        onFilterSearch,
        onResetFilterSearch,
        getCsvAdminsQuery,
        createNewAdminMutation,
        toggleActiveMutation
    } = adminService({ enableFetching: true })

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {
        getCsvAdminsQuery.refetch().then(res => {
            const csvAdmins = res.data?.data?.data ?? []

            const formattedAdmins = csvAdmins.map(admin => ({
                ['Mã Nhân Viên']: admin.id,
                ['Họ']: admin.lastName,
                ['Tên']: admin.firstName,
                ['Email']: admin.email,
                ['Ảnh đại diện']: admin.avatar,
                ['Số Điện Thoại']: admin.phoneNumber,
                ['Ngày Tạo']: dayjs(admin.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                ['Người Tạo']: admin.createdBy
            }))

            exportToCSV(formattedAdmins, `SMH_Danh_sách_tầng_${dayjs(Date.now()).format('DD/MM/YYYY')}`, [
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
                <h2 className="text-2xl font-bold">Quản lý nhân sự</h2>
                <div className="flex justify-center gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="relative min-w-[120px] cursor-pointer rounded-md border-2 border-solid border-black bg-black/10 px-6 py-3 font-medium text-black hover:opacity-90">
                                Tìm kiếm
                                {havingFilters && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600"></div>}
                            </div>
                        </PopoverTrigger>
                        <AdminFilter
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
                        <CreateAdminDialog
                            isOpen={isAddModalOpen}
                            closeDialog={() => setIsAddModalOpen(false)}
                            createNewAdminMutation={createNewAdminMutation}
                        />
                    </Dialog>

                    <Button text="Xuất CSV" variant="primary" onClick={exportCsvFile} />
                </div>
            </div>

            <AdminTable admins={admins} total={total} page={page} limit={limit} setPage={setPage} toggleActiveMutation={toggleActiveMutation} />
        </div>
    )
}

export default AdminDashboardPage
