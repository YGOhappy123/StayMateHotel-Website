import { Skeleton } from '@/components/ui/Skeleton'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type StatisticCardProps = {
    value: number
    previousValue: number
    label?: string
    unit?: string
    loading?: boolean
    to: string
}

export default function StatisticCard({ value, previousValue, label, unit, loading, to }: StatisticCardProps) {
    const [count, setCount] = useState<number>(0)
    const percentGrowth = useMemo(() => {
        return (((value - previousValue) / previousValue) * 100).toFixed(2)
    }, [previousValue, value])
    const navigate = useNavigate()
    const isIncreasing = useMemo(() => parseFloat(percentGrowth) > 0, [percentGrowth])

    useEffect(() => {
        const speed = 100
        let from = 0
        const step = value / speed
        const counter = setInterval(function () {
            from += step
            if (from > value) {
                clearInterval(counter)
                setCount(value)
            } else {
                setCount(Math.ceil(from))
            }
        }, 1)

        return () => clearInterval(counter)
    }, [value])

    return (
        <div
            className="flex min-h-[150px] cursor-pointer items-center gap-4 rounded-2xl border-2 border-primary bg-secondary/85 p-6 shadow-md"
            onClick={() => navigate(to)}
        >
            <div className="flex aspect-square w-10 items-center justify-center rounded-lg bg-ivory">
                {isIncreasing ? (
                    <FontAwesomeIcon icon={faArrowUp} size="lg" className="text-primary" />
                ) : (
                    <FontAwesomeIcon icon={faArrowDown} size="lg" className="text-primary" />
                )}
            </div>
            {loading ? (
                <Skeleton className="h-full w-full rounded-xl" />
            ) : (
                <div className="flex flex-col items-start gap-2 text-accent">
                    <div className="flex items-center gap-2 text-3xl">
                        <strong>{count ? count.toLocaleString('en-US') : 0}</strong>
                        {unit && <strong>{unit}</strong>}
                        {value > 0 && previousValue > 0 && (
                            <span className={`text-xl font-bold ${isIncreasing ? 'text-green-600' : 'text-red-600'}`}>
                                ({isIncreasing ? '+' : ''}
                                {percentGrowth}%)
                            </span>
                        )}
                    </div>
                    <p className="text-lg font-medium">{label}</p>
                </div>
            )}
        </div>
    )
}
