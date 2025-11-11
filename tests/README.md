# E2E Testing for Weather Alarm

This directory contains end-to-end tests using Playwright to validate push notification functionality and user workflows.

## Prerequisites

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install chromium
```

### 3. Backend API Server

The E2E tests require a running backend API server with:

- User authentication endpoints (`/auth/register`, `/auth/login`)
- Alarm CRUD endpoints (`/alarms/*`)
- Push notification endpoints (`/notifications/subscribe`, `/notifications/unsubscribe`)
- VAPID keys configured for web push

### 4. Environment Variables

Create `.env.local` file in project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key_here
```

To generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

### 5. Test User Account

Create a test user account in your backend database or use the registration flow in tests:

- Email: `test@example.com`
- Password: `Test123!@#`

## Running Tests

### Run All E2E Tests

```bash
npm run test:e2e
```

### Run Push Notification Tests Only

```bash
npm run test:e2e:push
```

### Run Tests with UI Mode (Interactive)

```bash
npm run test:e2e:ui
```

This opens Playwright's interactive UI where you can:
- See all tests
- Run tests one by one
- Watch test execution in real-time
- Debug failing tests

### Run Tests in Debug Mode

```bash
npm run test:e2e:debug
```

### Run Tests in Headed Mode (Show Browser)

```bash
npm run test:e2e:headed
```

### View Test Report

```bash
npm run test:e2e:report
```

## Test Structure

```
tests/
├── e2e/
│   ├── push-notifications.spec.ts    # Push notification tests
│   ├── helpers/
│   │   ├── auth.helper.ts            # Authentication utilities
│   │   └── push.helper.ts            # Push notification utilities
│   └── fixtures/
│       └── test-data.ts              # Test data and constants
└── README.md                          # This file
```

## Test Coverage

### Push Notification Tests (`push-notifications.spec.ts`)

1. **Browser Support**
   - Check if push notifications are supported
   - Verify browser compatibility

2. **Service Worker**
   - Service worker registration on page load
   - Service worker activation
   - Service worker persistence

3. **Permission Management**
   - Request notification permission
   - Handle granted permission
   - Handle denied permission gracefully

4. **Push Subscription**
   - Subscribe to push notifications
   - Get existing subscription
   - Send subscription to backend API
   - Persist subscription across page reloads
   - Unsubscribe from push notifications

5. **Notification Handling**
   - Receive push notifications
   - Display notifications
   - Handle notification click events
   - Navigate on notification click

6. **Integration with Alarms**
   - Prompt for notification permission when creating alarm
   - Display notification status in alarm list
   - Link alarms with push subscriptions

## Helper Functions

### Authentication (`auth.helper.ts`)

- `login(page, email, password)` - Login to application
- `register(page, user)` - Register new user
- `logout(page)` - Logout from application
- `isAuthenticated(page)` - Check authentication status
- `getAuthToken(page)` - Get stored auth token

### Push Notifications (`push.helper.ts`)

- `waitForServiceWorker(page)` - Wait for service worker ready
- `isPushNotificationSupported(page)` - Check push support
- `getNotificationPermission(page)` - Get permission status
- `getPushSubscription(page)` - Get current subscription
- `subscribeToPush(page, vapidKey)` - Subscribe to push
- `unsubscribeFromPush(page)` - Unsubscribe from push
- `triggerTestPushNotification(page, notification)` - Trigger test push
- `isServiceWorkerActive(page)` - Check if SW is active
- `getServiceWorkerInfo(page)` - Get SW registration info

## Debugging Tests

### 1. Use Playwright Inspector

```bash
npm run test:e2e:debug
```

This opens the Playwright Inspector where you can:
- Step through test execution
- Inspect DOM elements
- View console logs
- Check network requests

### 2. Add `page.pause()` in Tests

Add this line in your test where you want to pause:

```typescript
await page.pause()
```

### 3. Enable Verbose Logging

Modify `playwright.config.ts`:

```typescript
use: {
  trace: 'on',
  screenshot: 'on',
  video: 'on',
}
```

### 4. Check Browser Console

Service worker logs and push notification events are logged to browser console.

## Common Issues

### 1. Service Worker Not Registering

**Symptoms**: Tests fail with "service worker not ready"

**Solutions**:
- Ensure dev server is running on `http://localhost:3000`
- Check that `public/sw.js` exists
- Verify service worker registration in `app/layout.tsx`
- Clear browser cache and service workers

### 2. Notification Permission Not Granted

**Symptoms**: Tests fail with "permission denied"

**Solutions**:
- Check `playwright.config.ts` has `permissions: ['notifications']`
- Use `context.grantPermissions(['notifications'])` in tests
- Ensure browser supports notifications

### 3. VAPID Key Error

**Symptoms**: "ApplicationServerKey is invalid" error

**Solutions**:
- Verify `NEXT_PUBLIC_VAPID_PUBLIC_KEY` is set correctly
- Ensure VAPID key is valid base64 string
- Check backend has matching private key
- Generate new VAPID keys if needed

### 4. Backend API Not Available

**Symptoms**: API calls fail with network errors

**Solutions**:
- Start backend API server before running tests
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check backend is accessible from test environment
- Use API mocking if backend is not available

### 5. Test User Not Found

**Symptoms**: Login fails with "invalid credentials"

**Solutions**:
- Create test user in backend database
- Use test registration flow to create user
- Verify test credentials match backend

## Continuous Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Start backend server
        run: |
          # Start your backend server here
          npm run start:backend &

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          NEXT_PUBLIC_API_BASE_URL: http://localhost:3001/api
          NEXT_PUBLIC_VAPID_PUBLIC_KEY: ${{ secrets.VAPID_PUBLIC_KEY }}

      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Best Practices

1. **Independent Tests**: Each test should be independent and not rely on other tests
2. **Clean State**: Reset application state between tests
3. **Explicit Waits**: Use `waitForLoadState`, `waitForSelector` instead of arbitrary timeouts
4. **Meaningful Assertions**: Add descriptive error messages to assertions
5. **Test Data**: Use fixtures for consistent test data
6. **Error Handling**: Handle expected errors gracefully
7. **Cleanup**: Unsubscribe and logout after tests

## Manual Testing Checklist

If automated tests are not sufficient, perform these manual checks:

1. **Initial Setup**
   - [ ] Open application in browser
   - [ ] Login with test account
   - [ ] Service worker registered successfully

2. **Permission Request**
   - [ ] Click notification enable button
   - [ ] Browser shows permission prompt
   - [ ] Grant permission
   - [ ] Permission status shows "granted"

3. **Subscription**
   - [ ] Create an alarm
   - [ ] Push subscription created automatically
   - [ ] Subscription sent to backend
   - [ ] Backend confirms subscription

4. **Receiving Notifications**
   - [ ] Trigger alarm (wait for scheduled time or use test endpoint)
   - [ ] Browser shows notification
   - [ ] Notification has correct title and body
   - [ ] Click notification
   - [ ] Application opens to alarms page

5. **Persistence**
   - [ ] Reload page
   - [ ] Subscription still exists
   - [ ] Notifications still work after reload

6. **Unsubscribe**
   - [ ] Disable notifications in settings
   - [ ] Subscription removed
   - [ ] No more notifications received

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [VAPID Protocol](https://datatracker.ietf.org/doc/html/rfc8292)
