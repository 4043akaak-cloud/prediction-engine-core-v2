import React from 'react'

interface ExpandableSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function ExpandableSection({ title, children, defaultOpen = false }: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className="border-t border-gray-200 pt-6 mt-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
      >
        <span className="text-lg">{isOpen ? '▼' : '▶'}</span>
        <span>{title}</span>
      </button>

      {isOpen && <div className="mt-4 space-y-3 text-gray-600">{children}</div>}
    </div>
  )
}
