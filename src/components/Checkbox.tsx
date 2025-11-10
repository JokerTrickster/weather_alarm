import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Checkbox({
  label,
  className,
  id,
  ...props
}: CheckboxProps) {
  const checkboxId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <label
      htmlFor={checkboxId}
      className={clsx(
        'flex min-h-touch items-center gap-2 cursor-pointer select-none',
        className
      )}
    >
      <input
        type="checkbox"
        id={checkboxId}
        className="h-5 w-5 rounded border-gray-300 text-primary-600 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
        {...props}
      />
      <span className="text-base text-gray-700">{label}</span>
    </label>
  )
}
