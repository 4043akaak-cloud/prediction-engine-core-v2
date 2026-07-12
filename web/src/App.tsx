import React from 'react'
import {
  Button,
  Input,
  SectionTitle,
  Label,
  Value,
  Divider,
  PageContainer,
  ContentContainer,
  CardContainer,
  ExpandableSection,
} from './components/ui'
import PredictionResultCard from './components/PredictionResultCard'
import PredictionDiary from './components/PredictionDiary'
import Navigation from './components/Navigation'
import PredictionInputExperience from './components/PredictionInputExperience'
import CounterPredictionCard from './components/CounterPredictionCard'

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
      <PageContainer>
        <Navigation currentPage="home" onNavigate={handleNavigate} />
        <PredictionInputExperience onPredict={handlePredict} />
      </PageContainer>
    )
  }

  if (currentScreen === 'diary') {
    return (
      <PageContainer>
        <Navigation currentPage="diary" onNavigate={handleNavigate} />
        <PredictionDiary />
      </PageContainer>
    )
  }

  if (currentScreen === 'prediction') {
    return (
      <PageContainer>
        <Navigation currentPage="prediction" onNavigate={handleNavigate} />
        <ContentContainer>
          <div className="pb-8 border-b border-gray-200">
            <Label>Question</Label>
            <p className="text-lg text-gray-900">{userQuestion}</p>
          </div>

          <PredictionResultCard
            prediction="High"
            confidence="82%"
            reason="Short explanation describing why this prediction was selected."
          />

          <CounterPredictionCard
            prediction="Low"
            confidence="38%"
            reason="This scenario was considered but not selected as the primary prediction."
          />
        </ContentContainer>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Navigation currentPage="home" onNavigate={handleNavigate} />

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl text-center">
          <SectionTitle level="h1" className="mb-8">
            Prediction Engine Core
          </SectionTitle>

          <div className="mb-8">
            <p className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
              Predict Better.
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-gray-900">
              Decide Better.
            </p>
          </div>

          <p className="text-lg md:text-xl text-gray-600 mb-12">
            Prediction Engine Core is a tool to reduce uncertainty about the future.
          </p>

          <div className="space-y-4">
            <Input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStartPrediction()}
              placeholder="Ask anything about the future..."
            />
            <Button onClick={handleStartPrediction} className="w-full">
              Predict
            </Button>
            <Button variant="secondary" onClick={handleOpenDiary} className="w-full">
              View Diary
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
