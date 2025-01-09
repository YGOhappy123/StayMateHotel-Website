import { useState } from 'react';
import { Popover, PopoverTrigger } from '@/components/ui/Popover';
import Button from '@/components/common/Button';
import dayjs from 'dayjs';

import { exportToCSV } from '@/utils/exportCsvFile';
import TransactionTable from '@/pages/DashboardPage/TransactionDashboardPage/TransactionTable';
import transactionService from '@/services/transactionService';
import TransactionFilter from '@/pages/DashboardPage/TransactionDashboardPage/TransactionFilter';

const TransactionDashboardPage = () => {
    const {
        transactions,
        total,
        page,
        limit,
        setPage,
        buildQuery,
        onFilterSearch,
        onResetFilterSearch,
        getCsvTransactionsQuery
    } = transactionService({ enableFetching: true });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [havingFilters, setHavingFilters] = useState(false);

    const exportCsvFile = () => {
        getCsvTransactionsQuery.refetch().then(res => {
            const csvTransactions = res.data?.data?.data ?? [];

            const formattedTransactions = csvTransactions.map(transaction => ({
                ['Mã Giao dịch']: transaction.id,
                ['Mã Đơn đặt phòng']: transaction.bookingId,
                ['Số Tiền']: transaction.amount,
                ['Hình Thức Thanh Toán']: transaction.method,
                ['Thời Gian']: dayjs(transaction.paymentTime).format('DD/MM/YYYY HH:mm:ss'),
            }));

            exportToCSV(
                formattedTransactions,
                `SMH_Danh_sách_giao_dịch_${dayjs(Date.now()).format('DD/MM/YYYY')}`,
                [
                    { wch: 15 },
                    { wch: 20 },
                    { wch: 15 },
                    { wch: 25 },
                    { wch: 30 }
                ]
            );
        });
    };

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
                        <TransactionFilter
                            setHavingFilters={setHavingFilters}
                            onChange={buildQuery}
                            onSearch={onFilterSearch}
                            onReset={onResetFilterSearch}
                        />
                    </Popover>

                    <Button text="Xuất CSV" variant="primary" onClick={exportCsvFile} />
                </div>
            </div>

            <TransactionTable
                transactions={transactions}
                total={total}
                page={page}
                limit={limit}
                setPage={setPage}
            />
        </div>
    );
};

export default TransactionDashboardPage;
