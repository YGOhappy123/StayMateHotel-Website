import React from 'react'

type NumberInputProps = {
    fieldName: string
    value: number
    placeholder: string
    error: string
    onChange: (value: number) => void
    onFocus: () => void
    labelClassName?: string
}

const NumberInput = ({
    fieldName,
    value,
    placeholder,
    error,
    onChange,
    onFocus,
    labelClassName
}: NumberInputProps) => {
    return (
        <div>
            <label htmlFor={fieldName} className={`block font-medium text-sm text-gray-700 ${labelClassName}`}>
                {placeholder}
            </label>
            <input
                type="number"
                name={fieldName}
                id={fieldName}
                value={value}
                placeholder={placeholder}
                onChange={e => onChange(Number(e.target.value))}
                onFocus={onFocus}
                className="w-full border p-2 rounded-md"
            />
            {error && <span className="text-red-600 text-xs">{error}</span>}
        </div>
    )
}

export default NumberInput
