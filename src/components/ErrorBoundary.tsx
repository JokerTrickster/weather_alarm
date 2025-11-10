'use client'

import { Component, type ReactNode } from 'react'
import { Button } from './Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                문제가 발생했습니다
              </h1>
              <p className="text-gray-600">
                일시적인 오류가 발생했습니다. 다시 시도해주세요.
              </p>
            </div>

            {this.state.error && process.env.NODE_ENV === 'development' && (
              <div className="rounded-lg bg-gray-100 p-4 text-left">
                <p className="text-sm font-mono text-gray-800">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button onClick={this.handleReset} fullWidth>
                다시 시도
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => window.location.href = '/'}
              >
                홈으로 이동
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
