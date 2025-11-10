import { Checkbox } from './Checkbox'
import { DAYS_OF_WEEK } from '@/constants'
import type { DayOfWeek } from '@/types'

interface DaySelectorProps {
  selectedDays: DayOfWeek[]
  onChange: (days: DayOfWeek[]) => void
  error?: string
}

export function DaySelector({
  selectedDays,
  onChange,
  error,
}: DaySelectorProps) {
  const handleDayToggle = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day))
    } else {
      onChange([...selectedDays, day])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">반복 요일</label>
      <div className="grid grid-cols-7 gap-2">
        {DAYS_OF_WEEK.map(({ value, label }) => (
          <Checkbox
            key={value}
            label={label}
            checked={selectedDays.includes(value)}
            onChange={() => handleDayToggle(value)}
            className="flex-col items-center gap-1"
          />
        ))}
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
}
