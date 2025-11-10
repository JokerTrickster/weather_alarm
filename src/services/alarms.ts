import { apiClient } from './api'
import { API_ENDPOINTS } from '@/constants'
import type { Alarm, CreateAlarmRequest, UpdateAlarmRequest } from '@/types'

export const alarmsService = {
  async getAlarms(): Promise<Alarm[]> {
    return apiClient.get<Alarm[]>(API_ENDPOINTS.ALARMS.LIST)
  },

  async createAlarm(data: CreateAlarmRequest): Promise<Alarm> {
    return apiClient.post<Alarm>(API_ENDPOINTS.ALARMS.CREATE, data)
  },

  async updateAlarm(data: UpdateAlarmRequest): Promise<Alarm> {
    const { id, ...updateData } = data
    return apiClient.put<Alarm>(API_ENDPOINTS.ALARMS.UPDATE(id), updateData)
  },

  async deleteAlarm(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.ALARMS.DELETE(id))
  },

  async toggleAlarm(id: string, enabled: boolean): Promise<Alarm> {
    return apiClient.put<Alarm>(API_ENDPOINTS.ALARMS.TOGGLE(id), { enabled })
  },
}
