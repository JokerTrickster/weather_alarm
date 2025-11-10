import clsx from 'clsx'
import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  options: SelectOption[]
  placeholder?: string
}

export function Select({
  label,
  error,
  fullWidth = true,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={clsx('flex flex-col gap-1.5', { 'w-full': fullWidth })}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'min-h-touch rounded-lg border px-3 py-2.5 text-base transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500',
          {
            'border-gray-300 hover:border-gray-400': !error,
            'border-error focus:border-error focus:ring-error': error,
            'text-gray-400': !props.value,
          },
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
}
