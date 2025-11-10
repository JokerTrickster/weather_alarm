import clsx from 'clsx'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className, onClick }: CardProps) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      className={clsx(
        'rounded-lg border border-gray-200 bg-white p-4 shadow-sm',
        {
          'transition-shadow hover:shadow-md cursor-pointer': onClick,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}
