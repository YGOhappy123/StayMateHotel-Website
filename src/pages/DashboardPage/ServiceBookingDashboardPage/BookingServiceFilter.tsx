import { PopoverContent } from '@/components/ui/Popover';
import { useState, useEffect } from 'react';
import { BookingServiceSortAndFilterParams } from '@/services/serviceReservationService';
import { DateRange } from 'react-day-picker';
import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import SelectInput from '@/components/common/SelectInput';
import DateRangePicker from '@/components/common/DateRangePicker';

type BookingServiceFilterProps = {
    services: IService[];
    setHavingFilters: (value: boolean) => void;
    onChange: (params: BookingServiceSortAndFilterParams) => void;
    onSearch: () => void;
    onReset: () => void;
};

const BookingServiceFilter = ({ services, setHavingFilters, onChange, onSearch, onReset }: BookingServiceFilterProps) => {
    const [searchServiceName, setSearchServiceName] = useState<string>('');
    const [selectedService, setSelectedService] = useState<string>('');
    const [searchServiceQuery, setSearchServiceQuery] = useState<string>('');
    const [searchMinPrice, setSearchMinPrice] = useState<string>('');
    const [searchMaxPrice, setSearchMaxPrice] = useState<string>('');
    const [sort, setSort] = useState<string>('-createdAt');
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [status, setStatus] = useState<string>(''); 
    const [searchCustomerName, setSearchCustomerName] = useState<string>(''); 
    const [searchBookingServiceId, setSearchBookingServiceId] = useState<string>('');
    const [searchBookingId, setSearchBookingId] = useState<string>('');

    const fetchServices = () => {
        return services;
    };

    const serviceOptions = fetchServices().map((service) => ({
        value: service.name,
        label: service.name,
    }));

    const statusOptions = [
        { value: 'Pending', label: 'Chờ xử lý' },
        { value: 'Accepted', label: 'Chờ bàn giao' },
        { value: 'Rejected', label: 'Bị từ chối' },
        { value: 'Done', label: 'Đã bàn giao xong' },
    ];

    useEffect(() => {
        const dateRange = date ? [date.from, date.to] : [];
        onChange({
            searchServiceName: selectedService,
            searchServiceQuery,
            searchMinPrice,
            searchMaxPrice,
            sort,
            range: dateRange,
            status, 
            searchCustomerName,
            searchBookingServiceId,
            searchBookingId,
        });
    }, [selectedService, searchServiceQuery, searchMinPrice, searchMaxPrice, sort, date, status, searchCustomerName, searchBookingServiceId, searchBookingId]);

    const handleSearch = () => {
        onSearch();
        const filtersActive =
            (selectedService && selectedService.trim()) ||
            (searchMinPrice && !isNaN(Number(searchMinPrice))) ||
            (searchMaxPrice && !isNaN(Number(searchMaxPrice))) ||
            sort !== '-createdAt' ||
            (date && (date.from || date.to)) ||
            status ||
            searchCustomerName || 
            searchBookingServiceId ||
            searchBookingId;
        setHavingFilters(Boolean(filtersActive));
    };

    const handleReset = () => {
        setSearchServiceName('');
        setSelectedService('');
        setSearchMinPrice('');
        setSearchMaxPrice('');
        setSort('-createdAt');
        setDate(undefined);
        setStatus('');
        setSearchCustomerName(''); 
        setSearchBookingServiceId('');
        setSearchBookingId('');
        setHavingFilters(false);
        onReset();
    };

    return (
        <PopoverContent className="w-[900px] bg-white">
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
                {/* Lọc theo ID */}
                <div>
                    <TextInput
                        fieldName="bookingServiceId"
                        placeholder="Lọc theo ID"
                        value={searchBookingServiceId}
                        error=""
                        onChange={(value: string) => setSearchBookingServiceId(value)}
                        type="number"
                        onFocus={() => { }}
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>

                {/* Lọc theo Mã đơn đặt phòng (bookingId) */}
                <div>
                    <TextInput
                        fieldName="bookingId"
                        placeholder="Lọc theo mã đơn đặt phòng"
                        value={searchBookingId}
                        onChange={(value: string) => setSearchBookingId(value)}
                        type="number"
                        error=""
                        onFocus={() => { }}
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>

                {/* Lọc theo trạng thái */}
                <div>
                    <SelectInput
                        fieldName="status"
                        placeholder="Lọc theo trạng thái"
                        options={statusOptions}
                        value={status}
                        error=""
                        onChange={(value: string | number) => setStatus(value as string)}
                        onFocus={() => { }}
                        labelClassName="bg-white"
                        selectClassName="py-[9px]"
                    />
                </div>

                {/* Lọc theo tên dịch vụ */}
                <div>
                    <SelectInput
                        fieldName="serviceName"
                        placeholder="Lọc theo tên dịch vụ"
                        options={serviceOptions}
                        value={selectedService}
                        error=""
                        onChange={(value: string | number) => setSelectedService(value as string)}
                        onFocus={() => { }}
                        labelClassName="bg-white"
                        selectClassName="py-[9px]"
                    />
                </div>

                {/* Lọc theo tên khách hàng */}
                <div>
                    <TextInput
                        fieldName="customerName"
                        placeholder="Lọc theo tên khách hàng"
                        value={searchCustomerName}
                        onChange={(value: string) => setSearchCustomerName(value)}
                        error=""
                        onFocus={() => { }}
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>

                {/* Lọc theo mức giá */}
                <div className="grid grid-cols-2 gap-2 items-center justify-items-center">
                    <TextInput
                        fieldName="minPrice"
                        placeholder="Mức tổng tiền tối thiểu"
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
                        placeholder="Mức tổng tiền tối đa"
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
                            { value: '-price', label: 'Tổng tiền giảm dần' },
                            { value: '+price', label: 'Tổng tiền tăng dần' },
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

export default BookingServiceFilter;
