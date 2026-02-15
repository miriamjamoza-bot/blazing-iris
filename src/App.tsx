import { useState, useEffect } from 'react'
import SoulQuestioning from './components/SoulQuestioning'
import MeaningExtraction from './components/MeaningExtraction'
import NirvanaPlan from './components/NirvanaPlan'
import TruthVault from './components/TruthVault'
import ApiKeySetup from './components/ApiKeySetup'
import { hasApiKey, initConversation, resetConversation } from './utils/aiService'

export type AppPhase = 'soul-questioning' | 'meaning-extraction' | 'nirvana-plan' | 'truth-vault'

export interface SessionData {
  timeWasted: number
  meaningFragments: string[]
  selectedPlan: 'absolute-zero' | 'flash-strike' | 'overlord-moment' | null
  timestamp: Date
}

function App() {
  const [phase, setPhase] = useState<AppPhase>('soul-questioning')
  const [showApiSetup, setShowApiSetup] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(false)
  const [sessionData, setSessionData] = useState<SessionData>({
    timeWasted: 0,
    meaningFragments: [],
    selectedPlan: null,
    timestamp: new Date()
  })

  useEffect(() => {
    const keyExists = hasApiKey()
    setAiEnabled(keyExists)
    
    if (!keyExists) {
      setShowApiSetup(true)
    } else {
      initConversation()
    }
  }, [])

  const handleApiConfigured = () => {
    setShowApiSetup(false)
    setAiEnabled(true)
    initConversation()
  }

  const handleApiSkip = () => {
    setShowApiSetup(false)
    setAiEnabled(false)
  }

  const handleTimeSubmit = (minutes: number) => {
    setSessionData(prev => ({ ...prev, timeWasted: minutes }))
    setPhase('meaning-extraction')
  }

  const handleMeaningSubmit = (fragments: string[]) => {
    setSessionData(prev => ({ ...prev, meaningFragments: fragments }))
    setPhase('nirvana-plan')
  }

  const handlePlanSelect = (plan: 'absolute-zero' | 'flash-strike' | 'overlord-moment') => {
    setSessionData(prev => ({ ...prev, selectedPlan: plan }))
  }

  const handleReset = () => {
    setSessionData({
      timeWasted: 0,
      meaningFragments: [],
      selectedPlan: null,
      timestamp: new Date()
    })
    setPhase('soul-questioning')
    if (aiEnabled) {
      resetConversation()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0505] via-[#1a0a0a] to-[#0a0505] text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setShowApiSetup(true)}
          className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
            aiEnabled 
              ? 'border-green-500/30 text-green-400 bg-green-500/10' 
              : 'border-orange-500/30 text-orange-400/60 hover:bg-orange-500/10'
          }`}
        >
          {aiEnabled ? '🤖 AI 已连接' : '⚙️ 配置 AI'}
        </button>
      </div>

      <div className="relative z-10">
        {phase === 'soul-questioning' && (
          <SoulQuestioning onSubmit={handleTimeSubmit} aiEnabled={aiEnabled} />
        )}
        {phase === 'meaning-extraction' && (
          <MeaningExtraction 
            timeWasted={sessionData.timeWasted} 
            onSubmit={handleMeaningSubmit}
            onBack={() => setPhase('soul-questioning')}
            aiEnabled={aiEnabled}
          />
        )}
        {phase === 'nirvana-plan' && (
          <NirvanaPlan 
            sessionData={sessionData}
            onSelect={handlePlanSelect}
            onReset={handleReset}
            onViewVault={() => setPhase('truth-vault')}
          />
        )}
        {phase === 'truth-vault' && (
          <TruthVault 
            onBack={() => setPhase('nirvana-plan')}
          />
        )}
      </div>

      {showApiSetup && (
        <ApiKeySetup 
          onConfigured={handleApiConfigured}
          onSkip={handleApiSkip}
        />
      )}
    </div>
  )
}

export default App
