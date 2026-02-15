import { useState, useEffect } from 'react'
import BlazingIris from './BlazingIris'
import { getOpeningDialogue, getTimeResponse, type DialogueResponse } from '../utils/characterDialogue'
import { sendTimeReport, type AIResponse } from '../utils/aiService'

interface SoulQuestioningProps {
  onSubmit: (minutes: number) => void
  aiEnabled: boolean
}

function SoulQuestioning({ onSubmit, aiEnabled }: SoulQuestioningProps) {
  const [phase, setPhase] = useState<'intro' | 'questioning' | 'response'>('intro')
  const [timeValue, setTimeValue] = useState(30)
  const [dialogue, setDialogue] = useState<DialogueResponse | null>(null)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (phase === 'intro') {
      const opening = getOpeningDialogue()
      setDialogue(opening)
      typeText(opening.text)
    }
  }, [phase])

  const typeText = (text: string) => {
    setIsTyping(true)
    setDisplayedText('')
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text[index])
        index++
      } else {
        clearInterval(interval)
        setIsTyping(false)
        if (phase === 'intro') {
          setPhase('questioning')
        }
      }
    }, 30)
  }

  const handleTimeSubmit = async () => {
    setError(null)
    
    if (aiEnabled) {
      setIsLoading(true)
      try {
        const response: AIResponse = await sendTimeReport(timeValue)
        setDialogue({
          text: response.text,
          emotion: response.emotion
        })
        setPhase('response')
        typeText(response.text)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'AI 响应失败，使用预设对话')
        const fallback = getTimeResponse(timeValue)
        setDialogue(fallback)
        setPhase('response')
        typeText(fallback.text)
      } finally {
        setIsLoading(false)
      }
    } else {
      const response = getTimeResponse(timeValue)
      setDialogue(response)
      setPhase('response')
      typeText(response.text)
    }
  }

  const handleContinue = () => {
    onSubmit(timeValue)
  }

  const getIrisIntensity = (): 'low' | 'medium' | 'high' => {
    if (isLoading) return 'low'
    if (phase === 'response' && dialogue?.emotion === 'furious') return 'high'
    if (phase === 'response' && dialogue?.emotion === 'despair') return 'high'
    return 'medium'
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-text-glow mb-2">
          炽瞳 · 破界者
        </h1>
        <p className="text-orange-400/60 text-sm tracking-widest">BLAZING IRIS: REALM BREAKER</p>
      </div>

      <BlazingIris size={280} intensity={getIrisIntensity()} />

      <div className="mt-8 max-w-lg w-full">
        <div className="bg-gradient-to-b from-[#1a0a0a] to-[#0a0505] border border-orange-500/30 rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
          
          <div className="absolute -top-10 -left-10 w-20 h-20 border border-orange-500/20 rotate-45" />
          <div className="absolute -bottom-10 -right-10 w-20 h-20 border border-orange-500/20 rotate-45" />
          
          <div className="min-h-[120px] relative">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="ml-3 text-orange-400">灵魂正在燃烧...</span>
              </div>
            ) : (
              <p className="text-orange-100 leading-relaxed whitespace-pre-line">
                {displayedText}
                {isTyping && <span className="animate-pulse text-orange-400">▌</span>}
              </p>
            )}
          </div>

          {dialogue?.followUp && !isTyping && phase === 'questioning' && (
            <p className="text-orange-400/70 text-sm mt-4 italic border-t border-orange-500/20 pt-4">
              「{dialogue.followUp}」
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 max-w-lg w-full">
          <p className="text-red-400 text-sm text-center bg-red-900/20 border border-red-500/30 rounded-lg p-2">
            ⚠️ {error}
          </p>
        </div>
      )}

      {phase === 'questioning' && !isTyping && (
        <div className="mt-8 w-full max-w-lg">
          <div className="bg-[#1a0a0a]/80 border border-orange-500/30 rounded-lg p-6 animate-rune-glow">
            <label className="block text-orange-300 text-sm mb-4 text-center">
              输入被掠夺的生命时长（分钟）
            </label>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 rounded-full blur-xl" />
              <input
                type="range"
                min="5"
                max="240"
                step="5"
                value={timeValue}
                onChange={(e) => setTimeValue(Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full appearance-none cursor-pointer relative z-10"
                style={{
                  background: `linear-gradient(to right, #f59e0b 0%, #f97316 ${(timeValue / 240) * 100}%, #374151 ${(timeValue / 240) * 100}%)`
                }}
              />
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => setTimeValue(Math.max(5, timeValue - 15))}
                className="w-10 h-10 rounded-full border border-orange-500/50 text-orange-400 hover:bg-orange-500/20 transition-all"
              >
                −
              </button>
              <div className="text-center">
                <span className="text-4xl font-bold text-orange-400">{timeValue}</span>
                <span className="text-orange-400/60 ml-2">分钟</span>
              </div>
              <button
                onClick={() => setTimeValue(Math.min(240, timeValue + 15))}
                className="w-10 h-10 rounded-full border border-orange-500/50 text-orange-400 hover:bg-orange-500/20 transition-all"
              >
                +
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {[15, 30, 60, 120].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setTimeValue(preset)}
                  className={`py-2 px-3 rounded border text-sm transition-all ${
                    timeValue === preset
                      ? 'bg-orange-500/30 border-orange-500 text-orange-300'
                      : 'border-orange-500/30 text-orange-400/60 hover:border-orange-500/50'
                  }`}
                >
                  {preset}分钟
                </button>
              ))}
            </div>

            <button
              onClick={handleTimeSubmit}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {isLoading ? '灵魂燃烧中...' : '坦白真相'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </div>
        </div>
      )}

      {phase === 'response' && !isTyping && !isLoading && (
        <div className="mt-8">
          <button
            onClick={handleContinue}
            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 animate-pulse"
          >
            继续前进 → 废土拾荒
          </button>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-orange-400/30 text-xs flex items-center gap-2">
        <span>版本 0.2.0</span>
        {aiEnabled && <span className="text-green-400/50">· AI 模式</span>}
      </div>
    </div>
  )
}

export default SoulQuestioning
