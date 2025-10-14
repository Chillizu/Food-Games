import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CookingAnimation from '../3D/CookingAnimation'
import styles from './CookingScreen.module.css'

const CookingScreen = ({ selectedFoods, onCompleteCooking }) => {
  const [cookingProgress, setCookingProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const cookingSteps = [
    { text: '正在准备实验器材...', duration: 1500 },
    { text: '混合食材样本...', duration: 2000 },
    { text: '进行热力分析...', duration: 2000 },
    { text: '数据合成与模拟...', duration: 1500 },
    { text: '生成最终报告...', duration: 1000 }
  ]

  useEffect(() => {
    let stepTimer
    const totalDuration = cookingSteps.reduce((sum, step) => sum + step.duration, 0)
    let elapsedTime = 0

    const runStep = (stepIndex) => {
      if (stepIndex >= cookingSteps.length) {
        setTimeout(() => onCompleteCooking(), 1200)
        return
      }

      setCurrentStep(stepIndex)

      const step = cookingSteps[stepIndex]
      stepTimer = setTimeout(() => {
        elapsedTime += step.duration
        setCookingProgress((elapsedTime / totalDuration) * 100)
        runStep(stepIndex + 1)
      }, step.duration)
    }

    runStep(0)
    setCookingProgress(0)

    return () => clearTimeout(stepTimer)
  }, [onCompleteCooking, cookingSteps])

  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className={styles.title}>正在生成实验报告...</h1>
      <p className={styles.subtitle}>请稍候，你的选择正在塑造新的星球形态。</p>

      <div className={styles.canvasContainer}>
        <CookingAnimation selectedFoods={selectedFoods} />
      </div>

      <div className={styles.progressBarContainer}>
        <motion.div
          className={styles.progressBar}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: cookingProgress / 100 }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep}
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {cookingSteps[currentStep]?.text || '...'}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}

export default CookingScreen