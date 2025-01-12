import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import dayjs from 'dayjs'

type HighestTotalPaymentGuestTableProps = {
    guests: IGuest[]
}

const HighestTotalPaymentGuestTable = ({ guests }: HighestTotalPaymentGuestTableProps) => {
    const columns: ColumnDef<IGuest>[] = [
        {
            accessorKey: 'id',
            header: 'Mã Khách Hàng'
        },
        {
            accessorKey: 'name',
            header: 'Họ Và Tên',
            cell: ({ row }) => {
                const firstName = row.original.firstName
                const lastName = row.original.lastName
                return (
                    <span>
                        {lastName} {firstName}
                    </span>
                )
            }
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => {
                const email = row.original.email
                return <span>{email || <i>(Chưa cập nhật)</i>}</span>
            }
        },
        {
            accessorKey: 'phoneNumber',
            header: 'Số Điện Thoại',
            cell: ({ row }) => {
                const phoneNumber = row.original.phoneNumber
                return <span>{phoneNumber || <i>(Chưa cập nhật)</i>}</span>
            }
        },
        {
            accessorKey: 'avatar',
            header: () => <div className="text-center">Ảnh Đại Diện</div>,
            cell: ({ row }) => {
                const avatar = row.original.avatar

                return (
                    <div className="flex justify-center">
                        <img src={avatar} alt="Avatar" className="h-10 w-10 rounded-full" />
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
            accessorKey: 'totalPayment',
            header: () => <div className="text-center">Số Tiền Giao Dịch</div>,
            cell: ({ row }) => {
                const totalPayment = row.original.totalPayment
                return (
                    <div className="flex justify-center">
                        <div className="table-tag-green border-3 font-bold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPayment as number)}
                        </div>
                    </div>
                )
            }
        }
    ]

    return (
        <div className="flex w-full flex-col items-center gap-4">
            <h2 className="text-3xl font-semibold text-accent">Top 5 khách hàng có giá trị giao dịch cao nhất</h2>
            <div className="w-full">
                <DataTable columns={columns} data={guests} />
            </div>
        </div>
    )
}

export default HighestTotalPaymentGuestTable
