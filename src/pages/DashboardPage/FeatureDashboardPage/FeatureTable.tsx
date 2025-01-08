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
            accessorKey: 'roomClasses',
            header: () => <div className="text-center">Loại Phòng</div>,
            cell: ({ row }) => {
                const roomClasses = row.original.roomClasses;

                return (
                    <div className="flex flex-col items-center justify-center space-y-2">
                        {roomClasses && roomClasses.length > 0 ? (
                            roomClasses.map((roomClass, index) => (
                                <div key={index} className="flex items-center space-x-2 justify-center">
                                    <span className="rounded-full bg-green-200 px-2 py-1 text-xs text-green-800">
                                        {roomClass.className}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-400 mb-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 13h6m2 0a2 2 0 00-2-2H9a2 2 0 00-2 2m5 8a7 7 0 100-14 7 7 0 000 14z"
                                    />
                                </svg>
                                <span className="text-gray-500 text-sm">Chưa đươc sử dụng</span>
                            </div>
                        )}
                    </div>
                )
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
