import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-gray-600 mb-2">{label}</label>}
      <input
        className={`w-full px-6 py-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  )
}
