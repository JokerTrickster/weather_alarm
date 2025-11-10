'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useAlarms } from '@/context/AlarmsContext'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Toast } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
import { formatLocation } from '@/utils/validation'
import { ROUTES, MAX_ALARMS, SUCCESS_MESSAGES, DAYS_OF_WEEK } from '@/constants'
import type { Alarm } from '@/types'

function AlarmCard({ alarm }: { alarm: Alarm }) {
  const router = useRouter()
  const { toggleAlarm, deleteAlarm } = useAlarms()
  const { showSuccess, showError } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async () => {
    try {
      await toggleAlarm(alarm.id, !alarm.enabled)
    } catch (error) {
      showError(
        error instanceof Error ? error.message : '알람 상태 변경에 실패했습니다.'
      )
    }
  }

  const handleDelete = async () => {
    if (!confirm('이 알람을 삭제하시겠습니까?')) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteAlarm(alarm.id)
      showSuccess(SUCCESS_MESSAGES.ALARM_DELETED)
    } catch (error) {
      showError(
        error instanceof Error ? error.message : '알람 삭제에 실패했습니다.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = () => {
    router.push(ROUTES.ALARM_EDIT(alarm.id))
  }

  const daysText = DAYS_OF_WEEK.filter((day) =>
    alarm.repeatDays.includes(day.value)
  )
    .map((day) => day.label)
    .join(', ')

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {alarm.alarmTime}
            </span>
            <button
              onClick={handleToggle}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                alarm.enabled
                  ? 'bg-success/10 text-success'
                  : 'bg-gray-100 text-gray-500'
              }`}
              aria-label={`알람 ${alarm.enabled ? '비활성화' : '활성화'}하기`}
              role="switch"
              aria-checked={alarm.enabled}
            >
              {alarm.enabled ? '활성' : '비활성'}
            </button>
          </div>

          <p className="mt-1 text-sm text-gray-600">
            {formatLocation(alarm.province, alarm.city, alarm.district)}
          </p>

          <p className="mt-1 text-sm text-gray-500">{daysText}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleEdit}
          className="flex-1"
        >
          수정
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={handleDelete}
          isLoading={isDeleting}
          className="flex-1"
        >
          삭제
        </Button>
      </div>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="h-24 w-24 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">
        알람이 없습니다
      </h2>
      <p className="mt-2 text-gray-600">첫 알람을 등록해보세요</p>
    </div>
  )
}

export default function AlarmsPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const { alarms, isLoading, fetchAlarms } = useAlarms()
  const { toast, showSuccess, hideToast } = useToast()

  useEffect(() => {
    fetchAlarms()
  }, [fetchAlarms])

  const handleLogout = async () => {
    await logout()
    showSuccess(SUCCESS_MESSAGES.LOGOUT_SUCCESS)
    router.push(ROUTES.LOGIN)
  }

  const canAddAlarm = alarms.length < MAX_ALARMS

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between p-4">
          <h1 className="text-xl font-bold text-primary-600">날씨 알람</h1>
          <Button size="sm" variant="secondary" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            내 알람 ({alarms.length}/{MAX_ALARMS})
          </h2>
          <Link href={ROUTES.ALARM_NEW}>
            <Button size="sm" disabled={!canAddAlarm}>
              {canAddAlarm ? '새 알람 등록' : '최대 2개'}
            </Button>
          </Link>
        </div>

        {alarms.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {alarms.map((alarm) => (
              <AlarmCard key={alarm.id} alarm={alarm} />
            ))}
          </div>
        )}
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
