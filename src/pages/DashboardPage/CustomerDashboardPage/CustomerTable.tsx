import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination'
import dayjs from '@/libs/dayjs'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'

// Define the props for the CustomerTable component
type CustomerTableProps = {
    customers: IGuest[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    deactivateAccountMutation: any
}

const CustomerTable = ({ customers, total, page, limit, setPage, deactivateAccountMutation }: CustomerTableProps) => {
    const columns: ColumnDef<IGuest>[] = [
        {
            accessorKey: 'id',
            header: 'Mã Khách Hàng'
        },
        {
            accessorKey: 'firstName',
            header: 'Họ'
        },
        {
            accessorKey: 'lastName',
            header: 'Tên'
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
                return dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss')
            }
        },
        {
            accessorKey: 'actions',
            header: () => <div className="text-center">Hành Động</div>,
            cell: ({ row }) => {
                const customer = row.original

                return (
                    <div className="flex justify-center">
                        <ConfirmationDialog
                            Trigger={
                                <button
                                    disabled={!customer.isActive}
                                    className="min-w-fit rounded border-2 border-solid border-red-600 bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:opacity-90 disabled:cursor-not-allowed disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-50"
                                >
                                    Khóa Tài Khoản
                                </button>
                            }
                            title="Xác nhận khóa tài khoản"
                            body="Bạn có chắc muốn khóa tài khoản khách hàng này không? Thao tác này sẽ không thể hoàn tác."
                            onConfirm={async () => {
                                await deactivateAccountMutation.mutateAsync({ targetUserId: customer.id, targetUserRole: 'Guest' })
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
            <DataTable columns={columns} data={customers} />
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

export default CustomerTable
