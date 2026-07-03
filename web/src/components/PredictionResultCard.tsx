import React from 'react'

interface PredictionResultCardProps {
  prediction: string
  confidence: string
  reason: string
}

export default function PredictionResultCard({
  prediction,
  confidence,
  reason,
}: PredictionResultCardProps) {
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [counterOpen, setCounterOpen] = React.useState(false)

  return (
    <div className="w-full space-y-8">
      {/* Prediction Result Card */}
      <div className="pb-8 border-b border-gray-200">
        {/* Prediction */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 font-semibold mb-2">Prediction</p>
          <p className="text-4xl md:text-5xl font-bold text-gray-900">{prediction}</p>
        </div>

        {/* Confidence */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 font-semibold mb-2">Confidence</p>
          <p className="text-2xl md:text-3xl font-semibold text-gray-900">{confidence}</p>
        </div>

        {/* Reason */}
        <div>
          <p className="text-sm text-gray-600 font-semibold mb-2">Reason</p>
          <p className="text-lg text-gray-700 leading-relaxed">{reason}</p>
        </div>
      </div>

      {/* Details Section (Collapsible) */}
      <div className="pb-8 border-b border-gray-200">
        <button
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-gray-600 w-full"
        >
          <span>{detailsOpen ? '▼' : '▶'}</span>
          <span>Details</span>
        </button>
        {detailsOpen && (
          <div className="mt-4 space-y-4 text-gray-600">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Previous Data</p>
              <p className="text-gray-500">—</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Prediction Models Used</p>
              <p className="text-gray-500">—</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Information Sources</p>
              <p className="text-gray-500">—</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Confidence Breakdown</p>
              <p className="text-gray-500">—</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Historical Context</p>
              <p className="text-gray-500">—</p>
            </div>
          </div>
        )}
      </div>

      {/* Counter Prediction Section (Collapsible) */}
      <div>
        <button
          onClick={() => setCounterOpen(!counterOpen)}
          className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-gray-600 w-full"
        >
          <span>{counterOpen ? '▼' : '▶'}</span>
          <span>Counter Prediction</span>
        </button>
        {counterOpen && (
          <div className="mt-4 text-gray-600">
            <p className="text-lg leading-relaxed">
              This section explains a reasonable alternative scenario and why it was not selected as the primary prediction.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
