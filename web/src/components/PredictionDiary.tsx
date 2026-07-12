import React from 'react'
import PredictionDiaryEntry from './PredictionDiaryEntry'

interface DiaryEntryData {
  id: string
  question: string
  prediction: string
  confidence: string
  timestamp: string
}

interface DiarySection {
  title: string
  entries: DiaryEntryData[]
}

export default function PredictionDiary() {
  // Placeholder data
  const diarySections: DiarySection[] = [
    {
      title: 'Today',
      entries: [
        {
          id: '1',
          question: 'Will Company X rise tomorrow?',
          prediction: 'High',
          confidence: '82%',
          timestamp: '09:42',
        },
      ],
    },
    {
      title: 'Yesterday',
      entries: [
        {
          id: '2',
          question: 'Will Team A win tonight?',
          prediction: 'Low',
          confidence: '64%',
          timestamp: '18:13',
        },
      ],
    },
    {
      title: 'Older',
      entries: [
        {
          id: '3',
          question: 'Will Lotto numbers include 17?',
          prediction: 'Possible',
          confidence: '41%',
          timestamp: '21:56',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-6 border-b border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Prediction Diary</h1>
      </div>

      {/* Diary Content */}
      <div className="flex-1 px-4 py-8">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          {diarySections.map((section) => (
            <div key={section.title}>
              {/* Section Title */}
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
                {section.title}
              </h2>

              {/* Section Entries */}
              <div className="space-y-6">
                {section.entries.map((entry) => (
                  <PredictionDiaryEntry key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
