import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { getMappedStatus } from '@/utils/roomStatusMapping'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination'
import dayjs from '@/libs/dayjs'
import Button from '@/components/common/Button'
import roomService from '@/services/roomService'

type RoomTableProps = {
    rooms: IRoom[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    onSelectRoom: (room: IRoom) => void
}

const RoomTable = ({ rooms, total, page, limit, setPage, onSelectRoom }: RoomTableProps) => {
    const { deleteRoomMutation, toggleMaintenanceMutation, markCleaningDoneMutation } = roomService({ enableFetching: false })

    const columns: ColumnDef<IRoom>[] = [
        {
            accessorKey: 'id',
            header: 'Mã Phòng'
        },
        {
            accessorKey: 'roomNumber',
            header: 'Số Phòng'
        },
        {
            accessorKey: 'floor',
            header: 'Tầng',
            cell: ({ row }) => {
                const floor = row.original.floor as IRoom['floor']
                return <div>{floor?.floorNumber}</div>
            }
        },
        {
            accessorKey: 'roomClass',
            header: () => <div className="text-center">Loại Phòng</div>,
            cell: ({ row }) => {
                const roomClass = row.original.roomClass as IRoom['roomClass']
                return (
                    <div className="flex justify-center">
                        <div className="table-tag-blue">{roomClass?.className}</div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'basePrice',
            header: () => <div className="text-center">Giá Phòng Theo Ngày</div>,
            cell: ({ row }) => {
                const roomClass = row.original.roomClass as IRoom['roomClass']

                return (
                    <div className="flex justify-center">
                        <div className="table-tag-green">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(roomClass?.basePrice as number)}
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'status',
            header: () => <div className="text-center">Trạng Thái Phòng</div>,
            cell: ({ row }) => {
                const status = row.original.status as IRoom['status']

                return (
                    <div className="flex justify-center">
                        <div className="table-tag-pink">{getMappedStatus(status)}</div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'createdAt',
            header: 'Ngày Và Người Tạo',
            enableHiding: true,
            cell: ({ row }) => {
                const createdAt = row.original.createdAt as IRoom['createdAt']
                const createdBy = row.original.createdBy as IRoom['createdBy']

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
                const room = row.original

                return (
                    <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                        <Button
                            text="Cập nhật"
                            variant="success"
                            className="min-w-fit rounded px-3 py-1.5 text-xs"
                            disabled={room.status === 'Occupied' || room.status === 'Reserved'}
                            onClick={() => onSelectRoom(room)}
                        />
                        <Button
                            text="Dọn dẹp"
                            variant="info"
                            className="min-w-fit rounded px-3 py-1.5 text-xs"
                            disabled={room.status !== 'UnderCleaning'}
                            onClick={() => markCleaningDoneMutation.mutate(room.id)}
                        />
                        <Button
                            text={room.status === 'OutOfService' ? 'Mở phòng' : 'Bảo trì'}
                            variant="warning"
                            className="min-w-fit rounded px-3 py-1.5 text-xs"
                            disabled={room.status === 'Occupied' || room.status === 'Reserved'}
                            onClick={() => toggleMaintenanceMutation.mutate(room.id)}
                        />
                        <Button
                            text="Xóa phòng"
                            variant="danger"
                            className="min-w-fit rounded px-3 py-1.5 text-xs"
                            onClick={() => deleteRoomMutation.mutate(room.id)}
                        />
                    </div>
                )
            }
        }
    ]

    const lastPage = Math.ceil(total / limit)

    return (
        <div className="flex flex-col gap-8">
            <DataTable columns={columns} data={rooms} />
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

export default RoomTable
