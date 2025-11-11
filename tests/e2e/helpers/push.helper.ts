import { Page } from '@playwright/test'

/**
 * Push notification helper utilities for E2E tests
 */

/**
 * Wait for service worker to be registered and ready
 */
export async function waitForServiceWorker(page: Page, timeout = 10000): Promise<boolean> {
  return page.evaluate(
    ({ timeout }) => {
      return new Promise<boolean>((resolve) => {
        const timeoutId = setTimeout(() => resolve(false), timeout)

        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready
            .then(() => {
              clearTimeout(timeoutId)
              resolve(true)
            })
            .catch(() => {
              clearTimeout(timeoutId)
              resolve(false)
            })
        } else {
          clearTimeout(timeoutId)
          resolve(false)
        }
      })
    },
    { timeout }
  )
}

/**
 * Check if push notifications are supported
 */
export async function isPushNotificationSupported(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    return (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    )
  })
}

/**
 * Get current notification permission status
 */
export async function getNotificationPermission(page: Page): Promise<NotificationPermission> {
  return page.evaluate(() => Notification.permission)
}

/**
 * Get current push subscription
 */
export async function getPushSubscription(page: Page): Promise<PushSubscriptionJSON | null> {
  return page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) {
      return null
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      return subscription?.toJSON() || null
    } catch (error) {
      console.error('Error getting subscription:', error)
      return null
    }
  })
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(page: Page, vapidPublicKey: string): Promise<PushSubscriptionJSON | null> {
  return page.evaluate(
    async ({ vapidKey }) => {
      if (!('serviceWorker' in navigator)) {
        return null
      }

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

      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        })
        return subscription.toJSON()
      } catch (error) {
        console.error('Subscription error:', error)
        return null
      }
    },
    { vapidKey: vapidPublicKey }
  )
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(page: Page): Promise<boolean> {
  return page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        return await subscription.unsubscribe()
      }
      return false
    } catch (error) {
      console.error('Unsubscribe error:', error)
      return false
    }
  })
}

/**
 * Trigger a test push notification via service worker
 */
export async function triggerTestPushNotification(
  page: Page,
  notification: { title: string; body: string; icon?: string }
) {
  return page.evaluate(
    async ({ title, body, icon }) => {
      if (!('serviceWorker' in navigator)) {
        return false
      }

      try {
        const registration = await navigator.serviceWorker.ready
        const sw = registration.active

        if (sw) {
          sw.postMessage({
            type: 'TEST_PUSH',
            data: { title, body, icon },
          })
          return true
        }
        return false
      } catch (error) {
        console.error('Test push error:', error)
        return false
      }
    },
    { title: notification.title, body: notification.body, icon: notification.icon }
  )
}

/**
 * Check if service worker is active
 */
export async function isServiceWorkerActive(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    return navigator.serviceWorker.controller !== null
  })
}

/**
 * Wait for service worker to become active
 */
export async function waitForServiceWorkerActive(page: Page, timeout = 10000): Promise<boolean> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const isActive = await isServiceWorkerActive(page)
    if (isActive) {
      return true
    }
    await page.waitForTimeout(100)
  }

  return false
}

/**
 * Get service worker registration info
 */
export async function getServiceWorkerInfo(page: Page) {
  return page.evaluate(() => {
    if (!('serviceWorker' in navigator)) {
      return null
    }

    return navigator.serviceWorker.getRegistration().then((registration) => {
      if (!registration) {
        return null
      }

      return {
        scope: registration.scope,
        active: registration.active !== null,
        installing: registration.installing !== null,
        waiting: registration.waiting !== null,
      }
    })
  })
}
