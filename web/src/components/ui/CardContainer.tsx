import React from 'react'

interface CardContainerProps {
  children: React.ReactNode
  className?: string
}

export function CardContainer({ children, className = '' }: CardContainerProps) {
  return (
    <div className={`bg-white border-t border-gray-200 pt-8 ${className}`}>{children}</div>
  )
}
