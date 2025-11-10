'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { alarmsService } from '@/services/alarms'
import type { Alarm, CreateAlarmRequest, UpdateAlarmRequest } from '@/types'

interface AlarmsContextValue {
  alarms: Alarm[]
  isLoading: boolean
  error: string | null
  fetchAlarms: () => Promise<void>
  createAlarm: (data: CreateAlarmRequest) => Promise<Alarm>
  updateAlarm: (data: UpdateAlarmRequest) => Promise<Alarm>
  deleteAlarm: (id: string) => Promise<void>
  toggleAlarm: (id: string, enabled: boolean) => Promise<Alarm>
}

const AlarmsContext = createContext<AlarmsContextValue | undefined>(undefined)

export function AlarmsProvider({ children }: { children: ReactNode }) {
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const operationInProgressRef = useRef(false)

  const fetchAlarms = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await alarmsService.getAlarms()
      setAlarms(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알람을 불러오는데 실패했습니다.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createAlarm = useCallback(async (data: CreateAlarmRequest) => {
    if (operationInProgressRef.current) {
      throw new Error('다른 작업이 진행 중입니다. 잠시 후 다시 시도해주세요.')
    }

    operationInProgressRef.current = true
    try {
      const newAlarm = await alarmsService.createAlarm(data)
      setAlarms((prev) => [...prev, newAlarm])
      return newAlarm
    } finally {
      operationInProgressRef.current = false
    }
  }, [])

  const updateAlarm = useCallback(async (data: UpdateAlarmRequest) => {
    if (operationInProgressRef.current) {
      throw new Error('다른 작업이 진행 중입니다. 잠시 후 다시 시도해주세요.')
    }

    operationInProgressRef.current = true
    try {
      const updatedAlarm = await alarmsService.updateAlarm(data)
      setAlarms((prev) =>
        prev.map((alarm) => (alarm.id === data.id ? updatedAlarm : alarm))
      )
      return updatedAlarm
    } finally {
      operationInProgressRef.current = false
    }
  }, [])

  const deleteAlarm = useCallback(async (id: string) => {
    if (operationInProgressRef.current) {
      throw new Error('다른 작업이 진행 중입니다. 잠시 후 다시 시도해주세요.')
    }

    operationInProgressRef.current = true
    try {
      await alarmsService.deleteAlarm(id)
      setAlarms((prev) => prev.filter((alarm) => alarm.id !== id))
    } finally {
      operationInProgressRef.current = false
    }
  }, [])

  const toggleAlarm = useCallback(async (id: string, enabled: boolean) => {
    if (operationInProgressRef.current) {
      throw new Error('다른 작업이 진행 중입니다. 잠시 후 다시 시도해주세요.')
    }

    operationInProgressRef.current = true
    try {
      const updatedAlarm = await alarmsService.toggleAlarm(id, enabled)
      setAlarms((prev) =>
        prev.map((alarm) => (alarm.id === id ? updatedAlarm : alarm))
      )
      return updatedAlarm
    } finally {
      operationInProgressRef.current = false
    }
  }, [])

  const value: AlarmsContextValue = {
    alarms,
    isLoading,
    error,
    fetchAlarms,
    createAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
  }

  return (
    <AlarmsContext.Provider value={value}>{children}</AlarmsContext.Provider>
  )
}

export function useAlarms() {
  const context = useContext(AlarmsContext)
  if (context === undefined) {
    throw new Error('useAlarms must be used within an AlarmsProvider')
  }
  return context
}
