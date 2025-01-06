import { HTMLInputAutoCompleteAttribute } from 'react'
import { twMerge } from 'tailwind-merge'

type TextInputProps = {
    fieldName: string
    placeholder: string
    autoComplete?: HTMLInputAutoCompleteAttribute | undefined

    value: string
    error: string
    onChange: (value: string) => void
    onFocus: () => void
    type?: 'text' | 'number'
    disabled?: boolean
    wrapperClassName?: string
    inputClassName?: string
    labelClassName?: string
}

const TextInput = ({
    fieldName,
    placeholder,
    autoComplete = 'on',
    error,
    value,
    onChange,
    onFocus,
    type = 'text',
    disabled = false,
    wrapperClassName,
    inputClassName,
    labelClassName
}: TextInputProps) => {
    return (
        <div className={twMerge(`relative ${wrapperClassName}`)}>
            <input
                type={type}
                autoComplete={autoComplete}
                className={twMerge(
                    `peer block min-h-[auto] w-full rounded border-2 border-neutral-500 bg-transparent px-3 py-2 font-medium leading-[2.15] text-primary caret-primary outline-none transition-all duration-200 ease-linear focus:border-primary disabled:cursor-not-allowed disabled:text-neutral-500 motion-reduce:transition-none ${inputClassName}`
                )}
                id={fieldName}
                placeholder=" "
                spellCheck={false}
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={onFocus}
                disabled={disabled}
            />
            <label
                htmlFor={fieldName}
                className={twMerge(
                    `pointer-events-none absolute left-3 top-1/2 mb-0 max-w-[90%] origin-[0_0] -translate-y-1/2 truncate bg-ivory px-1 font-medium text-neutral-500 transition-all duration-200 ease-out peer-focus:top-0.5 peer-focus:scale-[0.8] peer-focus:text-primary peer-disabled:!text-neutral-500 peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:scale-[0.8] peer-[:not(:placeholder-shown)]:text-primary motion-reduce:transition-none ${labelClassName}`
                )}
            >
                {placeholder}
            </label>
            {error && <p className="absolute text-sm font-medium text-red-600">{error}</p>}
        </div>
    )
}

export default TextInput
