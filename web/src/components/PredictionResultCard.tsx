import React from 'react'
import { Label, Value, ExpandableSection } from './ui'

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
  return (
    <div className="space-y-6">
      <div>
        <Label>Prediction</Label>
        <Value size="lg">{prediction}</Value>
      </div>

      <div>
        <Label>Confidence</Label>
        <Value>{confidence}</Value>
      </div>

      <div>
        <Label>Reason</Label>
        <p className="text-base text-gray-700 leading-relaxed">{reason}</p>
      </div>

      <ExpandableSection title="Details">
        <p className="text-sm">
          <span className="font-semibold">Previous Data</span>
        </p>
        <p className="text-sm">
          <span className="font-semibold">Prediction Models Used</span>
        </p>
        <p className="text-sm">
          <span className="font-semibold">Information Sources</span>
        </p>
        <p className="text-sm">
          <span className="font-semibold">Confidence Breakdown</span>
        </p>
      </ExpandableSection>

      <ExpandableSection title="Counter Prediction">
        <p className="text-sm text-gray-700">
          This section explains a reasonable alternative scenario and why it was not selected as the primary prediction.
        </p>
      </ExpandableSection>
    </div>
  )
}
