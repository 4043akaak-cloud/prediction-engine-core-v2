import React from 'react'

interface NavigationProps {
  currentPage: 'home' | 'prediction' | 'diary'
  onNavigate: (page: 'home' | 'prediction' | 'diary') => void
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home', enabled: true },
    { id: 'prediction', label: 'Prediction', enabled: true },
    { id: 'diary', label: 'Diary', enabled: true },
    { id: 'community', label: 'Community', enabled: false },
    { id: 'marketplace', label: 'Marketplace', enabled: false },
    { id: 'pricing', label: 'Pricing', enabled: false },
    { id: 'about', label: 'About', enabled: false },
  ]

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="text-lg font-bold text-gray-900 hover:text-gray-600"
            >
              PEC
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.id}>
                {item.enabled ? (
                  <button
                    onClick={() => onNavigate(item.id as 'home' | 'prediction' | 'diary')}
                    className={`text-sm font-semibold transition-colors ${
                      currentPage === item.id
                        ? 'text-gray-900 border-b-2 border-gray-900 pb-4'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className="text-sm font-semibold text-gray-400 cursor-not-allowed">
                    {item.label}
                    <span className="text-xs text-gray-300 ml-1">(Coming Soon)</span>
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Placeholder */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
