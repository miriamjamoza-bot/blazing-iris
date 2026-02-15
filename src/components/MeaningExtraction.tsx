import { useState, useEffect } from 'react'
import BlazingIris from './BlazingIris'
import RuneInput from './RuneInput'
import { getMeaningAcceptResponse, getEmptyMeaningResponse } from '../utils/characterDialogue'
import { sendMeaningExtraction, type AIResponse } from '../utils/aiService'

interface MeaningExtractionProps {
  timeWasted: number
  onSubmit: (fragments: string[]) => void
  onBack: () => void
  aiEnabled: boolean
}

function MeaningExtraction({ timeWasted, onSubmit, onBack, aiEnabled }: MeaningExtractionProps) {
  const [fragments, setFragments] = useState<string[]>(['', '', ''])

  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emptyAttempts, setEmptyAttempts] = useState(0)
  const [showValidationError, setShowValidationError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const openingText = `契约者，现在进入「废土拾荒」阶段。\n\n你刚刚在深渊中度过了${timeWasted}分钟。虽然那段时光已经逝去，但你的意识必定捕捉到了什么。\n\n告诉我——在那片虚无中，你看到了什么值得铭记的东西？哪怕只是一个笑点、一个感动、一个惊讶...\n\n找出1-3个「灵魂碎片」，证明你的时间并非完全白费。`
    typeText(openingText)
  }, [timeWasted])

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
      }
    }, 25)
  }

  const handleFragmentChange = (index: number, value: string) => {
    const newFragments = [...fragments]
    newFragments[index] = value
    setFragments(newFragments)
    setShowValidationError(false)
  }

  const validateFragments = async (): Promise<boolean> => {
    const validFragments = fragments.filter(f => f.trim().length > 0)
    if (validFragments.length === 0) {
      if (aiEnabled) {
        setIsLoading(true)
        try {
          const response: AIResponse = await sendMeaningExtraction([], timeWasted, true)
          typeText(response.text)
        } catch {
          const fallback = getEmptyMeaningResponse(emptyAttempts)
          typeText(fallback.text)
        } finally {
          setIsLoading(false)
        }
      } else {
        const response = getEmptyMeaningResponse(emptyAttempts)
        typeText(response.text)
      }
      setEmptyAttempts(prev => prev + 1)
      setShowValidationError(true)
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!(await validateFragments())) return
    
    const validFragments = fragments.filter(f => f.trim().length > 0)
    setIsSubmitting(true)
    
    if (aiEnabled) {
      setIsLoading(true)
      try {
        const response: AIResponse = await sendMeaningExtraction(validFragments, timeWasted, false)
        typeText(response.text)
      } catch {
        const fallback = getMeaningAcceptResponse(validFragments)
        typeText(fallback.text)
      } finally {
        setIsLoading(false)
      }
    } else {
      const response = getMeaningAcceptResponse(validFragments)
      typeText(response.text)
    }
    
    setTimeout(() => {
      onSubmit(validFragments)
    }, 2500)
  }

  const handleSkip = async () => {
    if (!(await validateFragments())) return
    onSubmit(fragments.filter(f => f.trim().length > 0))
  }

  const filledCount = fragments.filter(f => f.trim().length > 0).length

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <BlazingIris size={120} intensity={isLoading ? 'low' : 'medium'} />
        <div>
          <h2 className="text-2xl font-bold text-orange-400">废土拾荒</h2>
          <p className="text-orange-400/60 text-sm">从虚无中提取灵魂碎片</p>
        </div>
      </div>

      <div className="max-w-lg w-full mb-6">
        <div className="bg-gradient-to-b from-[#1a0a0a] to-[#0a0505] border border-orange-500/30 rounded-lg p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="ml-3 text-orange-400 text-sm">灵魂碎片正在汇聚...</span>
            </div>
          ) : (
            <p className="text-orange-100 leading-relaxed whitespace-pre-line text-sm">
              {displayedText}
              {isTyping && <span className="animate-pulse text-orange-400">▌</span>}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-lg w-full space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-orange-400/60 text-sm">灵魂碎片 ({filledCount}/3)</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full border transition-all ${
                  fragments[i].trim().length > 0
                    ? 'bg-orange-500 border-orange-400'
                    : 'border-orange-500/30'
                }`}
              />
            ))}
          </div>
        </div>

        {fragments.map((fragment, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-2 top-4 w-4 h-4 flex items-center justify-center">
              <span className="text-orange-500/50 text-xs font-bold">{index + 1}</span>
            </div>
            <RuneInput
              value={fragment}
              onChange={(value) => handleFragmentChange(index, value)}
              placeholder={`灵魂碎片 #${index + 1}：你看到了什么...`}
            />
          </div>
        ))}

        {showValidationError && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 animate-pulse">
            <p className="text-red-400 text-sm">
              ⚠️ 契约者，你不能逃避！至少找出一个灵魂碎片！
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            disabled={isLoading || isSubmitting}
            className="flex-1 py-3 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/10 transition-all disabled:opacity-50"
          >
            ← 返回
          </button>
          <button
            onClick={handleSkip}
            disabled={isLoading || isSubmitting}
            className="flex-1 py-3 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/10 transition-all disabled:opacity-50"
          >
            跳过
          </button>
          <button
            onClick={handleSubmit}
            disabled={filledCount === 0 || isLoading || isSubmitting}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              filledCount > 0 && !isLoading && !isSubmitting
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '收入中...' : '收入宝库 →'}
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-[#1a0a0a]/50 border border-orange-500/20 rounded-lg max-w-lg w-full">
        <h3 className="text-orange-400 text-sm font-bold mb-2">💡 提示</h3>
        <p className="text-orange-400/60 text-xs">
          即使是最荒诞的内容，也必有触动你灵魂的刹那。一个笑点、一个知识点、一个感动、甚至一个"这也太离谱了"的惊讶——这些都是灵魂碎片。找出它们，证明你的时间并非完全白费。
        </p>
      </div>
    </div>
  )
}

export default MeaningExtraction
