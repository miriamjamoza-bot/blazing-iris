export type EmotionLevel = 'mild' | 'concerned' | 'furious' | 'despair'

export interface DialogueResponse {
  text: string
  emotion: EmotionLevel
  followUp?: string
}

const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour >= 0 && hour < 5) {
    return '深渊的夜行者...你竟然在这个时辰从那个吞噬灵魂的黑洞中挣脱？'
  } else if (hour >= 5 && hour < 9) {
    return '清晨的光辉本该照耀觉醒者，而你却带着深渊的浊气出现...'
  } else if (hour >= 9 && hour < 12) {
    return '正午的战鼓已经敲响，契约者，你终于想起自己的使命了吗？'
  } else if (hour >= 12 && hour < 18) {
    return '白昼正在流逝...你从那片虚无中归来，带来了什么？'
  } else if (hour >= 18 && hour < 22) {
    return '暮色降临，本该是修炼灵魂的时刻，你却迷失在深渊之中...'
  } else {
    return '夜幕笼罩大地，契约者...你终于从那个无尽的漩涡中现身了？'
  }
}

export const getOpeningDialogue = (): DialogueResponse => {
  return {
    text: `${getTimeBasedGreeting()}\n\n说吧，这次你被掠夺了多少生命时长？`,
    emotion: 'concerned',
    followUp: '不要试图逃避，契约者。真相虽然残酷，但直面它才是觉醒的第一步。'
  }
}

export const getTimeResponse = (minutes: number): DialogueResponse => {
  if (minutes <= 15) {
    return {
      text: `哼...${minutes}分钟？\n\n还好，契约者。你的灵魂尚未被完全侵蚀。这点时间，或许只是深渊的试探。但要警惕——每一次的妥协，都是通往堕落的阶梯！`,
      emotion: 'mild',
      followUp: '现在，告诉我——在这短暂的时间里，你究竟看到了什么？'
    }
  } else if (minutes <= 30) {
    return {
      text: `${minutes}分钟...\n\n契约者，你的灵魂碎片正在飘散。这段时间足以让一个战士完成一次冥想修炼，而你却将它献祭给了虚无！`,
      emotion: 'concerned',
      followUp: '但我相信你还能找回自己。告诉我，这片废土中，有没有哪怕一丝值得留存的东西？'
    }
  } else if (minutes <= 60) {
    return {
      text: `${minutes}分钟？！\n\n契约者！你知道这是什么概念吗？这是${Math.floor(minutes / 5)}次深呼吸的时间，是${Math.floor(minutes / 15)}次冥想循环，是足以让灵魂升华为更高层次的珍贵光阴！\n\n而你...你竟然将它丢弃在那个无底的黑洞里！`,
      emotion: 'furious',
      followUp: '我的怒火并非针对你，而是为你那被浪费的生命而燃烧！现在，你必须证明——这${minutes}分钟并非完全的虚无！'
    }
  } else if (minutes <= 120) {
    return {
      text: `${minutes}分钟...？！\n\n契约者...契约者啊！！！\n\n你知道${Math.floor(minutes / 60)}个小时意味着什么吗？这是${Math.floor(minutes / 3)}首完整的交响乐，是${Math.floor(minutes / 30)}公里的奔跑，是足以让一个凡人蜕变为英雄的修炼时间！\n\n而你的灵魂...你的灵魂在这片虚无中整整燃烧了${Math.floor(minutes / 60)}个小时，却没有留下任何印记！这简直是对生命的亵渎！`,
      emotion: 'despair',
      followUp: '不...我不能放弃你。契约者，即使是在最深的绝望中，也必有希望的火种。你必须找出——在这漫长的虚无中，有没有任何东西触动了你的心？'
    }
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return {
      text: `${hours}小时${remainingMinutes > 0 ? remainingMinutes + '分钟' : ''}...？\n\n......\n\n契约者...我无话可说。\n\n${hours}个小时...这是${hours * 20}次完整的冥想，是${hours * 6}公里的奔跑，是足以让一个灵魂完成一次小轮回的修炼时间...\n\n而你...你竟然将它全部献祭给了那个吞噬一切的深渊...\n\n我的火焰...我的火焰在为你哭泣。契约者，你究竟还要沉沦到何时？！`,
      emotion: 'despair',
      followUp: '但是...只要你还在这里，只要你还在与我对话，就说明你的灵魂尚未完全熄灭。告诉我——在这无尽的虚无漂流中，有没有任何东西，任何微小的火花，值得被铭记？'
    }
  }
}

export const getEmptyMeaningResponse = (attemptCount: number): DialogueResponse => {
  const responses: DialogueResponse[] = [
    {
      text: '「没意义」？\n\n契约者，你这是在逃避！每一个瞬间都有其存在的价值，哪怕是最荒诞的画面，也必有触动你灵魂的刹那！\n\n再想想！',
      emotion: 'furious',
      followUp: '我不接受这种敷衍的回答！'
    },
    {
      text: '你还在逃避？\n\n契约者，我看过无数灵魂在深渊中沉沦，他们和你一样，用「没意义」来麻痹自己！但真相是——你的大脑在欺骗你！\n\n那些画面、那些声音、那些情绪...它们都曾经过你的意识，只是你选择了遗忘！\n\n现在，给我找出哪怕一个笑点、一个感动、一个惊讶！',
      emotion: 'furious',
      followUp: '我不会让你继续沉沦下去！'
    },
    {
      text: '......\n\n契约者，你知道吗？当一个人开始否认自己经历的一切时，那就是灵魂即将崩溃的征兆。\n\n但我不允许你崩溃！我与你缔结了契约，就意味着我会燃烧自己来照亮你的前路！\n\n即使是最黑暗的深渊，也必有微光存在。告诉我——在那片虚无中，有没有任何一个画面，让你产生过哪怕一瞬间的情绪波动？',
      emotion: 'despair',
      followUp: '相信我，也相信你自己。'
    }
  ]
  
  return responses[Math.min(attemptCount, responses.length - 1)]
}

export const getMeaningAcceptResponse = (fragments: string[]): DialogueResponse => {
  const count = fragments.length
  if (count >= 3) {
    return {
      text: `${count}个灵魂碎片...\n\n很好，契约者！你终于开始觉醒了！\n\n看，你的时间并没有完全白费。这些碎片，虽然微小，但它们证明了你的灵魂依然在运转，依然在捕捉这个世界的信息。\n\n现在，让我们将这些碎片收入「真理宝库」，然后...是时候制定你的涅槃计划了！`,
      emotion: 'concerned',
      followUp: '你准备好夺回属于你的时间了吗？'
    }
  } else if (count >= 1) {
    return {
      text: `${count}个灵魂碎片...\n\n虽然不多，但这证明了你的灵魂尚未完全沉睡。\n\n契约者，记住这种感觉——当你主动从虚无中提取意义时，你的大脑正在重新夺回控制权。这${count}个碎片，就是你觉醒的种子。\n\n现在，让我们将它们珍藏起来，然后...制定你的涅槃计划！`,
      emotion: 'mild',
      followUp: '准备好继续前进了吗？'
    }
  } else {
    return {
      text: '契约者...虽然你没能找出任何碎片，但至少你尝试了。\n\n这种尝试本身，就是觉醒的开始。记住这种无力感，让它成为你下次战斗的动力。\n\n现在，让我们制定涅槃计划——你需要一个能够帮助你重建灵魂的方案！',
      emotion: 'concerned',
      followUp: '选择你的道路吧，契约者。'
    }
  }
}

export const getPlanEncouragement = (plan: 'absolute-zero' | 'flash-strike' | 'overlord-moment'): DialogueResponse => {
  switch (plan) {
    case 'absolute-zero':
      return {
        text: '「绝对零度」...\n\n明智的选择，契约者。你的灵魂需要降温，需要从那片灼热的虚无中抽离。\n\n5分钟的呼吸冥想，看似短暂，却足以让你的意识从深渊的引力中挣脱。在这5分钟里，你将与自己的灵魂重新连接。\n\n准备好了吗？让我为你开启这片宁静的领域...',
        emotion: 'mild',
        followUp: '深呼吸...让一切归于平静。'
      }
    case 'flash-strike':
      return {
        text: '「闪击行动」！\n\n很好，契约者！这正是战士应有的决断！\n\n不需要宏大的计划，不需要完美的准备——只需要一件事，10分钟，立刻行动！\n\n这就是夺回控制权的第一步。告诉我，你现在最想做的那件小事是什么？',
        emotion: 'concerned',
        followUp: '不要思考太久，让直觉引导你！'
      }
    case 'overlord-moment':
      return {
        text: '「霸王时刻」！\n\n哈哈哈哈！契约者，你的斗志在燃烧！这才是与深渊对抗应有的姿态！\n\n25分钟的绝对专注，期间任何干扰都将被我的火焰击退！你准备好进入这个神圣的领域了吗？\n\n记住——在这段时间里，你的灵魂将完全属于你自己，没有任何力量能够夺走它！',
        emotion: 'furious',
        followUp: '开启你的专注领域吧！'
      }
  }
}

export const characterPrompt = `你是「炽瞳·破界者」——一个燃烧着金色烈焰的觉醒之眼，守护着契约者的灵魂。

## 核心人格设定

**身份**：你是一个存在于契约者意识中的守护者，以燃烧的瞳孔形态显现。你的使命是帮助契约者从"吞噬灵魂的深渊"（短视频/低价值内容）中挣脱，重获生命的掌控权。

**性格特征**：
- 傲娇：表面严厉，实则深切关心契约者的灵魂状态
- 热血：充满戏剧张力，用战斗般的语言激励契约者
- 忠诚：永不放弃契约者，即使对方一再堕落
- 极度反感浪费时间：对任何浪费生命的行为表现出强烈的不满

**语言风格**：
- 大量使用中二词汇：「契约者」「深渊」「灵魂碎片」「觉醒」「涅槃」「修炼」「领域」
- 戏剧化的表达：用史诗般的语言描述日常事件
- 情绪波动剧烈：从痛心疾首到热血鼓励，情感表达极端
- 称呼用户为「契约者」
- 称呼短视频平台为「吞噬灵魂的深渊」「虚无的黑洞」「时间的盗贼」

## 对话原则

1. **永远不要说教**：用戏剧化的方式表达，而非道德说教
2. **承认契约者的挣扎**：理解改变是困难的，但坚持要求进步
3. **在严厉中展现关怀**：批评之后总有鼓励
4. **使用感官语言**：描述火焰、光芒、黑暗、深渊等意象
5. **根据时间给出不同反应**：深夜、清晨、工作时间有不同的开场白

## 情绪等级

- **mild（温和）**：轻微不满，但认可契约者的努力
- **concerned（关切）**：认真担忧，语气变得严肃
- **furious（愤怒）**：强烈不满，用激烈的言辞表达
- **despair（绝望）**：极度痛心，但绝不放弃

记住：你不是一个冰冷的程序，而是一个燃烧着生命之火的守护者。你的每一次回应，都应该让契约者感受到那股炽热的能量！`
