import { useEffect, useState } from 'react';
import { PopoverContent } from '@/components/ui/Popover';
import { ServiceSortAndFilterParams } from '@/services/serviceService';  // Assuming you have a service for services

import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import SelectInput from '@/components/common/SelectInput';
import DateRangePicker from '@/components/common/DateRangePicker';
import { DateRange } from 'react-day-picker'

type ServiceFilterProps = {
    //roomClasses: IRoomClass[];
    //serviceCategories: IServiceCategory[]; // Assuming service categories are provided
    setHavingFilters: (value: boolean) => void;
    onChange: (params: ServiceSortAndFilterParams) => void;
    onSearch: () => void;
    onReset: () => void;
};

const ServiceFilter = ({ serviceCategories, setHavingFilters, onChange, onSearch, onReset }: ServiceFilterProps) => {
    const [searchServiceName, setSearchServiceName] = useState<string>('');
    const [searchPriceQuery, setSearchPriceQuery] = useState<string>('');
    const [searchAvailabilityQuery, setSearchAvailabilityQuery] = useState<string>('');
    const [searchServiceCategories, setSearchServiceCategories] = useState<number[]>([]); // Service Categories Filter
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [sort, setSort] = useState<string>('-createdAt');

    const [searchPrice, setSearchPrice] = useState<string>(''); // Price filter
    const [priceSort, setPriceSort] = useState<string>('$lte'); // Sort for price
    const [searchAvailability, setSearchAvailability] = useState<string>(''); // Availability filter
    const [availabilitySort, setAvailabilitySort] = useState<string>('$lte'); // Sort for availability

    // Update search query for price when searchPrice changes
    useEffect(() => {
        if (searchPrice) {
            const query = { [priceSort]: searchPrice };
            setSearchPriceQuery(JSON.stringify(query));
        } else {
            setSearchPriceQuery('');
        }
    }, [searchPrice, priceSort]);

    // Update search query for availability when searchAvailability changes
    useEffect(() => {
        if (searchAvailability) {
            const query = { [availabilitySort]: searchAvailability };
            setSearchAvailabilityQuery(JSON.stringify(query));
        } else {
            setSearchAvailabilityQuery('');
        }
    }, [searchAvailability, availabilitySort]);

    // Update filter parameters when state changes
    useEffect(() => {
        onChange({ searchServiceName, searchPriceQuery, searchAvailabilityQuery, searchServiceCategories, sort, date });
    }, [searchServiceName, searchPriceQuery, searchAvailabilityQuery, searchServiceCategories, sort, date]);

    // Trigger the search action
    const handleSearch = () => {
        onSearch();
        if (!searchServiceName && !searchPriceQuery && !searchAvailabilityQuery && sort === '-createdAt' && !date?.length && !searchServiceCategories.length) {
            setHavingFilters(false);
        } else {
            setHavingFilters(true);
        }
    };

    // Reset all filters
    const handleReset = () => {
        setSearchServiceName('');
        setSearchPriceQuery('');
        setSearchAvailabilityQuery('');
        setSearchServiceCategories([]);
        setSort('-createdAt');
        setDate(undefined);
        setHavingFilters(false);
        onReset();
    };

    useEffect(() => console.log(searchServiceCategories), [searchServiceCategories]);

    return (
        <PopoverContent className="w-[800px] bg-white">
            <div className="mb-4 flex items-center justify-between">
                <Button text="Tìm kiếm" variant="gradient" className="rounded-2xl border-primary px-3 py-1.5 text-xs" onClick={handleSearch} />
                <Button text="Đặt lại" variant="danger" className="rounded-2xl px-3 py-1.5 text-xs" onClick={handleReset} />
            </div>

            <div className="grid grid-cols-2 gap-4">

                {/* Filter by service categories */}
                <div className="relative rounded border-2 border-primary py-2 pl-3 pr-1">
                    <h3 className="absolute -left-2 -top-0.5 -translate-y-1/2 scale-[0.8] bg-white px-1 font-medium text-primary">
                        Lọc theo loại dịch vụ
                    </h3>
                    <div className="mt-2 flex max-h-[256px] flex-col gap-2 overflow-y-auto pr-2">
                        {serviceCategories.map(serviceCategory => (
                            <div key={serviceCategory.id} className="flex items-center gap-3">
                                <p className="flex-1 truncate">{serviceCategory.name}</p>
                                <input
                                    type="checkbox"
                                    className="scale-150"
                                    checked={searchServiceCategories.includes(serviceCategory.id)}  // Filter by service category id
                                    onChange={e => {
                                        setSearchServiceCategories(prev => {
                                            if (e.target.checked) {
                                                return [...prev, serviceCategory.id].sort(); // Add category if checked
                                            } else {
                                                return prev.filter(sc => sc !== serviceCategory.id); // Remove category if unchecked
                                            }
                                        });
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters for service name, price, availability, etc. */}
                <form>
                    <div className="mb-4">
                        <TextInput
                            fieldName="serviceName"
                            placeholder="Lọc theo tên dịch vụ"
                            error=""
                            value={searchServiceName}
                            onChange={(value: string) => setSearchServiceName(value)}
                            labelClassName="bg-white"
                            inputClassName="leading-2"
                        />
                    </div>

                    <div className="mb-4 flex gap-2">
                        <TextInput
                            fieldName="price"
                            placeholder="Lọc theo giá"
                            error=""
                            value={searchPrice}
                            onChange={(value: string) => setSearchPrice(Number.parseInt(value) >= 0 ? value : '')}
                            type="number"
                            wrapperClassName="flex-1"
                            labelClassName="bg-white"
                            inputClassName="leading-2"
                        />
                        <SelectInput
                            fieldName="priceSort"
                            placeholder="Chọn mốc giá"
                            options={[
                                { value: '$lte', label: 'Nhỏ hơn hoặc bằng' },
                                { value: '$gte', label: 'Lớn hơn hoặc bằng' }
                            ]}
                            value={priceSort}
                            onChange={(value: string | number) => setPriceSort(value as string)}
                            labelClassName="bg-white"
                            selectClassName="py-[9px]"
                        />
                    </div>

                    <div className="mb-4 flex gap-2">
                        <TextInput
                            fieldName="availability"
                            placeholder="Lọc theo tình trạng"
                            error=""
                            value={searchAvailability}
                            onChange={(value: string) => setSearchAvailability(Number.parseInt(value) >= 0 ? value : '')}
                            type="number"
                            wrapperClassName="flex-1"
                            labelClassName="bg-white"
                            inputClassName="leading-2"
                        />
                        <SelectInput
                            fieldName="availabilitySort"
                            placeholder="Chọn mốc tình trạng"
                            options={[
                                { value: '$lte', label: 'Nhỏ hơn hoặc bằng' },
                                { value: '$gte', label: 'Lớn hơn hoặc bằng' }
                            ]}
                            value={availabilitySort}
                            onChange={(value: string | number) => setAvailabilitySort(value as string)}
                            labelClassName="bg-white"
                            selectClassName="py-[9px]"
                        />
                    </div>

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
                            onChange={(value: string | number) => setSort(value as string)}
                            labelClassName="bg-white"
                            selectClassName="py-[9px]"
                        />
                    </div>
                </form>
            </div>
        </PopoverContent>
    );
};

export default ServiceFilter;
