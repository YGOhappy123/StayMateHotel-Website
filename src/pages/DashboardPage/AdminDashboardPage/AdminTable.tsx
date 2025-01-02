import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination'
import dayjs from '@/libs/dayjs'

import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

type AdminTableProps = {
    admins: IAdmin[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    toggleActiveMutation: any
}

const AdminTable = ({ admins, total, page, limit, setPage, toggleActiveMutation }: AdminTableProps) => {
    const user = useSelector((state: RootState) => state.auth.user)

    const columns: ColumnDef<IAdmin>[] = [
        {
            accessorKey: 'id',
            header: 'Mã Nhân Viên'
        },
        {
            accessorKey: 'lastName',
            header: 'Họ'
        },
        {
            accessorKey: 'firstName',
            header: 'Tên'
        },
        {
            accessorKey: 'email',
            header: 'Email'
        },
        {
            accessorKey: 'phoneNumber',
            header: 'Số Điện Thoại'
        },
        {
            accessorKey: 'avatar',
            header: 'Ảnh Đại Diện',
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
                            {`${createdBy}`}
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'actions',
            header: () => <div className="text-center">Hành Động</div>,
            cell: ({ row }) => {
                const admin = row.original

                return (
                    <div className="grid grid-cols-1 gap-2 xl:grid-cols-1">
                        <ConfirmationDialog
                            Trigger={
                                <button
                                    disabled={admin.id === user.id}
                                    className="min-w-fit rounded border-2 border-solid border-yellow-600 bg-yellow-100 px-3 py-1.5 text-xs font-medium text-yellow-600 hover:opacity-90 disabled:cursor-not-allowed disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-50"
                                >
                                    {admin.isActive ? 'Khóa' : 'Mở khóa'}
                                </button>
                            }
                            title={admin.isActive ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản'}
                            body={
                                admin.isActive
                                    ? 'Bạn có chắc muốn khóa tài khoản này không? Nhân viên sẽ không thể sử dụng tài khoản này trong khi khóa.'
                                    : 'Bạn có chắc muốn mở khóa tài khoản này không? Nhân viên sẽ có thể sử dụng tài khoản này sau khi mở lại.'
                            }
                            onConfirm={async () => {
                                await toggleActiveMutation.mutateAsync(admin.id)
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
            <DataTable columns={columns} data={admins} />
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

export default AdminTable
