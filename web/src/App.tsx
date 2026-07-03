import React from 'react'
import PredictionResultCard from './components/PredictionResultCard'
import PredictionDiary from './components/PredictionDiary'
import Navigation from './components/Navigation'
import PredictionInputExperience from './components/PredictionInputExperience'

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState<'home' | 'input' | 'prediction' | 'diary'>('home')
  const [userQuestion, setUserQuestion] = React.useState('')

  const handleNavigate = (page: 'home' | 'prediction' | 'diary') => {
    setCurrentScreen(page)
    setUserQuestion('')
  }

  const handleStartPrediction = () => {
    setCurrentScreen('input')
  }

  const handlePredict = (question: string) => {
    setUserQuestion(question)
    setCurrentScreen('prediction')
  }

  const handleBackToHome = () => {
    handleNavigate('home')
  }

  const handleOpenDiary = () => {
    handleNavigate('diary')
  }

  const handleBackFromDiary = () => {
    handleNavigate('home')
  }

  if (currentScreen === 'input') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Navigation */}
        <Navigation currentPage="home" onNavigate={handleNavigate} />

        {/* Prediction Input Experience */}
        <PredictionInputExperience onPredict={handlePredict} />
      </div>
    )
  }

  if (currentScreen === 'diary') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Navigation */}
        <Navigation currentPage="diary" onNavigate={handleNavigate} />

        {/* Diary Content */}
        <PredictionDiary />
      </div>
    )
  }

  if (currentScreen === 'prediction') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Navigation */}
        <Navigation currentPage="prediction" onNavigate={handleNavigate} />

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
      {/* Navigation */}
      <Navigation currentPage="home" onNavigate={handleNavigate} />

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
              onKeyPress={(e) => e.key === 'Enter' && handleStartPrediction()}
              placeholder="Ask anything about the future..."
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
            <button onClick={handleStartPrediction} className="w-full px-6 py-4 text-lg font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              Predict
            </button>
            <button onClick={handleOpenDiary} className="w-full px-6 py-4 text-lg font-semibold text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              View Diary
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
