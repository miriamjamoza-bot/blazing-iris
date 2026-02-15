import { useState, useEffect } from 'react'

interface StoredFragment {
  id: string
  content: string
  timestamp: Date
  timeWasted: number
}

interface TruthVaultProps {
  onBack: () => void
}

function TruthVault({ onBack }: TruthVaultProps) {
  const [fragments, setFragments] = useState<StoredFragment[]>([])
  const [stats, setStats] = useState({
    totalFragments: 0,
    totalTimeWasted: 0,
    sessionsCount: 0
  })

  useEffect(() => {
    const stored = localStorage.getItem('truthVault')
    if (stored) {
      const parsed = JSON.parse(stored)
      setFragments(parsed.map((f: StoredFragment) => ({
        ...f,
        timestamp: new Date(f.timestamp)
      })))
      
      const totalFragments = parsed.reduce((acc: number) => acc + 1, 0)
      const totalTime = parsed.reduce((acc: number, f: StoredFragment) => acc + f.timeWasted, 0)
      const sessions = new Set(parsed.map((f: StoredFragment) => f.timestamp)).size
      
      setStats({
        totalFragments,
        totalTimeWasted: totalTime,
        sessionsCount: sessions
      })
    }
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const clearVault = () => {
    if (confirm('确定要清空真理宝库吗？所有灵魂碎片将永久消失。')) {
      localStorage.removeItem('truthVault')
      setFragments([])
      setStats({ totalFragments: 0, totalTimeWasted: 0, sessionsCount: 0 })
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="text-center mb-8">
        <span className="text-5xl">📚</span>
        <h2 className="text-3xl font-bold text-orange-400 mt-4">真理宝库</h2>
        <p className="text-orange-400/60 mt-2">你从深渊中抢救出的灵魂碎片</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg w-full">
        <div className="bg-[#1a0a0a] border border-orange-500/30 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-400">{stats.totalFragments}</p>
          <p className="text-orange-400/60 text-xs">灵魂碎片</p>
        </div>
        <div className="bg-[#1a0a0a] border border-orange-500/30 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-400">{Math.floor(stats.totalTimeWasted / 60)}h</p>
          <p className="text-orange-400/60 text-xs">深渊时间</p>
        </div>
        <div className="bg-[#1a0a0a] border border-orange-500/30 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-400">{stats.sessionsCount}</p>
          <p className="text-orange-400/60 text-xs">觉醒次数</p>
        </div>
      </div>

      {fragments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-orange-400/40 text-lg">宝库中空无一物...</p>
          <p className="text-orange-400/30 text-sm mt-2">开始你的第一次觉醒之旅吧</p>
        </div>
      ) : (
        <div className="max-w-lg w-full space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {fragments.map((fragment, index) => (
            <div
              key={fragment.id || index}
              className="bg-[#1a0a0a] border border-orange-500/30 rounded-lg p-4 relative group"
            >
              <div className="absolute top-2 right-2 text-orange-400/30 text-xs">
                {formatDate(fragment.timestamp)}
              </div>
              <p className="text-orange-100 pr-16">{fragment.content}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-orange-400/50">
                <span>⏱️ {fragment.timeWasted}分钟</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-8 max-w-lg w-full">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/10 transition-all"
        >
          ← 返回
        </button>
        {fragments.length > 0 && (
          <button
            onClick={clearVault}
            className="py-3 px-4 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
          >
            清空宝库
          </button>
        )}
      </div>
    </div>
  )
}

export default TruthVault
