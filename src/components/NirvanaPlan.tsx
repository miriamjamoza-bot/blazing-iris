import { useState } from 'react'
import type { SessionData } from '../App'

interface NirvanaPlanProps {
  sessionData: SessionData
  onSelect: (plan: 'absolute-zero' | 'flash-strike' | 'overlord-moment') => void
  onReset: () => void
  onViewVault: () => void
}

function NirvanaPlan({ sessionData, onSelect, onReset, onViewVault }: NirvanaPlanProps) {
  const [, setSelectedPlan] = useState<'absolute-zero' | 'flash-strike' | 'overlord-moment' | null>(null)
  const [showBreathing, setShowBreathing] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [breathingCount, setBreathingCount] = useState(0)
  const [showFlashInput, setShowFlashInput] = useState(false)
  const [, setFlashTask] = useState('')
  const [showFocus, setShowFocus] = useState(false)
  const [focusTime, setFocusTime] = useState(25 * 60)
  const [focusActive, setFocusActive] = useState(false)

  const plans = [
    {
      id: 'absolute-zero' as const,
      name: '绝对零度',
      subtitle: 'Absolute Zero',
      description: '强制休息5分钟，让大脑从深渊的灼热中冷却',
      icon: '❄️',
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500/50',
      duration: '5分钟'
    },
    {
      id: 'flash-strike' as const,
      name: '闪击行动',
      subtitle: 'Flash Strike',
      description: '只做一件10分钟的小事，立刻行动',
      icon: '⚡',
      color: 'from-yellow-600 to-orange-600',
      borderColor: 'border-yellow-500/50',
      duration: '10分钟'
    },
    {
      id: 'overlord-moment' as const,
      name: '霸王时刻',
      subtitle: 'Overlord Moment',
      description: '25分钟绝对专注，期间任何干扰都将被击退',
      icon: '👑',
      color: 'from-purple-600 to-red-600',
      borderColor: 'border-purple-500/50',
      duration: '25分钟'
    }
  ]

  const handlePlanSelect = (planId: 'absolute-zero' | 'flash-strike' | 'overlord-moment') => {
    setSelectedPlan(planId)
    onSelect(planId)
    
    setTimeout(() => {
      switch (planId) {
        case 'absolute-zero':
          setShowBreathing(true)
          startBreathing()
          break
        case 'flash-strike':
          setShowFlashInput(true)
          break
        case 'overlord-moment':
          setShowFocus(true)
          break
      }
    }, 1000)
  }

  const startBreathing = () => {
    let count = 0
    let phase: 'inhale' | 'hold' | 'exhale' = 'inhale'
    const totalBreaths = 10
    
    const interval = setInterval(() => {
      count++
      if (phase === 'inhale' && count >= 4) {
        phase = 'hold'
        count = 0
        setBreathingPhase('hold')
      } else if (phase === 'hold' && count >= 4) {
        phase = 'exhale'
        count = 0
        setBreathingPhase('exhale')
      } else if (phase === 'exhale' && count >= 4) {
        phase = 'inhale'
        count = 0
        setBreathingPhase('inhale')
        setBreathingCount(prev => {
          if (prev + 1 >= totalBreaths) {
            clearInterval(interval)
            return totalBreaths
          }
          return prev + 1
        })
      }
    }, 1000)
  }

  const startFocusTimer = () => {
    setFocusActive(true)
    const interval = setInterval(() => {
      setFocusTime(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setFocusActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (showBreathing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div 
            className={`w-48 h-48 rounded-full border-4 transition-all duration-1000 flex items-center justify-center ${
              breathingPhase === 'inhale' 
                ? 'border-blue-400 scale-125 bg-blue-500/20' 
                : breathingPhase === 'hold'
                ? 'border-cyan-400 scale-125 bg-cyan-500/20'
                : 'border-blue-400/50 scale-100 bg-blue-500/10'
            }`}
          >
            <span className="text-4xl">
              {breathingPhase === 'inhale' ? '🌬️' : breathingPhase === 'hold' ? '⏸️' : '💨'}
            </span>
          </div>
          
          <p className="text-2xl font-bold text-blue-400 mt-8">
            {breathingPhase === 'inhale' ? '吸气...' : breathingPhase === 'hold' ? '屏住...' : '呼气...'}
          </p>
          
          <p className="text-blue-400/60 mt-2">
            呼吸循环 {breathingCount}/10
          </p>

          <button
            onClick={() => setShowBreathing(false)}
            className="mt-8 px-6 py-2 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/10"
          >
            结束冥想
          </button>
        </div>
      </div>
    )
  }

  if (showFlashInput) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <span className="text-6xl">⚡</span>
          <h2 className="text-2xl font-bold text-yellow-400 mt-4">闪击行动</h2>
          <p className="text-yellow-400/60 mt-2">选择一件10分钟内能完成的小事</p>
          
          <div className="mt-6 space-y-3">
            {['整理桌面', '喝杯水', '做几个深蹲', '写一段日记', '其他任务'].map((task) => (
              <button
                key={task}
                onClick={() => {
                  setFlashTask(task)
                  setShowFlashInput(false)
                }}
                className="w-full py-3 bg-[#1a0a0a] border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/10 transition-all"
              >
                {task}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (showFocus) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <span className="text-6xl">👑</span>
          <h2 className="text-2xl font-bold text-purple-400 mt-4">霸王时刻</h2>
          
          <div className="mt-8">
            <p className="text-6xl font-mono text-purple-300">
              {formatTime(focusTime)}
            </p>
          </div>

          {!focusActive ? (
            <button
              onClick={startFocusTimer}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-red-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-red-500"
            >
              开启专注领域
            </button>
          ) : (
            <p className="mt-8 text-purple-400/60">
              专注领域中...任何干扰都将被击退
            </p>
          )}

          <button
            onClick={() => setShowFocus(false)}
            className="mt-4 px-6 py-2 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/10"
          >
            结束专注
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-orange-400">涅槃计划</h2>
        <p className="text-orange-400/60 mt-2">选择你的重生之路</p>
      </div>

      <div className="bg-[#1a0a0a]/80 border border-orange-500/30 rounded-lg p-4 mb-6 max-w-lg w-full">
        <h3 className="text-orange-400 text-sm font-bold mb-2">📊 本次会话总结</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-orange-400/60">深渊时间</p>
            <p className="text-orange-300 font-bold">{sessionData.timeWasted} 分钟</p>
          </div>
          <div>
            <p className="text-orange-400/60">灵魂碎片</p>
            <p className="text-orange-300 font-bold">{sessionData.meaningFragments.length} 个</p>
          </div>
        </div>
        {sessionData.meaningFragments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-orange-500/20">
            <p className="text-orange-400/60 text-xs mb-1">收集的碎片：</p>
            {sessionData.meaningFragments.map((fragment, i) => (
              <p key={i} className="text-orange-300/80 text-xs">• {fragment}</p>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 max-w-lg w-full">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => handlePlanSelect(plan.id)}
            className={`relative p-4 bg-[#1a0a0a] border ${plan.borderColor} rounded-lg text-left hover:bg-[#1a0a0a]/80 transition-all group overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            
            <div className="relative flex items-start gap-4">
              <span className="text-3xl">{plan.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <span className="text-xs text-orange-400/60">{plan.duration}</span>
                </div>
                <p className="text-orange-400/40 text-xs">{plan.subtitle}</p>
                <p className="text-orange-400/70 text-sm mt-1">{plan.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 mt-8 max-w-lg w-full">
        <button
          onClick={onViewVault}
          className="flex-1 py-3 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/10 transition-all"
        >
          📚 真理宝库
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/10 transition-all"
        >
          🔄 重新开始
        </button>
      </div>
    </div>
  )
}

export default NirvanaPlan
