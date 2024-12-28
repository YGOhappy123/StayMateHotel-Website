import { useEffect, useState } from 'react';
import { PopoverContent } from '@/components/ui/Popover';
import { FeatureSortAndFilterParams } from '@/services/featureService';  // giả sử bạn có service cho features

import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import SelectInput from '@/components/common/SelectInput';
import DateRangePicker from '@/components/common/DateRangePicker';import { DateRange } from 'react-day-picker'

type FeatureFilterProps = {
    roomClasses: IRoomClass[]; // Đảm bảo 
    setHavingFilters: (value: boolean) => void;
    onChange: (params: FeatureSortAndFilterParams) => void;
    onSearch: () => void;
    onReset: () => void;
};

const FeatureFilter = ({ roomClasses, setHavingFilters, onChange, onSearch, onReset }: FeatureFilterProps) => {
    const [searchFeatureName, setSearchFeatureName] = useState<string>('');
    const [searchPriceQuery, setSearchPriceQuery] = useState<string>('');
    const [searchAvailabilityQuery, setSearchAvailabilityQuery] = useState<string>('');
    //const [searchFeatures, setSearchFeatures] = useState<number[]>([])
    const [searchRoomClasses, setSearchRoomClasses] = useState<number[]>([]); // Lọc theo tiện ích
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [sort, setSort] = useState<string>('-createdAt');

    const [searchPrice, setSearchPrice] = useState<string>(''); // Giá
    const [priceSort, setPriceSort] = useState<string>('$lte'); // Sort cho giá
    const [searchAvailability, setSearchAvailability] = useState<string>(''); // Tình trạng có sẵn
    const [availabilitySort, setAvailabilitySort] = useState<string>('$lte'); // Sort cho tình trạng có sẵn

    // Tạo query lọc theo giá khi searchPrice thay đổi
    useEffect(() => {
        if (searchPrice) {
            const query = { [priceSort]: searchPrice };
            setSearchPriceQuery(JSON.stringify(query));
        } else {
            setSearchPriceQuery('');
        }
    }, [searchPrice, priceSort]);

    // Tạo query lọc theo tình trạng khi availability thay đổi
    useEffect(() => {
        if (searchAvailability) {
            const query = { [availabilitySort]: searchAvailability };
            setSearchAvailabilityQuery(JSON.stringify(query));
        } else {
            setSearchAvailabilityQuery('');
        }
    }, [searchAvailability, availabilitySort]);

    // Cập nhật filter params khi state thay đổi
    useEffect(() => {
        onChange({ searchFeatureName, searchPriceQuery, searchAvailabilityQuery, searchRoomClasses, sort, date });
    }, [searchFeatureName, searchPriceQuery, searchAvailabilityQuery, searchRoomClasses, sort, date]);

    // Thực hiện tìm kiếm
    const handleSearch = () => {
        onSearch();
        if (!searchFeatureName && !searchPriceQuery && !searchAvailabilityQuery && sort === '-createdAt' && !date?.length && !searchFeatures?.length) {
            setHavingFilters(false);
        } else {
            setHavingFilters(true);
        }
    };

    // Đặt lại tất cả bộ lọc
    const handleReset = () => {
        setSearchFeatureName('');
        setSearchPriceQuery('');
        setSearchAvailabilityQuery('');
        //setSearchFeatures([]);
        setSearchRoomClasses([]);
        setSort('-createdAt');
        setDate(undefined);
        setHavingFilters(false);
        onReset();
    };

    useEffect(() => console.log(searchRoomClasses), [searchRoomClasses])

    return (
        <PopoverContent className="w-[800px] bg-white">
            <div className="mb-4 flex items-center justify-between">
                <Button text="Tìm kiếm" variant="gradient" className="rounded-2xl border-primary px-3 py-1.5 text-xs" onClick={handleSearch} />
                <Button text="Đặt lại" variant="danger" className="rounded-2xl px-3 py-1.5 text-xs" onClick={handleReset} />
            </div>

            <div className="grid grid-cols-2 gap-4">

                <div className="relative rounded border-2 border-primary py-2 pl-3 pr-1">
                    <h3 className="absolute -left-2 -top-0.5 -translate-y-1/2 scale-[0.8] bg-white px-1 font-medium text-primary">
                        Lọc theo lớp phòng
                    </h3>
                    <div className="mt-2 flex max-h-[256px] flex-col gap-2 overflow-y-auto pr-2">
                        {roomClasses.map(roomClass => (
                            <div key={roomClass.id} className="flex items-center gap-3">
                                <p className="flex-1 truncate">{roomClass.className}</p>
                                {/* Kiểm tra nếu id lớp phòng có trong mảng lọc */}
                                <input
                                    type="checkbox"
                                    className="scale-150"
                                    checked={searchRoomClasses.includes(roomClass.id)}  // Lọc theo id lớp phòng
                                    onChange={e => {
                                        setSearchRoomClasses(prev => {
                                            if (e.target.checked) {
                                                return [...prev, roomClass.id].sort(); // Thêm lớp phòng vào nếu được chọn
                                            } else {
                                                return prev.filter(rc => rc !== roomClass.id); // Loại bỏ lớp phòng nếu bỏ chọn
                                            }
                                        });
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>



                {/* Lọc theo tên và các thông tin khác */}
                <form>
                    <div className="mb-4">
                        <TextInput
                            fieldName="featureName"
                            placeholder="Lọc theo tên tiện ích"
                            error=""
                            value={searchFeatureName}
                            onChange={(value: string) => setSearchFeatureName(value)}
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

export default FeatureFilter;
