import { twMerge } from 'tailwind-merge'

type SelectInputProps = {
    fieldName: string
    placeholder: string
    value: string | number
    error: string
    options: { value: string | number; label: string }[]
    onChange: (value: string | number) => void
    onFocus: () => void
    havingDefaultOptions?: boolean
    selectClassName?: string
    labelClassName?: string
}

const SelectInput = ({
    fieldName,
    placeholder,
    value,
    error,
    options,
    onChange,
    onFocus,
    havingDefaultOptions = true,
    selectClassName,
    labelClassName
}: SelectInputProps) => {
    return (
        <div className="relative">
            <select
                className={twMerge(
                    `peer block min-h-[auto] w-full cursor-pointer rounded border-2 border-neutral-500 bg-transparent px-3 py-3.5 font-medium leading-[2.15] text-primary caret-primary outline-none transition-all duration-200 ease-linear focus:border-primary motion-reduce:transition-none ${selectClassName}`
                )}
                id={fieldName}
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={onFocus}
            >
                {havingDefaultOptions && <option value="">--</option>}
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <label
                htmlFor={fieldName}
                className={twMerge(
                    `pointer-events-none absolute left-3 top-1/2 mb-0 max-w-[90%] origin-[0_0] -translate-y-1/2 truncate bg-ivory px-1 font-medium text-neutral-500 transition-all duration-200 ease-out peer-focus:top-0.5 peer-focus:scale-[0.8] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:scale-[0.8] peer-[:not(:placeholder-shown)]:text-primary motion-reduce:transition-none ${labelClassName}`
                )}
            >
                {placeholder}
            </label>
            {error && <p className="absolute text-sm font-medium text-red-600">{error}</p>}
        </div>
    )
}

export default SelectInput
