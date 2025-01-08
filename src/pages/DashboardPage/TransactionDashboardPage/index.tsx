import { useState } from 'react'
import { Popover, PopoverTrigger } from '@/components/ui/Popover'
import Button from '@/components/common/Button'

const TransactionDashboardPage = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [havingFilters, setHavingFilters] = useState(false)

    const exportCsvFile = () => {}

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between p-4">
                <h2 className="text-2xl font-bold">Quản lý giao dịch</h2>
                <div className="flex justify-center gap-4">
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <div className="relative min-w-[120px] cursor-pointer rounded-md border-2 border-solid border-black bg-black/10 px-6 py-3 font-medium text-black hover:opacity-90">
                                Tìm kiếm
                                {havingFilters && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600"></div>}
                            </div>
                        </PopoverTrigger>
                        {/* <BookingFilter
                                ...
                        /> */}
                    </Popover>

                    <Button text="Xuất CSV" variant="primary" onClick={exportCsvFile} />
                </div>
            </div>
        </div>
    )
}

export default TransactionDashboardPage
