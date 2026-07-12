import React from 'react'
import { Label, Value, ExpandableSection } from './ui'

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
  return (
    <div className="border-t border-gray-200 pt-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Counter Prediction</h3>
        <p className="text-sm text-gray-500">Alternative Scenario</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label>Prediction</Label>
          <Value size="md">{prediction}</Value>
        </div>

        <div>
          <Label>Confidence</Label>
          <Value size="sm">{confidence}</Value>
        </div>

        <div>
          <Label>Reason</Label>
          <p className="text-base text-gray-700 leading-relaxed">{reason}</p>
        </div>
      </div>

      <ExpandableSection title="Details">
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
      </ExpandableSection>
    </div>
  )
}
