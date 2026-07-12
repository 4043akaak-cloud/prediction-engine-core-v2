import React from 'react'

interface ContentContainerProps {
  children: React.ReactNode
  className?: string
}

export function ContentContainer({ children, className = '' }: ContentContainerProps) {
  return (
    <div className={`flex-1 px-4 py-8 ${className}`}>
      <div className="w-full max-w-2xl mx-auto space-y-8">{children}</div>
    </div>
  )
}
