import { useState, useEffect } from 'react'

interface ApiKeySetupProps {
  onConfigured: () => void
  onSkip: () => void
}

function ApiKeySetup({ onConfigured, onSkip }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    const savedKey = localStorage.getItem('zhipu_api_key')
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  const validateApiKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'glm-4-flash',
          messages: [{ role: 'user', content: '测试' }],
          max_tokens: 10
        })
      })
      return response.ok
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!apiKey.trim()) {
      setError('请输入 API Key')
      return
    }

    setIsValidating(true)
    setError(null)

    const isValid = await validateApiKey(apiKey.trim())
    
    if (isValid) {
      localStorage.setItem('zhipu_api_key', apiKey.trim())
      onConfigured()
    } else {
      setError('API Key 无效，请检查后重试')
    }
    
    setIsValidating(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-[#1a0a0a] to-[#0a0505] border border-orange-500/30 rounded-xl p-6 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        
        <div className="text-center mb-6">
          <span className="text-4xl">🔑</span>
          <h2 className="text-xl font-bold text-orange-400 mt-2">配置智谱 AI</h2>
          <p className="text-orange-400/60 text-sm mt-1">
            输入你的 API Key 以启用真实 AI 对话
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="请输入智谱 AI API Key"
              className="w-full bg-[#0a0505] border border-orange-500/30 rounded-lg px-4 py-3 text-orange-100 placeholder-orange-400/40 focus:border-orange-500 focus:outline-none pr-12"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400/60 hover:text-orange-400"
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isValidating}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? '验证中...' : '确认配置'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-orange-500/20">
          <p className="text-orange-400/50 text-xs text-center mb-3">
            没有 API Key？
          </p>
          <a
            href="https://open.bigmodel.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-orange-400 hover:text-orange-300 text-sm underline"
          >
            前往智谱 AI 开放平台获取 →
          </a>
        </div>

        <button
          onClick={onSkip}
          className="w-full mt-4 py-2 border border-orange-500/30 text-orange-400/60 rounded-lg hover:bg-orange-500/10 text-sm"
        >
          暂时跳过（使用预设对话）
        </button>

        <div className="mt-4 p-3 bg-[#0a0500] rounded-lg">
          <p className="text-orange-400/40 text-xs">
            💡 提示：API Key 仅存储在本地浏览器中，不会上传到任何服务器。
            智谱 AI 提供免费额度，足够日常使用。
          </p>
        </div>
      </div>
    </div>
  )
}

export default ApiKeySetup
