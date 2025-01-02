import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination'
import dayjs from '@/libs/dayjs'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import Button from '@/components/common/Button'
import featureService from '@/services/featureService'
import fileService from '@/services/fileService'

type FeatureTableProps = {
    features: IFeature[] // Dữ liệu tiện ích
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    onSelectFeature: (feature: IFeature) => void
    deleteFeatureMutation: any
}

const FeatureTable = ({
    features,
    total,
    page,
    limit,
    setPage,
    onSelectFeature,
    deleteFeatureMutation
}: FeatureTableProps) => {

    const calculateTotalQuantity = (roomClasses: { quantity: number }[]) => {
        return roomClasses.reduce((sum, room) => sum + room.quantity, 0)
    }
    const columns: ColumnDef<IFeature>[] = [
        {
            accessorKey: 'id',
            header: 'Mã Tiện Ích'
        },
        {
            accessorKey: 'name',
            header: 'Tên Tiện Ích'
        },
        {
            accessorKey: 'quantity',
            header: '     Số Lượng',
            cell: ({ row }) => {
                // Tính tổng quantity từ tất cả các roomClass
                const quantity = row.original.roomClasses.reduce((sum: number, room: { quantity: number }) => sum + room.quantity, 0);

                return (
                    <div className="flex items-center justify-center">
                        <div
                            className={`w-[30px] h-[30px] text-center font-medium ${quantity >= 0 ? 'bg-blue-100 text-blue-600 border-blue-600' : 'bg-gray-100 text-gray-600 border-gray-600'} border-2 rounded-md flex items-center justify-center hover:opacity-90`}
                        >
                            {/* Nếu có quantity và dấu x */}
                            {quantity >= 0 && (
                                <div className="flex items-center justify-center space-x-0.5">
                                    <span className="text-red-500 font-bold text-[6px]"> {/* Kích thước chữ giảm còn 6px */}
                                        ✖
                                    </span>
                                    <span>{quantity}</span>
                                </div>
                            )}
                            {/* Hiển thị số lượng nếu không có dấu x */}
                            {/*{quantity === 0 && (*/}
                            {/*    <span className="flex items-center justify-center">0</span>*/}
                            {/*)}*/}
                        </div>
                    </div>
                );
            }
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
                const feature = row.original
                return (
                    <div className="grid grid-cols-1 gap-2">
                        <Button
                            text="Cập nhật"
                            variant="success"
                            className="min-w-fit rounded px-3 py-1.5 text-xs"
                            onClick={() => onSelectFeature(feature)}
                        />
                        <ConfirmationDialog
                            Trigger={
                                <button className="min-w-fit rounded border-2 border-solid border-red-600 bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:opacity-90 disabled:cursor-not-allowed disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-50">
                                    Xóa tiện ích
                                </button>
                            }
                            title="Xác nhận xóa tiện ích"
                            body="Bạn có chắc muốn xóa tiện ích này không? Thao tác này sẽ không thể hoàn tác."
                            onConfirm={async () => {
                                await deleteFeatureMutation.mutateAsync(feature.id)
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
            <DataTable columns={columns} data={features} />
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => setPage(page === 1 ? 1 : page - 1)} />
                    </PaginationItem>
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

export default FeatureTable
