'use client'

import { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export function Toast({
  message,
  type,
  onClose,
  duration = 3000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const onCloseRef = useRef(onClose)
  const fadeOutTimerRef = useRef<NodeJS.Timeout>()

  // Keep onCloseRef current
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    setIsVisible(true)

    const timer = setTimeout(() => {
      setIsVisible(false)
      fadeOutTimerRef.current = setTimeout(() => {
        onCloseRef.current()
      }, 300) // Wait for fade out animation
    }, duration)

    return () => {
      clearTimeout(timer)
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current)
      }
    }
  }, [duration])

  return (
    <div
      className={clsx(
        'fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-lg p-4 shadow-lg transition-opacity duration-300',
        {
          'bg-success text-white': type === 'success',
          'bg-error text-white': type === 'error',
          'bg-primary-600 text-white': type === 'info',
          'opacity-100': isVisible,
          'opacity-0': !isVisible,
        }
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false)
            fadeOutTimerRef.current = setTimeout(() => {
              onCloseRef.current()
            }, 300)
          }}
          className="min-h-touch min-w-touch flex items-center justify-center"
          aria-label="닫기"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
