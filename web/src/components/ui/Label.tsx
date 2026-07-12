import React from 'react'

interface LabelProps {
  children: React.ReactNode
  className?: string
}

export function Label({ children, className = '' }: LabelProps) {
  return <p className={`text-sm font-semibold text-gray-600 mb-2 ${className}`}>{children}</p>
}
