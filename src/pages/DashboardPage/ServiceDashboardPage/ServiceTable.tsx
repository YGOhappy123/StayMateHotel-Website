import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination'
import dayjs from '@/libs/dayjs'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import Button from '@/components/common/Button'
import serviceService from '@/services/serviceService'

type ServiceTableProps = {
    services: IService[] // Dữ liệu dịch vụ
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    onSelectService: (service: IService) => void
    deleteServiceMutation: any
}

const ServiceTable = ({
    services,
    total,
    page,
    limit,
    setPage,
    onSelectService,
    deleteServiceMutation,
}: ServiceTableProps) => {
    const columns: ColumnDef<IService>[] = [
        {
            accessorKey: 'id',
            header: 'Mã Dịch Vụ'
        },
        {
            accessorKey: 'name',
            header: 'Tên Dịch Vụ'
        },
        {
            accessorKey: 'createdAt',
            header: 'Ngày Và Người Tạo',
            enableHiding: true,
            cell: ({ row }) => {
                const createdAt = row.original.createdAt
                const createdBy = row.original.createdBy
                return (
                    <div>
                        <div>
                            <span className="font-semibold">Ngày tạo: </span>
                            {dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss')}
                        </div>
                        <div>
                            <span className="font-semibold">Người tạo: </span>
                            {`${createdBy?.lastName} ${createdBy?.firstName}`}
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'actions',
            header: () => <div className="text-center">Hành Động</div>,
            cell: ({ row }) => {
                const service = row.original
                return (
                    <div className="grid grid-cols-1 gap-2">
                        <Button
                            text="Cập nhật"
                            variant="success"
                            className="min-w-fit rounded px-3 py-1.5 text-xs"
                            onClick={() => onSelectService(service)} // Chọn dịch vụ để sửa đổi
                        />
                        <ConfirmationDialog
                            Trigger={
                                <button className="min-w-fit rounded border-2 border-solid border-red-600 bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:opacity-90 disabled:cursor-not-allowed disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-50">
                                    Xóa dịch vụ
                                </button>
                            }
                            title="Xác nhận xóa dịch vụ"
                            body="Bạn có chắc muốn xóa dịch vụ này không? Thao tác này sẽ không thể hoàn tác."
                            onConfirm={async () => {
                                await deleteServiceMutation.mutateAsync(service.id) // Gọi API xóa dịch vụ
                            }}
                        />
                    </div>
                )
            }
        }
    ]

    const lastPage = Math.ceil(total / limit)

    return (
        <div className="flex flex-col gap-8">
            {/* Hiển thị bảng với dữ liệu và cột đã định nghĩa */}
            <DataTable columns={columns} data={services} />
            {/* Hiển thị phân trang */}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => setPage(page === 1 ? 1 : page - 1)} />
                    </PaginationItem>
                    {/* Lọc trang */}
                    {Array.from({ length: lastPage }, (_, i) => i + 1).map(num => (
                        <PaginationItem key={num}>
                            <PaginationLink isActive={num === page} onClick={() => setPage(num)}>
                                {num}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext onClick={() => setPage(page === lastPage ? lastPage : page + 1)} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default ServiceTable
