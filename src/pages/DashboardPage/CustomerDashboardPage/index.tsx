import { useState } from 'react';
import { Popover, PopoverTrigger } from '@/components/ui/Popover';
import dayjs from 'dayjs';

import { exportToCSV } from '@/utils/exportCsvFile';
import Button from '@/components/common/Button';
import CustomerTable from '@/pages/DashboardPage/CustomerDashboardPage/CustomerTable';
import customerService from '@/services/customerService';
import CustomerFilter from '@/pages/DashboardPage/CustomerDashboardPage/CustomerFilter';

const CustomerDashboardPage = () => {
    const {
        customers,
        total,
        page,
        limit,
        setPage,
        buildQuery,
        onFilterSearch,
        onResetFilterSearch,
        getCsvCustomersQuery,
        deactivateAccountMutation
    } = customerService({ enableFetching: true });
    const [havingFilters, setHavingFilters] = useState(false);

    const exportCsvFile = () => {
        getCsvCustomersQuery.refetch().then(res => {
            const csvCustomers = res.data?.data?.data ?? []

            const formattedCustomers = csvCustomers.map(customer => ({
                ['Mã Khách hàng']: customer.id,
                ['Họ']: customer.firstName,
                ['Tên']: customer.lastName,
                ['Ngày tạo']: dayjs(customer.createdAt).format('DD/MM/YYYY HH:mm:ss'),
            }));

            exportToCSV(formattedCustomers, `SMH_Danh_sách_khách_hàng_${dayjs(Date.now()).format('DD/MM/YYYY')}`, [
                { wch: 10 },
                { wch: 20 },
                { wch: 30 },
                { wch: 30 }
            ]);
        });
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between p-4">
                <h2 className="text-2xl font-bold">Quản lý khách hàng</h2>
                <div className="flex justify-center gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="relative min-w-[120px] cursor-pointer rounded-md border-2 border-solid border-black bg-black/10 px-6 py-3 font-medium text-black hover:opacity-90">
                                Tìm kiếm
                                {havingFilters && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600"></div>}
                            </div>
                        </PopoverTrigger>
                        <CustomerFilter
                            setHavingFilters={setHavingFilters}
                            onChange={buildQuery}
                            onSearch={onFilterSearch}
                            onReset={onResetFilterSearch}
                        />
                    </Popover>

                    <Button text="Xuất CSV" variant="primary" onClick={exportCsvFile} />
                </div>
            </div>

            <CustomerTable
                customers={customers}
                total={total}
                page={page}
                limit={limit}
                setPage={setPage}
                deactivateAccountMutation={deactivateAccountMutation}
            />
        </div>
    );
};

export default CustomerDashboardPage;
