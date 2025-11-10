import { STORAGE_KEYS } from '@/constants'
import type { User } from '@/types'

export const storage = {
  // Auth token
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  },

  removeToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  },

  // User
  getUser(): User | null {
    if (typeof window === 'undefined') return null
    const userJson = localStorage.getItem(STORAGE_KEYS.USER)
    if (!userJson) return null

    try {
      return JSON.parse(userJson)
    } catch {
      return null
    }
  },

  setUser(user: User): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  removeUser(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  // Push subscription
  getPushSubscription(): PushSubscriptionJSON | null {
    if (typeof window === 'undefined') return null
    const subscriptionJson = localStorage.getItem(STORAGE_KEYS.PUSH_SUBSCRIPTION)
    if (!subscriptionJson) return null

    try {
      return JSON.parse(subscriptionJson)
    } catch {
      return null
    }
  },

  setPushSubscription(subscription: PushSubscriptionJSON): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(
      STORAGE_KEYS.PUSH_SUBSCRIPTION,
      JSON.stringify(subscription)
    )
  },

  removePushSubscription(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.PUSH_SUBSCRIPTION)
  },

  // Clear all
  clearAll(): void {
    if (typeof window === 'undefined') return
    this.removeToken()
    this.removeUser()
    this.removePushSubscription()
  },
}
