import React from 'react'

interface SectionTitleProps {
  children: React.ReactNode
  level?: 'h1' | 'h2' | 'h3'
  className?: string
}

export function SectionTitle({ children, level = 'h2', className = '' }: SectionTitleProps) {
  const sizeStyles = {
    h1: 'text-5xl md:text-6xl font-bold',
    h2: 'text-3xl md:text-4xl font-bold',
    h3: 'text-2xl md:text-3xl font-semibold',
  }

  const Element = level

  return <Element className={`${sizeStyles[level]} text-gray-900 ${className}`}>{children}</Element>
}
