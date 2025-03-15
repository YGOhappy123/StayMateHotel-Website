import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination'
import { getMappedPaymentMethod } from '@/utils/bookingStatusMapping'
import dayjs from 'dayjs'

// Define the props for the TransactionTable component
type TransactionTableProps = {
    transactions: IPayment[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
}

const TransactionTable = ({ transactions, total, page, limit, setPage }: TransactionTableProps) => {
    const columns: ColumnDef<IPayment>[] = [
        {
            accessorKey: 'id',
            header: 'Mã Giao Dịch'
        },
        {
            accessorKey: 'bookingId',
            header: 'Mã Đơn Đặt Phòng'
        },
        {
            accessorKey: 'amount',
            header: () => <div className="text-center">Số Tiền</div>,
            cell: ({ row }) => {
                const amount = row.original.amount

                return (
                    <div className="flex justify-center">
                        <div className="table-tag-green">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount as number)}
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'method',
            header: 'Hình Thức Thanh Toán',
            cell: ({ row }) => {
                const method = row.original.method
                return getMappedPaymentMethod(method)
            }
        },
        {
            accessorKey: 'paymentTime',
            header: 'Thời Gian',
            cell: ({ row }) => {
                const paymentTime = row.original.paymentTime
                return dayjs(paymentTime).format('DD/MM/YYYY HH:mm:ss')
            }
        }
    ]

    const lastPage = Math.ceil(total / limit)

    return (
        <div className="flex flex-col gap-8">
            <DataTable columns={columns} data={transactions} />
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

export default TransactionTable
