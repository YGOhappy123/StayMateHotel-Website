import { useNavigate } from 'react-router-dom'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { getMappedPaymentMethod } from '@/utils/bookingStatusMapping'
import Button from '@/components/common/Button'
import dayjs from 'dayjs'

type PaymentRecordDialogProps = {
    payments: Partial<IPayment>[]
    closeDialog: () => void
}

const PaymentRecordDialog = ({ payments, closeDialog }: PaymentRecordDialogProps) => {
    const navigate = useNavigate()
    const columns: ColumnDef<Partial<IPayment>>[] = [
        {
            accessorKey: 'id',
            header: 'Mã Giao Dịch'
        },
        {
            accessorKey: 'amount',
            header: () => <div className="text-center">Số Tiền Giao Dịch</div>,
            cell: ({ row }) => {
                const amount = row.original.amount
                return (
                    <div className="flex justify-center">
                        <div className="table-tag-green">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount!)}
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'method',
            header: () => <div className="text-center">Phương Thức Thanh Toán</div>,
            cell: ({ row }) => {
                const method = row.original.method
                return (
                    <div className="flex justify-center">
                        <div className="table-tag-blue">{getMappedPaymentMethod(method!)}</div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'paymentTime',
            header: 'Thời Gian Giao Dịch',
            cell: ({ row }) => {
                const paymentTime = row.original.paymentTime
                return dayjs(paymentTime).format('DD/MM/YYYY HH:mm:ss')
            }
        }
    ]

    return (
        <DialogContent className="max-w-[700px] bg-white">
            <DialogHeader>
                <DialogTitle>Lịch sử thanh toán của đơn đặt phòng</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="border-b-2"></div>
            <div>
                <DataTable
                    columns={columns}
                    data={payments}
                    noDataMessage="Hệ thống chưa ghi nhận bất kì giao dịch nào liên quan đến đơn đặt phòng này."
                />
            </div>
            <div className="border-b-2"></div>
            <DialogFooter>
                <Button text="Đóng" variant="danger" onClick={closeDialog} />
                <Button text="Đến trang quản lý giao dịch" variant="warning" onClick={() => navigate('/dashboard/transactions')} />
            </DialogFooter>
        </DialogContent>
    )
}

export default PaymentRecordDialog
