import { Page } from '@playwright/test'

/**
 * Authentication helper utilities for E2E tests
 */

export interface TestUser {
  email: string
  password: string
  name?: string
}

/**
 * Login to the application
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')

  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')

  // Wait for redirect to alarms page
  await page.waitForURL('/alarms', { timeout: 10000 })
  await page.waitForLoadState('networkidle')
}

/**
 * Register a new user account
 */
export async function register(page: Page, user: TestUser) {
  await page.goto('/register')
  await page.waitForLoadState('networkidle')

  if (user.name) {
    await page.fill('input[name="name"]', user.name)
  }
  await page.fill('input[type="email"]', user.email)
  await page.fill('input[type="password"]', user.password)

  await page.click('button[type="submit"]')

  // Wait for redirect after successful registration
  await page.waitForURL('/login', { timeout: 10000 })
}

/**
 * Logout from the application
 */
export async function logout(page: Page) {
  const logoutButton = page.locator('button:has-text("로그아웃")')
  if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await logoutButton.click()
    await page.waitForURL('/login', { timeout: 5000 })
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const token = await page.evaluate(() => localStorage.getItem('token'))
  return token !== null
}

/**
 * Get stored auth token
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  return page.evaluate(() => localStorage.getItem('token'))
}
