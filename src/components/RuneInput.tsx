import { useState, useRef, useEffect } from 'react'

interface RuneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
}

function RuneInput({ value, onChange, placeholder = '在此刻下你的灵魂印记...', maxLength = 200 }: RuneInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [value])

  return (
    <div className={`relative ${isFocused ? 'animate-rune-glow' : ''}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-orange-500/50 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-orange-500/50 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-orange-500/50 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-orange-500/50 rounded-br-lg" />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="w-full h-full opacity-10">
          <defs>
            <pattern id="runePattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="15" fill="none" stroke="#f97316" strokeWidth="0.5" />
              <circle cx="20" cy="20" r="10" fill="none" stroke="#f97316" strokeWidth="0.3" />
              <line x1="20" y1="5" x2="20" y2="35" stroke="#f97316" strokeWidth="0.3" />
              <line x1="5" y1="20" x2="35" y2="20" stroke="#f97316" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#runePattern)" />
        </svg>
      </div>

      <div className="relative bg-[#0a0505]/80 border border-orange-500/30 rounded-lg p-4">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent text-orange-100 placeholder-orange-400/40 resize-none outline-none min-h-[80px] font-medium"
          rows={2}
        />

        <div className="flex justify-between items-center mt-2 text-xs text-orange-400/50">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500/50 animate-pulse" />
            符文阵列已激活
          </span>
          <span>{value.length}/{maxLength}</span>
        </div>
      </div>

      {isFocused && (
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 rounded-lg blur-sm -z-10" />
      )}
    </div>
  )
}

export default RuneInput
