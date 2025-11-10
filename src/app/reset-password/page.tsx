'use client'

import { useState } from 'react'
import Link from 'next/link'
import { authService } from '@/services/auth'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Toast } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
import { validateEmail } from '@/utils/validation'
import { ROUTES, SUCCESS_MESSAGES } from '@/constants'

export default function ResetPasswordPage() {
  const { toast, showSuccess, showError, hideToast } = useToast()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailError = validateEmail(email)

    if (emailError) {
      setError(emailError)
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await authService.resetPassword({ email })
      setIsSuccess(true)
      showSuccess(SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL_SENT)
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : '비밀번호 재설정 이메일 전송에 실패했습니다.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <svg
              className="h-8 w-8 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              이메일을 확인해주세요
            </h1>
            <p className="mt-2 text-gray-600">
              {email}로 비밀번호 재설정 링크를 보냈습니다.
            </p>
          </div>

          <Link href={ROUTES.LOGIN}>
            <Button fullWidth>로그인으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">비밀번호 찾기</h1>
          <p className="mt-2 text-gray-600">
            가입하신 이메일 주소를 입력해주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="이메일"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            autoComplete="email"
          />

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={!email}
          >
            재설정 링크 보내기
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-primary-600 hover:underline"
          >
            로그인으로 돌아가기
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
