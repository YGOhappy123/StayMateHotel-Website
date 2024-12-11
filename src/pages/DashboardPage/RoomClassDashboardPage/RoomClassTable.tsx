import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination'
import dayjs from '@/libs/dayjs'
import Button from '@/components/common/Button'
import roomClassService from '@/services/roomClassService'

type RoomClassTableProps = {
    roomClasses: IRoomClass[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    onSelectRoomClass: (roomClass: IRoomClass) => void
}

const RoomClassTable = ({ roomClasses, total, page, limit, setPage, onSelectRoomClass }: RoomClassTableProps) => {
    const { deleteRoomClassMutation } = roomClassService({ enableFetching: false })

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
                const basePrice = row.original.basePrice as IRoomClass['basePrice']

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
                const capacity = row.original.capacity as IRoomClass['capacity']

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
            accessorKey: 'createdAt',
            header: 'Ngày Và Người Tạo',
            enableHiding: true,
            cell: ({ row }) => {
                const createdAt = row.original.createdAt as IRoomClass['createdAt']
                const createdBy = row.original.createdBy as IRoomClass['createdBy']

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
                        <Button
                            text="Xóa loại phòng"
                            variant="danger"
                            className="min-w-fit rounded px-3 py-1.5 text-xs"
                            onClick={() => deleteRoomClassMutation.mutate(roomClass.id)}
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
