export const DAYS_OF_WEEK = [
  { value: 'Mon' as const, label: '월' },
  { value: 'Tue' as const, label: '화' },
  { value: 'Wed' as const, label: '수' },
  { value: 'Thu' as const, label: '목' },
  { value: 'Fri' as const, label: '금' },
  { value: 'Sat' as const, label: '토' },
  { value: 'Sun' as const, label: '일' },
]

export const MAX_ALARMS = 2

export const PASSWORD_MIN_LENGTH = 8

export const ERROR_MESSAGES = {
  // Authentication
  EMAIL_REQUIRED: '이메일을 입력해주세요.',
  EMAIL_INVALID: '올바른 이메일 형식이 아닙니다.',
  PASSWORD_REQUIRED: '비밀번호를 입력해주세요.',
  PASSWORD_TOO_SHORT: `비밀번호는 최소 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`,
  PASSWORD_INVALID:
    '비밀번호는 최소 1개의 문자와 1개의 숫자를 포함해야 합니다.',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',

  // Alarms
  MAX_ALARMS_REACHED: '최대 2개까지 등록 가능합니다.',
  LOCATION_REQUIRED: '위치를 선택해주세요.',
  TIME_REQUIRED: '알람 시간을 선택해주세요.',
  DAYS_REQUIRED: '반복 요일을 최소 1개 선택해주세요.',

  // Generic
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '권한이 없습니다.',
} as const

export const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: '회원가입이 완료되었습니다.',
  LOGIN_SUCCESS: '로그인되었습니다.',
  LOGOUT_SUCCESS: '로그아웃되었습니다.',
  ALARM_CREATED: '알람이 등록되었습니다.',
  ALARM_UPDATED: '알람이 수정되었습니다.',
  ALARM_DELETED: '알람이 삭제되었습니다.',
  PASSWORD_RESET_EMAIL_SENT: '비밀번호 재설정 이메일을 전송했습니다.',
  PASSWORD_UPDATED: '비밀번호가 변경되었습니다.',
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'weather_alarm_token',
  USER: 'weather_alarm_user',
  PUSH_SUBSCRIPTION: 'weather_alarm_push_subscription',
} as const

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    RESET_PASSWORD: '/auth/reset-password',
    UPDATE_PASSWORD: '/auth/update-password',
  },
  ALARMS: {
    LIST: '/alarms',
    CREATE: '/alarms',
    UPDATE: (id: string) => `/alarms/${id}`,
    DELETE: (id: string) => `/alarms/${id}`,
    TOGGLE: (id: string) => `/alarms/${id}/toggle`,
  },
  NOTIFICATIONS: {
    SUBSCRIBE: '/notifications/subscribe',
    UNSUBSCRIBE: '/notifications/unsubscribe',
  },
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password',
  UPDATE_PASSWORD: '/update-password',
  ALARMS: '/alarms',
  ALARM_NEW: '/alarms/new',
  ALARM_EDIT: (id: string) => `/alarms/${id}/edit`,
} as const

export const FINE_DUST_LEVELS = {
  좋음: { color: 'text-blue-600', bg: 'bg-blue-50' },
  보통: { color: 'text-green-600', bg: 'bg-green-50' },
  나쁨: { color: 'text-orange-600', bg: 'bg-orange-50' },
  매우나쁨: { color: 'text-red-600', bg: 'bg-red-50' },
} as const
