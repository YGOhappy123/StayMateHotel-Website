import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import dayjs from 'dayjs'

type MostBookedRoomTableProps = {
    rooms: IRoom[]
}

const MostBookedRoomTable = ({ rooms }: MostBookedRoomTableProps) => {
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
            accessorKey: 'createdAt',
            header: 'Ngày Tạo',
            cell: ({ row }) => {
                const createdAt = row.original.createdAt

                return (
                    <div>
                        <div>{dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss')}</div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'bookingCount',
            header: () => <div className="text-center">Số Lượt Thuê</div>,
            cell: ({ row }) => {
                const bookingCount = row.original.bookingCount

                return (
                    <div className="flex justify-center">
                        <div className="table-tag-pink border-3 font-bold">{bookingCount?.toString().padStart(2, '0')} lượt</div>
                    </div>
                )
            }
        }
    ]

    return (
        <div className="flex w-full flex-col items-center gap-4">
            <h2 className="text-3xl font-semibold text-accent">Top 5 phòng được thuê nhiều nhất</h2>
            <div className="w-full">
                <DataTable columns={columns} data={rooms} />
            </div>
        </div>
    )
}

export default MostBookedRoomTable
