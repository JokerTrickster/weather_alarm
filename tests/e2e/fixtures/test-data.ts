/**
 * Test data fixtures for E2E tests
 */

export const TEST_USERS = {
  primary: {
    email: 'test@example.com',
    password: 'Test123!@#',
    name: 'Test User',
  },
  secondary: {
    email: 'test2@example.com',
    password: 'Test456!@#',
    name: 'Test User 2',
  },
}

export const TEST_ALARMS = {
  morning: {
    name: '아침 날씨',
    hour: '07',
    minute: '00',
    days: [1, 2, 3, 4, 5], // Monday to Friday
    location: {
      sido: '서울특별시',
      sigungu: '강남구',
    },
  },
  evening: {
    name: '저녁 날씨',
    hour: '18',
    minute: '30',
    days: [1, 2, 3, 4, 5, 6, 7], // All days
    location: {
      sido: '경기도',
      sigungu: '성남시',
    },
  },
}

export const TEST_NOTIFICATIONS = {
  weatherAlert: {
    title: '날씨 알람',
    body: '오늘 비가 올 예정입니다. 우산을 챙기세요!',
    icon: '/icon-192.png',
  },
  testPush: {
    title: '테스트 알림',
    body: '푸시 알림이 정상적으로 작동합니다.',
    icon: '/icon-192.png',
  },
}

export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''

/**
 * Mock VAPID key for testing (if real key is not available)
 * Note: This is a dummy key and won't work with real push service
 */
export const MOCK_VAPID_PUBLIC_KEY =
  'BEl62iUYgUivxIkv69yViEuiBIa-Ib37gRxH-hJPLmfUDON9SCPyD2-YqPLnJRjqYJPHrqZ6f0RqKGZ2EgJSs0k'
