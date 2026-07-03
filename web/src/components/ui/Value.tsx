import React from 'react'

interface ValueProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Value({ children, size = 'md', className = '' }: ValueProps) {
  const sizeStyles = {
    sm: 'text-base',
    md: 'text-lg md:text-xl',
    lg: 'text-2xl md:text-3xl',
  }

  return <p className={`${sizeStyles[size]} font-semibold text-gray-700 ${className}`}>{children}</p>
}
