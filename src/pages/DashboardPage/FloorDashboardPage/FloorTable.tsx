import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/DataTable'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination'
import dayjs from '@/libs/dayjs'
import Button from '@/components/common/Button'
import floorService from '@/services/floorService'

type FloorTableProps = {
    floors: IFloor[]
    total: number
    page: number
    limit: number
    setPage: (page: number) => void
    onSelectFloor: (floor: IFloor) => void
}

const FloorTable = ({ floors, total, page, limit, setPage, onSelectFloor }: FloorTableProps) => {
    const { deleteFloorMutation } = floorService({ enableFetching: false })

    const columns: ColumnDef<IFloor>[] = [
        {
            accessorKey: 'id',
            header: 'Mã Tầng'
        },
        {
            accessorKey: 'floorNumber',
            header: 'Số Tầng'
        },
        {
            accessorKey: 'createdAt',
            header: 'Ngày Và Người Tạo',
            enableHiding: true,
            cell: ({ row }) => {
                const createdAt = row.original.createdAt as IFloor['createdAt']
                const createdBy = row.original.createdBy as IFloor['createdBy']

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
                const floor = row.original

                return (
                    <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                        <Button
                            text="Cập nhật"
                            variant="success"
                            className="min-w-fit rounded px-3 py-1.5 text-xs"
                            onClick={() => onSelectFloor(floor)}
                        />
                        <Button
                            text="Xóa tầng"
                            variant="danger"
                            className="min-w-fit rounded px-3 py-1.5 text-xs"
                            onClick={() => deleteFloorMutation.mutate(floor.id)}
                        />
                    </div>
                )
            }
        }
    ]

    const lastPage = Math.ceil(total / limit)

    return (
        <div className="flex flex-col gap-8">
            <DataTable columns={columns} data={floors} />
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

export default FloorTable
