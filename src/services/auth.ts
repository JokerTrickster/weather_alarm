import { apiClient } from './api'
import { storage } from '@/utils/storage'
import { API_ENDPOINTS } from '@/constants'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
} from '@/types'

export const authService = {
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      {
        email: data.email,
        password: data.password,
      }
    )

    storage.setToken(response.token)
    storage.setUser(response.user)

    return response
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    )

    storage.setToken(response.token)
    storage.setUser(response.user)

    return response
  },

  async logout(): Promise<void> {
    storage.clearAll()
  },

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)
  },

  async updatePassword(data: UpdatePasswordRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, data)
  },

  isAuthenticated(): boolean {
    return !!storage.getToken()
  },

  getCurrentUser() {
    return storage.getUser()
  },
}
