import { useEffect, useState } from 'react';
import { PopoverContent } from '@/components/ui/Popover';
import { ServiceSortAndFilterParams } from '@/services/serviceService';
import { DateRange } from 'react-day-picker';

import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import SelectInput from '@/components/common/SelectInput';
import DateRangePicker from '@/components/common/DateRangePicker';

type ServiceFilterProps = {
    setHavingFilters: (value: boolean) => void;
    onChange: (params: ServiceSortAndFilterParams) => void;
    onSearch: () => void;
    onReset: () => void;
};

const ServiceFilter = ({ setHavingFilters, onChange, onSearch, onReset }: ServiceFilterProps) => {
    const [searchServiceName, setSearchServiceName] = useState<string>('');
    const [searchServiceQuery, setSearchServiceQuery] = useState<string>('');
    const [searchMinPrice, setSearchMinPrice] = useState<string>('');
    const [searchMaxPrice, setSearchMaxPrice] = useState<string>('');
    const [sort, setSort] = useState<string>('-createdAt');
    const [date, setDate] = useState<DateRange | undefined>(undefined);

    useEffect(() => {
        const dateRange = date ? [date.from, date.to] : [];
        onChange({
            searchServiceName,
            searchServiceQuery,
            searchMinPrice,
            searchMaxPrice,
            sort,
            range: dateRange,  
        });
    }, [searchServiceName, searchServiceQuery, searchMinPrice, searchMaxPrice, sort, date, onChange]);

    
    const handleSearch = () => {
        onSearch();

        const filtersActive =
            (searchServiceName && searchServiceName.trim()) ||    
            (searchMinPrice && !isNaN(Number(searchMinPrice))) || 
            (searchMaxPrice && !isNaN(Number(searchMaxPrice))) || 
            sort !== '-createdAt' ||                               
            (date && (date.from || date.to));                      

        setHavingFilters(Boolean(filtersActive));
    };

    const handleReset = () => {
        setSearchServiceName('');
        setSearchMinPrice('');
        setSearchMaxPrice('');
        setSort('-createdAt');
        setDate(undefined);
        setHavingFilters(false);
        onReset();
    };

    return (
        <PopoverContent className="w-[800px] bg-white">
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

            <div className="grid grid-cols-2 gap-4">
                {/* Lọc theo tên dịch vụ */}
                <div>
                    <TextInput
                        fieldName="serviceName"
                        placeholder="Lọc theo tên dịch vụ"
                        value={searchServiceName}
                        error=""
                        onChange={(value: string) => setSearchServiceName(value)}
                        onFocus={() => { }}
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>

                {/* Lọc theo mức giá */}
                <div className="grid grid-cols-2 gap-2">
                    <TextInput
                        fieldName="minPrice"
                        placeholder="Mức giá tối thiểu"
                        value={searchMinPrice}
                        error=""
                        onChange={(value: string) => setSearchMinPrice(value)}
                        type="number"
                        onFocus={() => { }}
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                    <TextInput
                        fieldName="maxPrice"
                        placeholder="Mức giá tối đa"
                        value={searchMaxPrice}
                        onChange={(value: string) => setSearchMaxPrice(value)}
                        error=""
                        type="number"
                        onFocus={() => { }}
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>

                {/* Lọc theo ngày */}
                <div className="mb-4">
                    <DateRangePicker date={date} setDate={setDate} triggerClassName="leading-normal" />
                </div>

                {/* Sắp xếp */}
                <div>
                    <SelectInput
                        fieldName="sort"
                        placeholder="Sắp xếp theo"
                        options={[
                            { value: '-createdAt', label: 'Ngày tạo giảm dần' },
                            { value: '+createdAt', label: 'Ngày tạo tăng dần' },
                            { value: '-price', label: 'Giá giảm dần' },
                            { value: '+price', label: 'Giá tăng dần' }
                        ]}
                        value={sort}
                        error=""
                        onChange={(value: string | number) => setSort(value as string)}
                        onFocus={() => { }}
                        labelClassName="bg-white"
                        selectClassName="py-[9px]"
                    />
                </div>
            </div>
        </PopoverContent>
    );
};

export default ServiceFilter;
