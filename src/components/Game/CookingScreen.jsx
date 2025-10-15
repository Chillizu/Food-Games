import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import FunCookingAnimation from '../3D/FunCookingAnimation'

const CookingScreen = ({ selectedFoods, onCompleteCooking }) => {
  const [cookingProgress, setCookingProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const cookingSteps = [
    { text: '分析食材成分...', duration: 1000 },
    { text: '进行模拟实验...', duration: 2000 },
    { text: '生成报告...', duration: 1000 }
  ]

  useEffect(() => {
    let stepTimer
    const totalDuration = cookingSteps.reduce((sum, step) => sum + step.duration, 0)
    let elapsedTime = 0

    const runStep = (stepIndex) => {
      if (stepIndex >= cookingSteps.length) {
        setTimeout(() => onCompleteCooking(), 500)
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
  }, [onCompleteCooking])

  return (
    <div className="cooking-screen">
      <motion.div
        className="cooking-screen__content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="screen-header">
          <h1>正在生成实验报告...</h1>
          <p className="screen-subtitle">请稍候，你的选择正在塑造新的星球形态。</p>
        </div>

        <div className="cooking-screen__animation-container">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <FunCookingAnimation selectedFoods={selectedFoods} />
          </Canvas>
        </div>

        <div className="cooking-screen__progress-wrapper">
          <div className="progress-bar">
            <motion.div
              className="progress-bar__fill"
              initial={{ width: 0 }}
              animate={{ width: `${cookingProgress}%` }}
              transition={{ duration: 0.5, ease: 'linear' }}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              className="progress-bar__status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {cookingSteps[currentStep].text}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default CookingScreen