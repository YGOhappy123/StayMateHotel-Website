import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { getMappedStatus } from '@/utils/roomStatusMapping'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination'
import dayjs from '@/libs/dayjs'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import Button from '@/components/common/Button'
import fileService from '@/services/fileService'

type RoomTableProps = {
    rooms: IRoom[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    onSelectRoom: (room: IRoom) => void
    deleteRoomMutation: any
    toggleMaintenanceMutation: any
    markCleaningDoneMutation: any
}

const RoomTable = ({
    rooms,
    total,
    page,
    limit,
    setPage,
    onSelectRoom,
    deleteRoomMutation,
    toggleMaintenanceMutation,
    markCleaningDoneMutation
}: RoomTableProps) => {
    const { deleteMutation } = fileService()

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
                const floor = row.original.floor
                return <div>{floor?.floorNumber}</div>
            }
        },
        {
            accessorKey: 'roomClass',
            header: () => <div className="text-center">Loại Phòng</div>,
            cell: ({ row }) => {
                const roomClass = row.original.roomClass
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
                const roomClass = row.original.roomClass

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
                const status = row.original.status

                return (
                    <div className="flex justify-center">
                        <div className="table-tag-pink">{getMappedStatus(status)}</div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'images',
            header: () => <div className="text-center">Hình Ảnh</div>,
            cell: ({ row }) => {
                const images = row.original.images
                return <div className="flex justify-center">{(images?.length ?? 0).toString().padStart(2, '0')}</div>
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
                const room = row.original

                return (
                    <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                        <Button
                            text="Cập nhật"
                            variant="success"
                            className="min-w-fit rounded px-3 py-1.5 text-xs"
                            disabled={room.status === 'Occupied'}
                            onClick={() => onSelectRoom(room)}
                        />
                        <Button
                            text="Dọn dẹp"
                            variant="info"
                            className="min-w-fit rounded px-3 py-1.5 text-xs"
                            disabled={room.status !== 'UnderCleaning'}
                            onClick={async () => {
                                await markCleaningDoneMutation.mutateAsync(room.id)
                            }}
                        />
                        <ConfirmationDialog
                            Trigger={
                                <button
                                    disabled={room.status === 'Occupied'}
                                    className="min-w-fit rounded border-2 border-solid border-yellow-600 bg-yellow-100 px-3 py-1.5 text-xs font-medium text-yellow-600 hover:opacity-90 disabled:cursor-not-allowed disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-50"
                                >
                                    {room.status === 'OutOfService' ? 'Mở phòng' : 'Bảo trì'}
                                </button>
                            }
                            title={room.status === 'OutOfService' ? 'Xác nhận mở lại phòng' : 'Xác nhận bảo trì phòng'}
                            body={
                                room.status === 'OutOfService'
                                    ? 'Bạn có chắc muốn mở lại phòng này không? Khách hàng sẽ có thể đặt phòng này sau khi mở lại.'
                                    : 'Bạn có chắc muốn bảo trì phòng này không? Khách hàng sẽ không thể đặt phòng này trong khi bảo trì.'
                            }
                            onConfirm={async () => {
                                await toggleMaintenanceMutation.mutateAsync(room.id)
                            }}
                        />
                        <ConfirmationDialog
                            Trigger={
                                <button className="min-w-fit rounded border-2 border-solid border-red-600 bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:opacity-90 disabled:cursor-not-allowed disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-50">
                                    Xóa phòng
                                </button>
                            }
                            title="Xác nhận xóa phòng"
                            body="Bạn có chắc muốn xóa phòng này không? Thao tác này sẽ không thể hoàn tác."
                            onConfirm={async () => {
                                await deleteRoomMutation.mutateAsync(room.id)
                                await Promise.all((room.images ?? []).map(async img => await deleteMutation.mutateAsync(img)))
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
