import React from 'react'

interface CounterPredictionCardProps {
  prediction: string
  confidence: string
  reason: string
}

export default function CounterPredictionCard({
  prediction,
  confidence,
  reason,
}: CounterPredictionCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)

  return (
    <div className="border-t border-gray-200 pt-8">
      {/* Counter Prediction Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Counter Prediction</h3>
        <p className="text-sm text-gray-500">Alternative Scenario</p>
      </div>

      {/* Counter Prediction Content */}
      <div className="space-y-6">
        {/* Prediction */}
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-2">Prediction</p>
          <p className="text-2xl md:text-3xl font-semibold text-gray-700">{prediction}</p>
        </div>

        {/* Confidence */}
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-2">Confidence</p>
          <p className="text-lg md:text-xl font-semibold text-gray-700">{confidence}</p>
        </div>

        {/* Reason */}
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-2">Reason</p>
          <p className="text-base text-gray-700 leading-relaxed">{reason}</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <button
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
        >
          <span className="text-lg">{isDetailsOpen ? '▼' : '▶'}</span>
          <span>Details</span>
        </button>

        {isDetailsOpen && (
          <div className="mt-4 space-y-3 text-gray-600">
            <p className="text-sm">
              <span className="font-semibold">Alternative Model Consensus</span>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Supporting Evidence</span>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Different Prediction Models</span>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Confidence Comparison</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
