// 音效数据文件 - 用于演示和测试
// 在实际项目中，这些应该替换为真实的音频文件

const SoundData = {
  // 背景音乐信息
  backgroundMusic: {
    'main-theme': {
      name: '主旋律',
      description: '游戏主界面背景音乐',
      duration: '180s',
      genre: 'electronic',
      mood: 'uplifting'
    },
    'cooking-music': {
      name: '烹饪音乐',
      description: '烹饪过程中的背景音乐',
      duration: '120s',
      genre: 'ambient',
      mood: 'relaxing'
    },
    'result-music': {
      name: '结果音乐',
      description: '显示游戏结果的背景音乐',
      duration: '90s',
      genre: 'triumphant',
      mood: 'celebratory'
    }
  },
  
  // 交互音效信息
  soundEffects: {
    'card-flip': {
      name: '卡牌翻转',
      description: '卡牌翻转时的音效',
      duration: '0.3s',
      frequency: '800Hz',
      type: 'sfx'
    },
    'card-select': {
      name: '卡牌选择',
      description: '选择卡牌时的音效',
      duration: '0.2s',
      frequency: '1000Hz',
      type: 'sfx'
    },
    'card-deselect': {
      name: '卡牌取消选择',
      description: '取消选择卡牌时的音效',
      duration: '0.2s',
      frequency: '600Hz',
      type: 'sfx'
    },
    'button-click': {
      name: '按钮点击',
      description: '点击按钮时的音效',
      duration: '0.15s',
      frequency: '1200Hz',
      type: 'sfx'
    },
    'button-hover': {
      name: '按钮悬停',
      description: '鼠标悬停在按钮上时的音效',
      duration: '0.1s',
      frequency: '900Hz',
      type: 'sfx'
    },
    'success': {
      name: '成功音效',
      description: '操作成功时的音效',
      duration: '0.5s',
      frequency: '1500Hz',
      type: 'sfx'
    },
    'error': {
      name: '错误音效',
      description: '操作错误时的音效',
      duration: '0.4s',
      frequency: '400Hz',
      type: 'sfx'
    },
    'cooking-start': {
      name: '烹饪开始',
      description: '开始烹饪时的音效',
      duration: '0.8s',
      frequency: '800Hz',
      type: 'sfx'
    },
    'cooking-complete': {
      name: '烹饪完成',
      description: '烹饪完成时的音效',
      duration: '1.2s',
      frequency: '1200Hz',
      type: 'sfx'
    },
    'planet-change': {
      name: '星球变化',
      description: '星球状态变化时的音效',
      duration: '1.0s',
      frequency: '600Hz',
      type: 'sfx'
    },
    'achievement-unlock': {
      name: '成就解锁',
      description: '解锁成就时的音效',
      duration: '1.5s',
      frequency: '1800Hz',
      type: 'sfx'
    }
  },
  
  // 音效预设
  presets: {
    'default': {
      musicVolume: 0.3,
      soundVolume: 0.5,
      musicEnabled: true,
      soundEnabled: true
    },
    'mute': {
      musicVolume: 0,
      soundVolume: 0,
      musicEnabled: false,
      soundEnabled: false
    },
    'music-only': {
      musicVolume: 0.4,
      soundVolume: 0,
      musicEnabled: true,
      soundEnabled: false
    },
    'sound-only': {
      musicVolume: 0,
      soundVolume: 0.6,
      musicEnabled: false,
      soundEnabled: true
    }
  },
  
  // 音效主题
  themes: {
    'nature': {
      backgroundMusic: 'main-theme',
      soundEffects: ['card-flip', 'card-select', 'success', 'cooking-complete'],
      description: '自然主题，使用温和的音效'
    },
    'futuristic': {
      backgroundMusic: 'cooking-music',
      soundEffects: ['button-click', 'card-deselect', 'error', 'planet-change'],
      description: '未来主题，使用电子音效'
    },
    'celebration': {
      backgroundMusic: 'result-music',
      soundEffects: ['success', 'achievement-unlock', 'cooking-start'],
      description: '庆祝主题，使用欢快的音效'
    }
  },
  
  // 音效映射（用于不同场景）
  sceneMappings: {
    'intro': {
      backgroundMusic: 'main-theme',
      soundEffects: ['button-hover', 'button-click']
    },
    'selection': {
      backgroundMusic: 'main-theme',
      soundEffects: ['card-flip', 'card-select', 'card-deselect']
    },
    'cooking': {
      backgroundMusic: 'cooking-music',
      soundEffects: ['cooking-start', 'cooking-complete']
    },
    'result': {
      backgroundMusic: 'result-music',
      soundEffects: ['success', 'achievement-unlock', 'planet-change']
    }
  }
}

// 生成音效文件的函数（用于演示）
export const generateDemoSound = (frequency, duration, type = 'sine') => {
  // 在实际项目中，这里应该生成真实的音频文件
  // 这里只是返回一个占位符对象
  return {
    frequency,
    duration,
    type,
    url: `/assets/sounds/demo/${frequency}-${duration}s.mp3`
  }
}

// 获取音效推荐
export const getSoundRecommendations = (gameState) => {
  const recommendations = []
  
  if (gameState === 'menu') {
    recommendations.push('main-theme')
  } else if (gameState === 'playing') {
    recommendations.push('cooking-music')
  } else if (gameState === 'complete') {
    recommendations.push('result-music')
  }
  
  return recommendations
}

// 音效验证函数
export const validateSoundFiles = () => {
  const requiredSounds = [
    ...Object.keys(SoundData.backgroundMusic),
    ...Object.keys(SoundData.soundEffects)
  ]
  
  return requiredSounds.map(sound => ({
    name: sound,
    exists: false, // 在实际项目中应该检查文件是否存在
    url: `/assets/sounds/${sound}.mp3`
  }))
}

export default SoundData