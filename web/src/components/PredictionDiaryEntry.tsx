import React from 'react'

interface DiaryEntryData {
  id: string
  question: string
  prediction: string
  confidence: string
  timestamp: string
}

interface PredictionDiaryEntryProps {
  entry: DiaryEntryData
}

export default function PredictionDiaryEntry({ entry }: PredictionDiaryEntryProps) {
  return (
    <div className="pb-6 border-b border-gray-200 last:border-b-0">
      <div className="space-y-3">
        {/* Question */}
        <div>
          <p className="text-sm text-gray-600 font-semibold mb-1">Question</p>
          <p className="text-gray-900">{entry.question}</p>
        </div>

        {/* Prediction */}
        <div>
          <p className="text-sm text-gray-600 font-semibold mb-1">Prediction</p>
          <p className="text-xl font-semibold text-gray-900">{entry.prediction}</p>
        </div>

        {/* Confidence */}
        <div>
          <p className="text-sm text-gray-600 font-semibold mb-1">Confidence</p>
          <p className="text-gray-900">{entry.confidence}</p>
        </div>

        {/* Timestamp */}
        <div>
          <p className="text-sm text-gray-500">{entry.timestamp}</p>
        </div>
      </div>
    </div>
  )
}
