import { useEffect, useState } from 'react';
import { PopoverContent } from '@/components/ui/Popover';
import { CustomerSortAndFilterParams } from '@/services/customerService';
import { DateRange } from 'react-day-picker';

import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import SelectInput from '@/components/common/SelectInput';
import DateRangePicker from '@/components/common/DateRangePicker';

type CustomerFilterProps = {
    setHavingFilters: (value: boolean) => void;
    onChange: (params: CustomerSortAndFilterParams) => void;
    onSearch: () => void;
    onReset: () => void;
};

const CustomerFilter = ({ setHavingFilters, onChange, onSearch, onReset }: CustomerFilterProps) => {
    const [searchName, setSearchName] = useState<string>('');
    const [filters, setFilters] = useState<{ [key: string]: any }>({});
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<string>('-createdAt');

    useEffect(() => {
        const appliedFilters: CustomerSortAndFilterParams = {
            sort: sortOrder,
            searchName: searchName || "", // Gán chuỗi rỗng nếu searchName là undefined
            searchEmail: filters.email || undefined,
            searchPhoneNumber: filters.phoneNumber || undefined,
            startTime: dateRange?.from ? dateRange.from.toISOString() : "", // Gán chuỗi rỗng nếu không có giá trị
            endTime: dateRange?.to ? dateRange.to.toISOString() : "", // Gán chuỗi rỗng nếu không có giá trị
        };
    
        onChange(appliedFilters);
    }, [filters, sortOrder, dateRange, searchName]);
    
    

    const handleFilterChange = (key: string, value: string | number) => {
        setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
    };

    const handleSearch = () => {
        onSearch();
        const hasFilters = Object.keys(filters).length > 0 || !!dateRange?.from || sortOrder !== '-createdAt';
        setHavingFilters(hasFilters);  // Xác định xem có bộ lọc nào được áp dụng không
    };

    const handleReset = () => {
        setFilters({});
        setSearchName('');
        setSortOrder('-createdAt');
        setDateRange(undefined);
        setHavingFilters(false);
        onReset();
    };

    return (
        <PopoverContent className="w-[400px] bg-white">
            <div className="mb-4 flex items-center justify-between">
                <Button
                    text="Tìm kiếm"
                    variant="gradient"
                    className="rounded-2xl border-primary px-3 py-1.5 text-xs"
                    onClick={handleSearch}
                />
                <Button
                    text="Đặt lại"
                    variant="danger"
                    className="rounded-2xl px-3 py-1.5 text-xs"
                    onClick={handleReset}
                />
            </div>
            <form>
                <div className="mb-4">
                    <TextInput
                        fieldName="name"
                        placeholder="Lọc theo tên khách hàng"
                        error=""
                        value={searchName}
                        onChange={(value: string) => setSearchName(value)}
                        onFocus={() => {}}  // Thêm onFocus mặc định
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>    
                <div className="mb-4">
                    <TextInput
                        fieldName="email"
                        placeholder="Lọc theo email"
                        value={filters.email || ''}
                        onChange={(value: string) => handleFilterChange('email', value)}
                        onFocus={() => {} }
                        error=""
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>
                <div className="mb-4">
                    <TextInput
                        fieldName="phoneNumber"
                        placeholder="Lọc theo số điện thoại"
                        value={filters.phoneNumber || ''}
                        onChange={(value: string) => handleFilterChange('phoneNumber', value)}
                        onFocus={() => {} }
                        error=""
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>
                <div className="mb-4">
                    <DateRangePicker
                        date={dateRange}
                        setDate={setDateRange}
                        triggerClassName="leading-normal"
                    />
                </div>
                <div>
                    <SelectInput
                        fieldName="sort"
                        placeholder="Sắp xếp theo"
                        options={[
                            { value: '-createdAt', label: 'Ngày tạo giảm dần' },
                            { value: '+createdAt', label: 'Ngày tạo tăng dần' },
                        ]}
                        value={sortOrder}
                        onChange={(value) => setSortOrder(value as string)}
                        onFocus={() => {} }
                        error=""
                        labelClassName="bg-white"
                        selectClassName="py-[9px]"
                    />
                </div>
            </form>
        </PopoverContent>
    );
};

export default CustomerFilter;
