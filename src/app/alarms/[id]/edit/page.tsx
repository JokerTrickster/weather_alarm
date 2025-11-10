'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAlarms } from '@/context/AlarmsContext'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { LocationSelector } from '@/components/LocationSelector'
import { DaySelector } from '@/components/DaySelector'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Toast } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
import {
  validateLocation,
  validateTime,
  validateRepeatDays,
} from '@/utils/validation'
import { formatErrorMessage } from '@/utils/error'
import { ROUTES, SUCCESS_MESSAGES } from '@/constants'
import type { DayOfWeek } from '@/types'

export default function EditAlarmPage() {
  const router = useRouter()
  const params = useParams()
  const alarmId = params.id as string

  const { alarms, updateAlarm } = useAlarms()
  const { toast, showSuccess, showError, hideToast } = useToast()

  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [alarmTime, setAlarmTime] = useState('')
  const [repeatDays, setRepeatDays] = useState<DayOfWeek[]>([])
  const [errors, setErrors] = useState<{
    location?: string
    alarmTime?: string
    repeatDays?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const alarm = alarms.find((a) => a.id === alarmId)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (alarm) {
      setProvince(alarm.province)
      setCity(alarm.city)
      setDistrict(alarm.district)
      setAlarmTime(alarm.alarmTime)
      setRepeatDays(alarm.repeatDays)
      setIsInitializing(false)
    } else if (alarms.length > 0) {
      showError('알람을 찾을 수 없습니다.')
      router.push(ROUTES.ALARMS)
    }
  }, [alarm, alarms.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const locationError = validateLocation(province, city, district)
    const timeError = validateTime(alarmTime)
    const daysError = validateRepeatDays(repeatDays)

    if (locationError || timeError || daysError) {
      setErrors({
        location: locationError,
        alarmTime: timeError,
        repeatDays: daysError,
      })
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      await updateAlarm({
        id: alarmId,
        province,
        city,
        district,
        alarmTime,
        repeatDays,
      })

      showSuccess(SUCCESS_MESSAGES.ALARM_UPDATED)
      timeoutRef.current = setTimeout(() => router.push(ROUTES.ALARMS), 500)
    } catch (error) {
      showError(formatErrorMessage(error, '알람 수정에 실패했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!alarm) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3 p-4">
          <button
            onClick={handleCancel}
            className="min-h-touch min-w-touch flex items-center justify-center"
            aria-label="뒤로가기"
          >
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">알람 수정</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <LocationSelector
            province={province}
            city={city}
            district={district}
            onProvinceChange={setProvince}
            onCityChange={setCity}
            onDistrictChange={setDistrict}
            errors={{ province: errors.location }}
          />

          <Input
            type="time"
            label="알람 시간"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            error={errors.alarmTime}
          />

          <DaySelector
            selectedDays={repeatDays}
            onChange={setRepeatDays}
            error={errors.repeatDays}
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleCancel}
            >
              취소
            </Button>
            <Button type="submit" fullWidth isLoading={isLoading}>
              저장
            </Button>
          </div>
        </form>
      </main>

      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  )
}
