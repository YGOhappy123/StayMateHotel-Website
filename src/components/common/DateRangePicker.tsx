import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { twMerge } from 'tailwind-merge'
import { Calendar } from '@/components/ui/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'

type DateRangePickerProps = {
    date: DateRange | undefined
    setDate: (value: DateRange | undefined) => void
    className?: string
    triggerClassName?: string
}

const DateRangePicker = ({ date, setDate, className, triggerClassName }: DateRangePickerProps) => {
    return (
        <div className={twMerge(`grid gap-2 ${className}`)}>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        className={twMerge(
                            `flex w-full items-center gap-2 rounded border-2 border-neutral-500 px-3 py-2 font-medium leading-[2.15] text-primary focus:border-primary ${triggerClassName}`
                        )}
                    >
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'dd LLL, y', { locale: vi })} - {format(date.to, 'dd LLL, y', { locale: vi })}
                                </>
                            ) : (
                                format(date.from, 'dd LLL, y', { locale: vi })
                            )
                        ) : (
                            <span>Lọc theo ngày tạo</span>
                        )}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto bg-white p-0">
                    <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} locale={vi} />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default DateRangePicker
