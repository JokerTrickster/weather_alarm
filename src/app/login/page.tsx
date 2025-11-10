'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Toast } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
import { validateEmail, validatePassword } from '@/utils/validation'
import { formatErrorMessage } from '@/utils/error'
import { ROUTES, SUCCESS_MESSAGES } from '@/constants'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast, showSuccess, showError, hideToast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError })
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      await login({ email, password })
      showSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS)
      timeoutRef.current = setTimeout(() => router.push(ROUTES.ALARMS), 500)
    } catch (error) {
      showError(formatErrorMessage(error, '로그인에 실패했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">날씨 알람</h1>
          <p className="mt-2 text-gray-600">
            매일 아침 날씨 정보를 받아보세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="이메일"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            type="password"
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={!email || !password}
          >
            로그인
          </Button>
        </form>

        <div className="space-y-4 text-center text-sm">
          <Link
            href={ROUTES.RESET_PASSWORD}
            className="block text-primary-600 hover:underline"
          >
            비밀번호 찾기
          </Link>

          <p className="text-gray-600">
            계정이 없으신가요?{' '}
            <Link
              href={ROUTES.REGISTER}
              className="font-medium text-primary-600 hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>

      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  )
}
