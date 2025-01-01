import { useEffect, useState } from 'react';
import { PopoverContent } from '@/components/ui/Popover';
import { FeatureSortAndFilterParams } from '@/services/featureService';  // Giả sử bạn có service quản lý features

import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import SelectInput from '@/components/common/SelectInput';

type FeatureFilterProps = {
    roomClasses: IRoomClass[];  // Lớp phòng để lọc
    setHavingFilters: (value: boolean) => void;  // Hàm xác định có bộ lọc không
    onChange: (params: FeatureSortAndFilterParams) => void;  // Hàm truyền tham số lọc
    onSearch: () => void;  // Hàm thực thi tìm kiếm
    onReset: () => void;  // Hàm reset bộ lọc
};

const FeatureFilter = ({ roomClasses, setHavingFilters, onChange, onSearch, onReset }: FeatureFilterProps) => {
    // Khai báo các state cho các điều kiện lọc
    const [searchFeatureName, setSearchFeatureName] = useState<string>('');  // Tên tính năng
    const [searchRoomClasses, setSearchRoomClasses] = useState<number[]>([]);  // Các lớp phòng được chọn
    const [startTime, setStartTime] = useState<string>('');  // Thời gian bắt đầu
    const [endTime, setEndTime] = useState<string>('');  // Thời gian kết thúc
    const [sort, setSort] = useState<string>('-createdAt');  // Cách sắp xếp (theo ngày tạo)

    // Tạo query lọc theo thời gian (startTime, endTime)
    const [searchDateQuery, setSearchDateQuery] = useState<string>('');

    // Tạo query lọc theo thời gian khi startTime hoặc endTime thay đổi
    useEffect(() => {
        if (startTime && endTime) {
            const query = { startTime, endTime };  // Query tìm kiếm với startTime và endTime
            setSearchDateQuery(JSON.stringify(query));  // Chuyển đổi thành chuỗi JSON cho query
        } else {
            setSearchDateQuery('');
        }
    }, [startTime, endTime]);

    // Cập nhật các tham số khi có thay đổi trong state
    useEffect(() => {
        onChange({
            searchFeatureName,
            searchDateQuery,
            searchRoomClasses,
            sort
        });
    }, [searchFeatureName, searchDateQuery, searchRoomClasses, sort, onChange]);

    // Hàm tìm kiếm để áp dụng bộ lọc đã chọn
    const handleSearch = () => {
        onSearch();  // Gọi hàm tìm kiếm
        // Kiểm tra nếu không có điều kiện lọc nào được chọn thì không áp dụng bộ lọc
        if (!searchFeatureName && !searchDateQuery && sort === '-createdAt' && !searchRoomClasses.length) {
            setHavingFilters(false);  // Không có bộ lọc
        } else {
            setHavingFilters(true);  // Có bộ lọc
        }
    };

    // Hàm reset tất cả các bộ lọc về trạng thái mặc định
    const handleReset = () => {
        setSearchFeatureName('');
        setSearchRoomClasses([]);
        setSort('-createdAt');
        setStartTime('');  // Reset startTime
        setEndTime('');  // Reset endTime
        setHavingFilters(false);  // Không có bộ lọc
        onReset();  // Gọi hàm reset từ component cha
    };

    return (
        <PopoverContent className="w-[800px] bg-white">
            <div className="mb-4 flex items-center justify-between">
                {/* Nút tìm kiếm */}
                <Button
                    text="Tìm kiếm"
                    variant="gradient"
                    className="rounded-2xl border-primary px-3 py-1.5 text-xs"
                    onClick={handleSearch}
                />
                {/* Nút reset */}
                <Button
                    text="Đặt lại"
                    variant="danger"
                    className="rounded-2xl px-3 py-1.5 text-xs"
                    onClick={handleReset}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Lọc theo lớp phòng */}
                <div className="relative rounded border-2 border-primary py-2 pl-3 pr-1">
                    <h3 className="absolute -left-2 -top-0.5 -translate-y-1/2 scale-[0.8] bg-white px-1 font-medium text-primary">
                        Lọc theo lớp phòng
                    </h3>
                    <div className="mt-2 flex max-h-[256px] flex-col gap-2 overflow-y-auto pr-2">
                        {roomClasses.map(roomClass => (
                            <div key={roomClass.id} className="flex items-center gap-3">
                                <p className="flex-1 truncate">{roomClass.className}</p>
                                {/* Checkbox cho phép người dùng chọn các lớp phòng */}
                                <input
                                    type="checkbox"
                                    className="scale-150"
                                    checked={searchRoomClasses.includes(roomClass.id)}
                                    onChange={e => {
                                        setSearchRoomClasses(prev => {
                                            if (e.target.checked) {
                                                return [...prev, roomClass.id].sort();  // Thêm lớp phòng vào nếu được chọn
                                            } else {
                                                return prev.filter(rc => rc !== roomClass.id);  // Xóa lớp phòng nếu bỏ chọn
                                            }
                                        });
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lọc theo tên tính năng */}
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

                    {/* Lọc theo thời gian */}
                    <div className="mb-4 flex flex-col gap-2">
                        <div className="flex-1">
                            <TextInput
                                fieldName="startTime"
                                placeholder="Thời gian bắt đầu"
                                value={startTime}
                                onChange={(value: string) => setStartTime(value)}
                                type="datetime-local"
                                wrapperClassName="w-full"
                                labelClassName="bg-white"
                                inputClassName="leading-2"
                            />
                        </div>

                        <div className="flex-1">
                            <TextInput
                                fieldName="endTime"
                                placeholder="Thời gian kết thúc"
                                value={endTime}
                                onChange={(value: string) => setEndTime(value)}
                                type="datetime-local"
                                wrapperClassName="w-full"
                                labelClassName="bg-white"
                                inputClassName="leading-2"
                            />
                        </div>
                    </div>


                    {/* Sắp xếp */}
                    <div>
                        <SelectInput
                            fieldName="sort"
                            placeholder="Sắp xếp theo"
                            options={[
                                { value: '-createdAt', label: 'Ngày tạo giảm dần' },
                                { value: '+createdAt', label: 'Ngày tạo tăng dần' },
                            ]}
                            value={sort}
                            onChange={(value: string | number) => setSort(value as string)}  // Cập nhật giá trị sort
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
