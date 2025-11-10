'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Toast } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
} from '@/utils/validation'
import { formatErrorMessage } from '@/utils/error'
import { ROUTES, SUCCESS_MESSAGES } from '@/constants'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const { toast, showSuccess, showError, hideToast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    passwordConfirm?: string
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
    const passwordConfirmError = validatePasswordConfirm(
      password,
      passwordConfirm
    )

    if (emailError || passwordError || passwordConfirmError) {
      setErrors({
        email: emailError,
        password: passwordError,
        passwordConfirm: passwordConfirmError,
      })
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      await register({ email, password, passwordConfirm })
      showSuccess(SUCCESS_MESSAGES.REGISTER_SUCCESS)
      timeoutRef.current = setTimeout(() => router.push(ROUTES.ALARMS), 500)
    } catch (error) {
      showError(formatErrorMessage(error, '회원가입에 실패했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">회원가입</h1>
          <p className="mt-2 text-gray-600">날씨 알람 서비스에 가입하세요</p>
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
            placeholder="최소 8자, 문자와 숫자 포함"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
          />

          <Input
            type="password"
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력하세요"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            error={errors.passwordConfirm}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={!email || !password || !passwordConfirm}
          >
            회원가입
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-primary-600 hover:underline"
          >
            로그인
          </Link>
        </p>
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
