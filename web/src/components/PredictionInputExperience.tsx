import React from 'react'
import { Button, Input, Label } from './ui'

interface PredictionInputExperienceProps {
  onPredict: (question: string) => void
}

export default function PredictionInputExperience({ onPredict }: PredictionInputExperienceProps) {
  const [selectedType, setSelectedType] = React.useState('stocks')
  const [question, setQuestion] = React.useState('')

  const predictionTypes = ['Stocks', 'Sports', 'Lottery', 'Crypto', 'Weather']

  const examples = [
    'Will NVIDIA rise tomorrow?',
    "Who will win tomorrow's match?",
    'Will Bitcoin rise this week?',
    'Will the next Lotto draw include 17?',
  ]

  const handlePredict = () => {
    if (question.trim()) {
      onPredict(question)
    }
  }

  const handleExampleClick = (example: string) => {
    setQuestion(example)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-12">
          <div>
            <Label>Prediction Type</Label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
            >
              {predictionTypes.map((type) => (
                <option key={type} value={type.toLowerCase()}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Question</Label>
            <Input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePredict()}
              placeholder="Ask anything about the future..."
              autoFocus
            />

            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-600 font-semibold">Examples:</p>
              <div className="space-y-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    • {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
              onClick={handlePredict}
              disabled={!question.trim()}
              className="w-full"
            >
              Predict
            </Button>
        </div>
      </div>
    </div>
  )
}
