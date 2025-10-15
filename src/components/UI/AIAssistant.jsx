import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import aiDialoguesData from '../../data/aiDialogues.json'
import styles from './AIAssistant.module.css'

const AIAssistant = ({ 
  currentScreen, 
  selectedFoods, 
  cookingResult, 
  dailyChallenge, 
  discoveredFoods,
  onClose 
}) => {
  const [currentDialogue, setCurrentDialogue] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // AI助手形象配置
  const assistantProfile = aiDialoguesData.assistantProfile

  // 获取适合当前场景的对话
  const getDialogue = () => {
    switch (currentScreen) {
      case 'intro':
        return getRandomDialogue(aiDialoguesData.introDialogues)
      
      case 'selection':
        return getSelectionDialogue()
      
      case 'cooking':
        return getRandomDialogue(aiDialoguesData.cookingDialogues)
      
      case 'result':
        return getResultDialogue()
      
      case 'encyclopedia':
        return getRandomDialogue(aiDialoguesData.encyclopediaDialogues)
      
      default:
        return null
    }
  }

  // 获取随机对话
  const getRandomDialogue = (dialogues) => {
    if (!dialogues || dialogues.length === 0) return null
    const randomIndex = Math.floor(Math.random() * dialogues.length)
    return dialogues[randomIndex]
  }

  // 获取食材选择阶段的对话
  const getSelectionDialogue = () => {
    // 检查是否有每日挑战
    if (dailyChallenge && selectedFoods.length > 0) {
      const challengeFoods = dailyChallenge.requiredFoods || []
      const hasChallengeFood = selectedFoods.some(food => 
        challengeFoods.includes(food.name)
      )
      
      if (hasChallengeFood) {
        return {
          id: 'challenge_progress',
          text: '很好！您正在朝着完成今日挑战的方向努力。继续添加挑战所需的食材！',
          emotion: '鼓励',
          sdgHighlight: dailyChallenge.sdg
        }
      }
    }

    // 检查食材选择并提供相应反馈
    if (selectedFoods.length === 0) return null
    
    const ecoFoods = selectedFoods.filter(food => food.carbonFootprint < 3)
    const highCarbonFoods = selectedFoods.filter(food => food.carbonFootprint >= 5)
    const highWaterFoods = selectedFoods.filter(food => food.waterUsage > 4)
    
    // 优先显示环保选择的鼓励
    if (ecoFoods.length > selectedFoods.length / 2) {
      return getRandomDialogue(aiDialoguesData.foodSelectionDialogues.ecoFriendly)
    }
    
    // 然后是建议
    if (highCarbonFoods.length > 0 || highWaterFoods.length > 0) {
      return getRandomDialogue(aiDialoguesData.foodSelectionDialogues.suggestion)
    }
    
    // 最后是警告
    return getRandomDialogue(aiDialoguesData.foodSelectionDialogues.warning)
  }

  // 获取结果阶段的对话
  const getResultDialogue = () => {
    if (!cookingResult) return null

    // 检查是否完成了每日挑战
    if (dailyChallenge && cookingResult.dailyChallengeCompleted) {
      return getRandomDialogue(aiDialoguesData.resultDialogues.dailyChallengeCompleted)
    }

    // 检查是否有新发现的食材
    if (discoveredFoods && discoveredFoods.length > 0) {
      const discovery = discoveredFoods[0]
      return {
        id: 'food_discovery',
        text: `惊喜！您发现了"${discovery.name}"！${discovery.funFact}`,
        emotion: '惊喜',
        sdgHighlight: discovery.sdgGoals?.[0] || 'SDG 12'
      }
    }

    // 根据环境评分选择对话
    if (cookingResult.ecoScore >= 8) {
      return getRandomDialogue(aiDialoguesData.resultDialogues.excellent)
    } else if (cookingResult.ecoScore >= 5) {
      return getRandomDialogue(aiDialoguesData.resultDialogues.good)
    } else {
      return getRandomDialogue(aiDialoguesData.resultDialogues.needsImprovement)
    }
  }

  // 打字机效果
  const typeText = (text, callback) => {
    setTypingText('')
    setIsTyping(true)
    let index = 0
    
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setTypingText(prev => prev + text[index])
        index++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
        if (callback) callback()
      }
    }, 30)
  }

  // 显示新对话
  const showDialogue = (dialogue) => {
    if (!dialogue) return
    
    setCurrentDialogue(dialogue)
    setIsVisible(true)
    typeText(dialogue.text)
  }

  // 当场景或状态变化时更新对话
  useEffect(() => {
    const dialogue = getDialogue()
    if (dialogue) {
      showDialogue(dialogue)
    }
  }, [currentScreen, selectedFoods, cookingResult, dailyChallenge, discoveredFoods])

  // 关闭AI助手
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      if (onClose) onClose()
    }, 300)
  }

  // 获取SDG图标
  const getSDGIcon = (sdgText) => {
    if (!sdgText) return null
    
    // 提取SDG编号
    const sdgMatch = sdgText.match(/SDG (\d+)/)
    if (sdgMatch) {
      const sdgNumber = sdgMatch[1]
      return `🎯 SDG ${sdgNumber}`
    }
    return sdgText
  }

  // 获取情绪对应的表情
  const getEmotionEmoji = (emotion) => {
    const emotionMap = {
      '欢迎': '👋',
      '严肃': '🤔',
      '鼓舞': '💪',
      '指导': '📚',
      '赞赏': '👏',
      '启发': '💡',
      '兴奋': '🎉',
      '自豪': '😊',
      '鼓励': '🌟',
      '支持': '🤝',
      '安慰': '🤗',
      '建议': '💭',
      '庆祝': '🎊',
      '惊喜': '😮',
      '神秘': '🔮',
      '教育': '🎓',
      '感谢': '🙏',
      '期待': '🌈'
    }
    return emotionMap[emotion] || '🤖'
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.aiAssistant}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          {/* AI助手头像 */}
          <div className={styles.avatar}>
            <div className={styles.avatarIcon}>
              <div className={styles.avatarFace}>
                <div className={styles.avatarEyes}>
                  <div className={styles.eyeLeft}></div>
                  <div className={styles.eyeRight}></div>
                </div>
                <div className={styles.avatarMouth}></div>
              </div>
              <div className={styles.avatarGlow}></div>
            </div>
            <div className={styles.avatarName}>{assistantProfile.name}</div>
          </div>

          {/* 对话框 */}
          <div className={styles.dialogueBox}>
            <div className={styles.dialogueHeader}>
              <span className={styles.emotionEmoji}>
                {getEmotionEmoji(currentDialogue?.emotion)}
              </span>
              <span className={styles.dialogueTitle}>
                {currentDialogue?.emotion}
              </span>
              {currentDialogue?.sdgHighlight && (
                <span className={styles.sdgBadge}>
                  {getSDGIcon(currentDialogue.sdgHighlight)}
                </span>
              )}
            </div>
            
            <div className={styles.dialogueContent}>
              <div className={styles.typingText}>
                {typingText}
                {isTyping && <span className={styles.cursor}>|</span>}
              </div>
            </div>

            {/* 关闭按钮 */}
            <button 
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="关闭AI助手"
            >
              ✕
            </button>
          </div>

          {/* 助手状态指示器 */}
          <div className={styles.statusIndicator}>
            <div className={styles.statusDot}></div>
            <span className={styles.statusText}>在线</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AIAssistant