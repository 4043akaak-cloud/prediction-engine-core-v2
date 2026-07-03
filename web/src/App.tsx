import React from 'react'
import PredictionResultCard from './components/PredictionResultCard'

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState<'home' | 'prediction'>('home')
  const [userQuestion, setUserQuestion] = React.useState('')

  const handlePredict = () => {
    if (userQuestion.trim()) {
      setCurrentScreen('prediction')
    }
  }

  const handleBackToHome = () => {
    setCurrentScreen('home')
    setUserQuestion('')
  }

  if (currentScreen === 'prediction') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Back Button */}
        <div className="px-4 py-4 border-b border-gray-200">
          <button
            onClick={handleBackToHome}
            className="text-gray-600 hover:text-gray-900 font-semibold"
          >
            ← Back
          </button>
        </div>

        {/* Prediction Screen Content */}
        <div className="flex-1 px-4 py-8">
          <div className="w-full max-w-2xl mx-auto space-y-8">
            {/* Question Section */}
            <div className="pb-8 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-600 mb-3">Question</h2>
              <p className="text-lg text-gray-900">{userQuestion}</p>
            </div>

            {/* Prediction Result Card */}
            <PredictionResultCard
              prediction="High"
              confidence="82%"
              reason="Short explanation describing why this prediction was selected."
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl text-center">
          {/* Project Name */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Prediction Engine Core
          </h1>

          {/* Tagline */}
          <div className="mb-8">
            <p className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
              Predict Better.
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-gray-900">
              Decide Better.
            </p>
          </div>

          {/* Mission Statement */}
          <p className="text-lg md:text-xl text-gray-600 mb-12">
            Prediction Engine Core is a tool to reduce uncertainty about the future.
          </p>

          {/* Input and Button */}
          <div className="space-y-4">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePredict()}
              placeholder="Ask anything about the future..."
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
            <button onClick={handlePredict} className="w-full px-6 py-4 text-lg font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              Predict
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
