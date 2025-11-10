// User types
export interface User {
  id: string
  email: string
  createdAt: string
  lastLogin: string
}

// Alarm types
export interface Alarm {
  id: string
  userId: string
  province: string
  city: string
  district: string
  alarmTime: string // HH:MM format
  repeatDays: DayOfWeek[]
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

export interface CreateAlarmRequest {
  province: string
  city: string
  district: string
  alarmTime: string
  repeatDays: DayOfWeek[]
  enabled: boolean
}

export interface UpdateAlarmRequest extends Partial<CreateAlarmRequest> {
  id: string
}

// Location types
export interface LocationData {
  provinces: Province[]
}

export interface Province {
  name: string
  cities: City[]
}

export interface City {
  name: string
  districts: string[]
}

// Authentication types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  passwordConfirm: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface UpdatePasswordRequest {
  token: string
  newPassword: string
  newPasswordConfirm: string
}

// Push notification types
export interface PushSubscription {
  id: string
  userId: string
  subscriptionJson: string
  createdAt: string
}

export interface SubscribePushRequest {
  subscription: PushSubscriptionJSON
}

// Weather notification data (received in push notification)
export interface WeatherNotification {
  location: string
  temperature: number
  precipitationProbability: number
  humidity: number
  fineDust: {
    level: FineDustLevel
    value: number
  }
  condition: string
  icon: string
}

export type FineDustLevel = '좋음' | '보통' | '나쁨' | '매우나쁨'

// API response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form state
export interface FormErrors {
  [key: string]: string | undefined
}
