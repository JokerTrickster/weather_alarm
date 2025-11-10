import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { storage } from '@/utils/storage'
import { ERROR_MESSAGES } from '@/constants'
import type { ApiResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = storage.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse<never>>) => {
        if (error.response) {
          const { status, data } = error.response

          // Handle specific status codes
          if (status === 401) {
            storage.clearAll()
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            return Promise.reject({
              message: ERROR_MESSAGES.UNAUTHORIZED,
            })
          }

          if (status === 403) {
            return Promise.reject({
              message: ERROR_MESSAGES.FORBIDDEN,
            })
          }

          // Use error message from API if available
          return Promise.reject({
            message: data?.error || data?.message || ERROR_MESSAGES.UNKNOWN_ERROR,
          })
        }

        // Network error
        if (error.request) {
          return Promise.reject({
            message: ERROR_MESSAGES.NETWORK_ERROR,
          })
        }

        return Promise.reject({
          message: ERROR_MESSAGES.UNKNOWN_ERROR,
        })
      }
    )
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url)
    return response.data.data as T
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data)
    return response.data.data as T
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data)
    return response.data.data as T
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url)
    return response.data.data as T
  }
}

export const apiClient = new ApiClient()
