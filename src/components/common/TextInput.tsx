type TextInputProps = {
    fieldName: string
    placeholder: string
    value: string
    error: string
    onChange: (value: string) => void
    onFocus: () => void
}

const TextInput = ({ fieldName, placeholder, error, value, onChange, onFocus }: TextInputProps) => {
    return (
        <div className="relative mb-10">
            <input
                type="text"
                className="peer block min-h-[auto] w-full rounded border-2 border-neutral-500 bg-transparent px-3 py-2 font-medium leading-[2.15] text-primary caret-primary outline-none transition-all duration-200 ease-linear focus:border-primary motion-reduce:transition-none"
                id={fieldName}
                placeholder=" "
                spellCheck={false}
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={onFocus}
            />
            <label
                htmlFor={fieldName}
                className="pointer-events-none absolute left-3 top-1/2 mb-0 max-w-[90%] origin-[0_0] -translate-y-1/2 truncate bg-ivory px-1 font-medium text-neutral-500 transition-all duration-200 ease-out peer-focus:top-0.5 peer-focus:scale-[0.8] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:scale-[0.8] peer-[:not(:placeholder-shown)]:text-primary motion-reduce:transition-none"
            >
                {placeholder}
            </label>
            {error && <p className="absolute px-3 text-sm font-medium text-red-600">{error}</p>}
        </div>
    )
}

export default TextInput
