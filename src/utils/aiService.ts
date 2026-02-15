import { characterPrompt } from './characterDialogue'

const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIResponse {
  text: string
  emotion: 'mild' | 'concerned' | 'furious' | 'despair'
}

let conversationHistory: Message[] = []

export const initConversation = () => {
  conversationHistory = [
    {
      role: 'system',
      content: characterPrompt
    }
  ]
}

export const getApiKey = (): string | null => {
  return localStorage.getItem('zhipu_api_key')
}

export const setApiKey = (key: string) => {
  localStorage.setItem('zhipu_api_key', key)
}

export const hasApiKey = (): boolean => {
  return !!getApiKey()
}

const detectEmotion = (text: string): 'mild' | 'concerned' | 'furious' | 'despair' => {
  if (text.includes('愤怒') || text.includes('暴怒') || text.includes('！！') || text.includes('契约者！')) {
    return 'furious'
  }
  if (text.includes('绝望') || text.includes('哭泣') || text.includes('......') || text.includes('无话可说')) {
    return 'despair'
  }
  if (text.includes('担忧') || text.includes('痛心') || text.includes('警惕') || text.includes('认真')) {
    return 'concerned'
  }
  return 'mild'
}

export const sendMessage = async (userMessage: string): Promise<AIResponse> => {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    throw new Error('请先配置智谱 AI API Key')
  }

  conversationHistory.push({
    role: 'user',
    content: userMessage
  })

  try {
    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: conversationHistory,
        temperature: 0.8,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `API 请求失败: ${response.status}`)
    }

    const data = await response.json()
    const assistantMessage = data.choices?.[0]?.message?.content || '...'
    
    conversationHistory.push({
      role: 'assistant',
      content: assistantMessage
    })

    return {
      text: assistantMessage,
      emotion: detectEmotion(assistantMessage)
    }
  } catch (error) {
    conversationHistory.pop()
    throw error
  }
}

export const sendTimeReport = async (minutes: number): Promise<AIResponse> => {
  const hour = new Date().getHours()
  let timeContext = ''
  
  if (hour >= 0 && hour < 5) {
    timeContext = '现在是深夜，用户在这个时间从短视频中挣脱出来'
  } else if (hour >= 5 && hour < 9) {
    timeContext = '现在是清晨，用户本该开始新的一天'
  } else if (hour >= 9 && hour < 12) {
    timeContext = '现在是上午，工作时间'
  } else if (hour >= 12 && hour < 18) {
    timeContext = '现在是下午，白昼正在流逝'
  } else if (hour >= 18 && hour < 22) {
    timeContext = '现在是傍晚，本该是修炼灵魂的时刻'
  } else {
    timeContext = '现在是夜晚'
  }

  const message = `[情境：${timeContext}]
用户刚刚从短视频平台（你称之为"吞噬灵魂的深渊"）中退出，坦白自己浪费了 ${minutes} 分钟。
请以热血中二少年的身份，对这个时间做出回应。要求：
1. 根据时间长度给出不同程度的反应（15分钟内温和提醒，30分钟关切，60分钟愤怒，超过60分钟绝望但永不放弃）
2. 使用戏剧化的语言，包含"契约者"、"深渊"、"灵魂碎片"等词汇
3. 结尾要引导用户进入下一步（提取意义碎片）
4. 保持傲娇但关心的性格`

  return sendMessage(message)
}

export const sendMeaningExtraction = async (
  fragments: string[], 
  timeWasted: number,
  isEmpty: boolean
): Promise<AIResponse> => {
  let message = ''
  
  if (isEmpty) {
    message = `用户声称在 ${timeWasted} 分钟的深渊漂流中"没有发现任何有意义的东西"。
请以热血中二少年的身份，表达你的不满和失望，但绝不能放弃用户！
要求：
1. 情绪要激烈（愤怒或绝望）
2. 强调"即使是最荒诞的内容也必有触动灵魂的刹那"
3. 鼓励用户再想想，找出哪怕一个笑点、一个惊讶
4. 使用戏剧化语言`
  } else {
    const fragmentText = fragments.map((f, i) => `${i + 1}. ${f}`).join('\n')
    message = `用户在 ${timeWasted} 分钟的深渊漂流后，找到了以下灵魂碎片：
${fragmentText}

请以热血中二少年的身份，对这些发现做出回应。
要求：
1. 肯定用户的努力，即使碎片很少
2. 强调"主动提取意义"本身就是觉醒的开始
3. 引导用户进入涅槃计划阶段
4. 保持热血和鼓励的语气`
  }

  return sendMessage(message)
}

export const resetConversation = () => {
  initConversation()
}
