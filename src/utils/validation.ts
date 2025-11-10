import { ERROR_MESSAGES, PASSWORD_MIN_LENGTH } from '@/constants'
import type { DayOfWeek } from '@/types'

export function validateEmail(email: string): string | undefined {
  if (!email) {
    return ERROR_MESSAGES.EMAIL_REQUIRED
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return ERROR_MESSAGES.EMAIL_INVALID
  }

  return undefined
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return ERROR_MESSAGES.PASSWORD_REQUIRED
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return ERROR_MESSAGES.PASSWORD_TOO_SHORT
  }

  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  if (!hasLetter || !hasNumber) {
    return ERROR_MESSAGES.PASSWORD_INVALID
  }

  return undefined
}

export function validatePasswordConfirm(
  password: string,
  passwordConfirm: string
): string | undefined {
  if (password !== passwordConfirm) {
    return ERROR_MESSAGES.PASSWORD_MISMATCH
  }

  return undefined
}

export function validateLocation(
  province: string,
  city: string,
  district: string
): string | undefined {
  if (!province || !city || !district) {
    return ERROR_MESSAGES.LOCATION_REQUIRED
  }

  return undefined
}

export function validateTime(time: string): string | undefined {
  if (!time) {
    return ERROR_MESSAGES.TIME_REQUIRED
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(time)) {
    return '올바른 시간 형식이 아닙니다. (예: 07:00)'
  }

  return undefined
}

export function validateRepeatDays(days: DayOfWeek[]): string | undefined {
  if (!days || days.length === 0) {
    return ERROR_MESSAGES.DAYS_REQUIRED
  }

  return undefined
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
}

export function formatLocation(
  province: string,
  city: string,
  district: string
): string {
  return `${province} ${city} ${district}`
}
