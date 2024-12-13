import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination'
import dayjs from '@/libs/dayjs'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import Button from '@/components/common/Button'
import roomClassService from '@/services/roomClassService'
import fileService from '@/services/fileService'

type RoomClassTableProps = {
    roomClasses: IRoomClass[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    onSelectRoomClass: (roomClass: IRoomClass) => void
    deleteRoomClassMutation: any
}

const RoomClassTable = ({ roomClasses, total, page, limit, setPage, onSelectRoomClass, deleteRoomClassMutation }: RoomClassTableProps) => {
   

    const columns: ColumnDef<IRoomClass>[] = [
        {
            accessorKey: 'id',
            header: 'Mã Loại Phòng'
        },
        {
            accessorKey: 'className',
            header: 'Tên Loại Phòng '
        },
        {
            accessorKey: 'basePrice',
            header: () => <div className="text-center">Giá Loại Phòng Theo Ngày</div>,
            cell: ({ row }) => {
                const basePrice = row.original.basePrice

                return (
                    <div className="flex justify-center">
                        <div className="table-tag-green">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(basePrice as number)}
                        </div>
                    </div>
                )
            }
        },

        {
            accessorKey: 'capacity',
            header: () => <div className="text-center">Số Lượng Người</div>,
            cell: ({ row }) => {
                const capacity = row.original.capacity

                return (
                    <div className="flex justify-center">
                        <div className="table-tag-green">
                            {capacity} Người
                        </div>
                    </div>
                )
            }
        },

        {
            accessorKey: 'features',
            header: () => <div className="text-center">Tiện ích</div>,
            cell: ({ row }) => {
                const features = row.original.features;
            
                return (
                    <div className="flex flex-col items-start space-y-2">
                        {features?.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
                                    {feature.quantity}x
                                </span>
                                <span className="text-gray-700 font-medium">
                                    {feature.name}
                                </span>
                            </div>
                        ))}
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
                const roomClass = row.original

                return (
                    <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                        <Button
                            text="Cập nhật"
                            variant="success"
                            className="min-w-fit rounded px-3 py-1.5 text-xs"
                            onClick={() => onSelectRoomClass(roomClass)}
                            />
                            <ConfirmationDialog
                                Trigger={
                                    <button className="min-w-fit rounded border-2 border-solid border-red-600 bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:opacity-90 disabled:cursor-not-allowed disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-50">
                                        Xóa loại phòng
                                    </button>
                                }
                                title="Xác nhận xóa loại phòng"
                                body="Bạn có chắc muốn xóa loại phòng này không? Thao tác này sẽ không thể hoàn tác."
                                onConfirm={async () => {
                                    await deleteRoomClassMutation.mutateAsync(roomClass.id)
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
            <DataTable columns={columns} data={roomClasses} />
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

export default RoomClassTable
