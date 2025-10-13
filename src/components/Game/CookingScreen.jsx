import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CookingAnimation from '../3D/CookingAnimation'

const CookingScreen = ({ selectedFoods, onCompleteCooking }) => {
  const [cookingProgress, setCookingProgress] = useState(0)
  const [isCooking, setIsCooking] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  // 烹饪步骤
  const cookingSteps = [
    { emoji: '🔥', text: '加热烹饪器具', duration: 2000 },
    { emoji: '🥘', text: '准备食材', duration: 1500 },
    { emoji: '🍳', text: '开始烹饪', duration: 2000 },
    { emoji: '✨', text: '调味调香', duration: 1500 },
    { emoji: '🎯', text: '完美收尾', duration: 1000 }
  ]

  useEffect(() => {
    if (!isCooking) return

    let stepTimer
    const totalSteps = cookingSteps.length

    const cookStep = (stepIndex) => {
      if (stepIndex >= totalSteps) {
        // 烹饪完成
        setTimeout(() => {
          setIsCooking(false)
          setTimeout(() => onCompleteCooking(), 1000)
        }, 1000)
        return
      }

      const step = cookingSteps[stepIndex]
      setCurrentStep(stepIndex)
      
      // 更新进度条
      const stepProgress = ((stepIndex + 1) / totalSteps) * 100
      setCookingProgress(stepProgress)

      // 显示当前步骤
      stepTimer = setTimeout(() => {
        cookStep(stepIndex + 1)
      }, step.duration)
    }

    cookStep(0)

    return () => {
      if (stepTimer) clearTimeout(stepTimer)
    }
  }, [isCooking, onCompleteCooking])

  const getProgressColor = () => {
    if (cookingProgress < 33) return '#ef4444'
    if (cookingProgress < 66) return '#f59e0b'
    return '#22c55e'
  }

  return (
    <div className="cooking-screen">
      <div className="cooking-content">
        {/* 标题 */}
        <motion.div 
          className="cooking-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="cooking-title">🍳 正在烹饪中...</h1>
          <p className="cooking-subtitle">
            用心制作你的环保料理
          </p>
        </motion.div>

        {/* 3D烹饪动画 */}
        <motion.div 
          className="cooking-animation-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <CookingAnimation selectedFoods={selectedFoods} />
        </motion.div>

        {/* 烹饪步骤显示 */}
        <motion.div 
          className="cooking-steps"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="steps-container">
            <AnimatePresence mode="wait">
              {isCooking && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="current-step"
                >
                  <div className="step-emoji">{cookingSteps[currentStep].emoji}</div>
                  <div className="step-text">{cookingSteps[currentStep].text}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 进度条 */}
        <motion.div 
          className="cooking-progress"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className="progress-info">
            <span className="progress-percentage">{Math.round(cookingProgress)}%</span>
            <span className="progress-status">
              {isCooking ? '烹饪中...' : '即将完成！'}
            </span>
          </div>
          <div className="progress-bar-container">
            <motion.div 
              className="progress-bar"
              style={{ 
                width: `${cookingProgress}%`,
                backgroundColor: getProgressColor()
              }}
              initial={{ width: 0 }}
              animate={{ width: `${cookingProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* 食材展示 */}
        <motion.div 
          className="ingredients-display"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <h3>🥘 食材组合</h3>
          <div className="ingredients-list">
            {selectedFoods.map((food, index) => (
              <motion.div
                key={food.id}
                className="ingredient-item"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                style={{ backgroundColor: food.color + '20' }}
              >
                <span className="ingredient-emoji">{food.emoji}</span>
                <span className="ingredient-name">{food.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 烹饪音效提示 */}
        <motion.div 
          className="cooking-sounds"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <div className="sound-indicator">
            <span className="sound-wave">🔊</span>
            <span className="sound-text">烹饪音效播放中...</span>
          </div>
        </motion.div>

        {/* 完成提示 */}
        {!isCooking && (
          <motion.div 
            className="completion-message"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="success-icon">✨</div>
            <h3>烹饪完成！</h3>
            <p>正在分析你的料理对环境的影响...</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CookingScreen