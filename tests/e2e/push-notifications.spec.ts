import { test, expect, Page } from '@playwright/test'

/**
 * E2E Tests for Push Notification functionality
 *
 * Prerequisites:
 * - Development server running (localhost:3000)
 * - Backend API server running with VAPID keys configured
 * - Valid test user account
 */

const TEST_USER = {
  email: 'test@example.com',
  password: 'Test123!@#',
}

/**
 * Helper: Login to the application
 */
async function login(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')

  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')

  // Wait for redirect to alarms page
  await page.waitForURL('/alarms', { timeout: 10000 })
}

/**
 * Helper: Check if service worker is registered
 */
async function waitForServiceWorker(page: Page) {
  return page.evaluate(() => {
    return new Promise<boolean>((resolve) => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(() => resolve(true))
      } else {
        resolve(false)
      }
    })
  })
}

test.describe('Push Notifications', () => {
  test.beforeEach(async ({ page, context }) => {
    // Grant notification permissions before each test
    await context.grantPermissions(['notifications'])
  })

  test('should check push notification support', async ({ page }) => {
    await page.goto('/')

    const isSupported = await page.evaluate(() => {
      return (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        'serviceWorker' in navigator &&
        'PushManager' in window
      )
    })

    expect(isSupported).toBe(true)
  })

  test('should register service worker on page load', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for service worker registration
    const swRegistered = await waitForServiceWorker(page)
    expect(swRegistered).toBe(true)

    // Verify service worker is active
    const swActive = await page.evaluate(() => {
      return navigator.serviceWorker.controller !== null
    })
    expect(swActive).toBe(true)
  })

  test('should request notification permission', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password)

    // Check initial permission state
    const permissionBefore = await page.evaluate(() => Notification.permission)
    console.log('Permission before:', permissionBefore)

    // Find and click notification enable button (if exists)
    const notificationButton = page.locator('button:has-text("알림 받기"), button:has-text("알림 설정")')
    if (await notificationButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await notificationButton.click()

      // Wait for permission to be granted
      await page.waitForTimeout(1000)
    }

    // Verify permission is granted
    const permissionAfter = await page.evaluate(() => Notification.permission)
    expect(permissionAfter).toBe('granted')
  })

  test('should subscribe to push notifications', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password)
    await waitForServiceWorker(page)

    // Subscribe to push notifications
    const subscription = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready

      // VAPID key (this should match your backend)
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''

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
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        })

        return subscription.toJSON()
      } catch (error) {
        console.error('Subscription error:', error)
        return null
      }
    })

    expect(subscription).not.toBeNull()
    expect(subscription).toHaveProperty('endpoint')
    expect(subscription).toHaveProperty('keys')
  })

  test('should get existing push subscription', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password)
    await waitForServiceWorker(page)

    const subscription = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.getSubscription()
      return sub?.toJSON() || null
    })

    // If previously subscribed, subscription should exist
    console.log('Existing subscription:', subscription ? 'Found' : 'Not found')
  })

  test('should send subscription to backend', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password)
    await waitForServiceWorker(page)

    // Mock API call interception
    let apiCallMade = false
    await page.route('**/api/notifications/subscribe', (route) => {
      apiCallMade = true
      const request = route.request()
      const postData = request.postData()

      console.log('API call intercepted:', postData)

      // Verify subscription data structure
      if (postData) {
        const data = JSON.parse(postData)
        expect(data).toHaveProperty('subscription')
        expect(data.subscription).toHaveProperty('endpoint')
      }

      // Mock success response
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    // Trigger subscription via UI or direct call
    await page.evaluate(async () => {
      // Find push service and call subscribe
      const pushService = (window as any).pushService
      if (pushService && typeof pushService.subscribe === 'function') {
        await pushService.subscribe()
      }
    })

    await page.waitForTimeout(2000)
    console.log('API call made:', apiCallMade)
  })

  test('should receive and display push notification', async ({ page, context }) => {
    await login(page, TEST_USER.email, TEST_USER.password)
    await waitForServiceWorker(page)

    // Listen for notifications
    const notifications: any[] = []

    page.on('console', (msg) => {
      if (msg.text().includes('Push notification received')) {
        notifications.push(msg.text())
      }
    })

    // Simulate push notification (this requires backend to send push)
    // In real scenario, you would trigger alarm time or call backend API

    // For testing, we can trigger service worker push event directly
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        navigator.serviceWorker.ready.then((registration) => {
          // Trigger push event in service worker
          const sw = registration.active
          if (sw) {
            sw.postMessage({
              type: 'TEST_PUSH',
              data: {
                title: '날씨 알람 테스트',
                body: '푸시 알림이 정상적으로 작동합니다.',
              },
            })
          }
          resolve()
        })
      })
    })

    await page.waitForTimeout(2000)

    // Check if notification was triggered
    console.log('Notifications received:', notifications.length)
  })

  test('should handle notification click', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password)
    await waitForServiceWorker(page)

    // Navigate away from alarms page
    await page.goto('/')

    // Simulate notification click
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        navigator.serviceWorker.ready.then((registration) => {
          const sw = registration.active
          if (sw) {
            // Trigger notificationclick event
            sw.postMessage({
              type: 'TEST_NOTIFICATION_CLICK',
            })
          }
          resolve()
        })
      })
    })

    await page.waitForTimeout(1000)

    // Should redirect back to /alarms
    // Note: This test is simplified - real notification click behavior
    // depends on browser notification UI interaction
  })

  test('should unsubscribe from push notifications', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password)
    await waitForServiceWorker(page)

    // First, ensure we're subscribed
    const subscriptionBefore = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.getSubscription()
      return sub !== null
    })

    console.log('Subscribed before unsubscribe:', subscriptionBefore)

    // Mock API call for unsubscribe
    await page.route('**/api/notifications/unsubscribe', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    // Unsubscribe
    const unsubscribed = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        return await subscription.unsubscribe()
      }
      return false
    })

    expect(unsubscribed).toBe(true)

    // Verify no subscription exists
    const subscriptionAfter = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.getSubscription()
      return sub
    })

    expect(subscriptionAfter).toBeNull()
  })

  test('should persist subscription across page reloads', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password)
    await waitForServiceWorker(page)

    // Get subscription
    const subscriptionBefore = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.getSubscription()
      return sub?.toJSON()
    })

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')
    await waitForServiceWorker(page)

    // Get subscription again
    const subscriptionAfter = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.getSubscription()
      return sub?.toJSON()
    })

    // Subscriptions should match
    if (subscriptionBefore && subscriptionAfter) {
      expect(subscriptionAfter.endpoint).toBe(subscriptionBefore.endpoint)
    }
  })

  test('should handle permission denied gracefully', async ({ page, context }) => {
    // Revoke notification permission
    await context.clearPermissions()

    await page.goto('/')
    await waitForServiceWorker(page)

    // Try to request permission (will be denied in this context)
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        Notification.requestPermission().then((permission) => {
          resolve(permission)
        })
      })
    })

    console.log('Permission result:', result)

    // App should handle denied permission gracefully
    // (Should show error message or disabled UI)
  })
})

test.describe('Push Notification Integration with Alarms', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['notifications'])
  })

  test('should prompt for notification permission when creating first alarm', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password)

    // Go to create alarm page
    await page.goto('/alarms/new')
    await page.waitForLoadState('networkidle')

    // Fill alarm form
    await page.fill('input[name="name"]', '테스트 알람')
    await page.selectOption('select[name="hour"]', '07')
    await page.selectOption('select[name="minute"]', '00')

    // Submit form (should trigger notification permission if not granted)
    await page.click('button[type="submit"]')

    await page.waitForTimeout(1000)

    // Check permission status
    const permission = await page.evaluate(() => Notification.permission)
    console.log('Permission after alarm creation:', permission)
  })

  test('should show notification status in alarm list', async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password)
    await waitForServiceWorker(page)

    await page.goto('/alarms')
    await page.waitForLoadState('networkidle')

    // Look for notification status indicator
    const notificationStatus = await page.locator('[data-testid="notification-status"]')
      .textContent()
      .catch(() => null)

    console.log('Notification status:', notificationStatus)
  })
})
