import { useNavigate } from 'react-router-dom'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { getMappedBookingServiceStatus } from '@/utils/bookingStatusMapping'
import Button from '@/components/common/Button'
import dayjs from 'dayjs'

type BookingServiceRecordDialogProps = {
    services: Partial<IBookingService>[]
    closeDialog: () => void
}

const BookingServiceRecordDialog = ({ services, closeDialog }: BookingServiceRecordDialogProps) => {
    const navigate = useNavigate()
    const columns: ColumnDef<Partial<IBookingService>>[] = [
        {
            accessorKey: 'id',
            header: 'Mã Đơn'
        },
        {
            accessorKey: 'name',
            header: 'Tên Dịch Vụ'
        },
        {
            accessorKey: 'quantity',
            header: () => <div className="text-center">Số Lượng</div>,
            cell: ({ row }) => {
                const quantity = row.original.quantity
                return <div className="flex justify-center">{quantity?.toString().padStart(2, '0')}</div>
            }
        },
        {
            accessorKey: 'unitPrice',
            header: () => <div className="text-center">Đơn Giá</div>,
            cell: ({ row }) => {
                const unitPrice = row.original.unitPrice
                return (
                    <div className="flex justify-center">
                        <div className="table-tag-green">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(unitPrice!)}
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'status',
            header: () => <div className="text-center">Trạng Thái</div>,
            cell: ({ row }) => {
                const status = row.original.status
                return (
                    <div className="flex justify-center">
                        <div className="table-tag-blue">{getMappedBookingServiceStatus(status!)}</div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'createdAt',
            header: 'Thời Gian Đặt',
            cell: ({ row }) => {
                const createdAt = row.original.createdAt
                return dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss')
            }
        }
    ]

    return (
        <DialogContent className="max-w-[950px] bg-white">
            <DialogHeader>
                <DialogTitle>Lịch sử đặt dịch vụ của đơn đặt phòng</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="border-b-2"></div>
            <div className="max-h-[400px] overflow-y-auto">
                <DataTable
                    columns={columns}
                    data={services}
                    noDataMessage="Hệ thống chưa ghi nhận bất kì đơn đặt dịch vụ nào liên quan đến đơn đặt phòng này."
                />
            </div>
            <div className="border-b-2"></div>
            <DialogFooter>
                <Button text="Đóng" variant="danger" onClick={closeDialog} />
                <Button text="Đến trang đơn đặt dịch vụ" variant="warning" onClick={() => navigate('/dashboard/service-bookings')} />
            </DialogFooter>
        </DialogContent>
    )
}

export default BookingServiceRecordDialog
