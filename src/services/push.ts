import { apiClient } from './api'
import { storage } from '@/utils/storage'
import { API_ENDPOINTS } from '@/constants'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const pushService = {
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('이 브라우저는 알림을 지원하지 않습니다.')
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission === 'denied') {
      throw new Error('알림 권한이 거부되었습니다. 브라우저 설정에서 변경해주세요.')
    }

    return Notification.requestPermission()
  },

  async subscribe(): Promise<PushSubscriptionJSON> {
    const permission = await this.requestPermission()

    if (permission !== 'granted') {
      throw new Error('알림 권한이 필요합니다.')
    }

    if (!('serviceWorker' in navigator)) {
      throw new Error('이 브라우저는 서비스 워커를 지원하지 않습니다.')
    }

    const registration = await navigator.serviceWorker.ready

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    })

    const subscriptionJSON = subscription.toJSON()

    // Send subscription to backend
    await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.SUBSCRIBE, {
      subscription: subscriptionJSON,
    })

    // Store subscription locally
    storage.setPushSubscription(subscriptionJSON)

    return subscriptionJSON
  },

  async unsubscribe(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return
    }

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      await subscription.unsubscribe()
      await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.UNSUBSCRIBE)
      storage.removePushSubscription()
    }
  },

  async getSubscription(): Promise<PushSubscriptionJSON | null> {
    if (!('serviceWorker' in navigator)) {
      return null
    }

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    return subscription?.toJSON() || null
  },

  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    )
  },

  getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) {
      return 'unsupported'
    }
    return Notification.permission
  },
}
