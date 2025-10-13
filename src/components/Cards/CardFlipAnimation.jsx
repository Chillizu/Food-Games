import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getFoods } from '../../utils/dataProcessing'

const CardFlipAnimation = ({ onFlipComplete }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [cardScale, setCardScale] = useState(1)
  const [cardRotation, setCardRotation] = useState(0)
  
  const foods = getFoods()
  const currentCard = foods[currentCardIndex]

  const handleFlip = () => {
    if (isFlipping) return
    
    setIsFlipping(true)
    
    // 翻转动画完成后切换到下一张卡
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % foods.length)
      setIsFlipping(false)
      
      // 如果是最后一张卡，触发完成回调
      if (currentCardIndex === foods.length - 1) {
        onFlipComplete()
      }
    }, 600) // 匹配动画持续时间
  }

  const cardVariants = {
    front: {
      rotateY: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    back: {
      rotateY: 180,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95,
      rotateY: -5,
      transition: {
        duration: 0.1,
        ease: "easeOut"
      }
    }
  }

  // 卡片进入动画
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.5,
        ease: "easeIn"
      }
    }
  }

  const handleCardClick = () => {
    handleFlip()
  }

  return (
    <div className="card-flip-animation">
      <motion.div
        className="animation-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h2 className="animation-title">🎴 食材卡牌展示</h2>
        <p className="animation-subtitle">
          点击卡牌查看食材的环保数据
        </p>
        
        <div className="progress-indicator">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentCardIndex + 1) / foods.length) * 100}%`,
                background: `linear-gradient(to right, ${currentCard.color}, ${currentCard.color}88)`
              }}
            />
          </div>
          <span className="progress-text">
            {currentCardIndex + 1} / {foods.length}
          </span>
        </div>

        <div className="card-scene">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCardIndex}
              className="card-wrapper"
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateY: 0,
                transition: {
                  duration: 0.5,
                  ease: "easeOut"
                }
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                rotateY: 90,
                transition: {
                  duration: 0.3,
                  ease: "easeIn"
                }
              }}
              onClick={handleCardClick}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95, rotateY: -5 }}
              variants={cardVariants}
            >
              <div className="card-container">
                <motion.div
                  className="card"
                  style={{
                    perspective: '1200px',
                    transformStyle: 'preserve-3d'
                  }}
                  variants={cardVariants}
                  initial="front"
                  animate={isFlipping ? "back" : "front"}
                >
                  {/* 卡牌正面 */}
                  <div className="card-face card-front">
                    <div className="card-front-content">
                      <div className="card-emoji">
                        {currentCard.emoji}
                      </div>
                      <h3 className="card-name">{currentCard.name}</h3>
                      <div className="card-category" style={{ backgroundColor: currentCard.color + '20' }}>
                        {currentCard.category}
                      </div>
                      <div className="card-hint">
                        点击查看环保数据
                      </div>
                    </div>
                  </div>
                  
                  {/* 卡牌背面 */}
                  <div className="card-face card-back">
                    <div className="card-back-content">
                      <div className="card-header">
                        <h3 className="card-back-title">{currentCard.name}</h3>
                        <div className="card-category-badge" style={{ backgroundColor: currentCard.color }}>
                          {currentCard.category}
                        </div>
                      </div>
                      
                      <p className="card-description">{currentCard.description}</p>
                      
                      <div className="environmental-data">
                        <div className="data-item">
                          <span className="data-icon">🌍</span>
                          <div className="data-bar">
                            <div
                              className="data-fill"
                              style={{
                                width: `${currentCard.carbonFootprint * 100}%`,
                                background: `linear-gradient(to right, #dc2626, #ef4444)`
                              }}
                            />
                          </div>
                          <span className="data-value">
                            碳排: {Math.round(currentCard.carbonFootprint * 100)}%
                          </span>
                        </div>
                        
                        <div className="data-item">
                          <span className="data-icon">💧</span>
                          <div className="data-bar">
                            <div
                              className="data-fill"
                              style={{
                                width: `${currentCard.waterUsage * 100}%`,
                                background: `linear-gradient(to right, #06b6d4, #0891b2)`
                              }}
                            />
                          </div>
                          <span className="data-value">
                            水耗: {Math.round(currentCard.waterUsage * 100)}%
                          </span>
                        </div>
                        
                        <div className="data-item">
                          <span className="data-icon">🏞️</span>
                          <div className="data-bar">
                            <div
                              className="data-fill"
                              style={{
                                width: `${currentCard.landUsage * 100}%`,
                                background: `linear-gradient(to right, #f59e0b, #d97706)`
                              }}
                            />
                          </div>
                          <span className="data-value">
                            土地: {Math.round(currentCard.landUsage * 100)}%
                          </span>
                        </div>
                        
                        <div className="data-item">
                          <span className="data-icon">❤️</span>
                          <div className="data-bar">
                            <div
                              className="data-fill"
                              style={{
                                width: `${currentCard.healthScore * 100}%`,
                                background: `linear-gradient(to right, #22c55e, #16a34a)`
                              }}
                            />
                          </div>
                          <span className="data-value">
                            健康: {Math.round(currentCard.healthScore * 100)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="eco-rating">
                        <span className="rating-label">环保评级:</span>
                        <div className="rating-stars">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`star ${i < Math.round(currentCard.healthScore * 5) ? 'filled' : ''}`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                        <div className="rating-score">
                          {Math.round(currentCard.healthScore * 100)}分
                        </div>
                      </div>
                      
                      <div className="eco-tips">
                        <h4>💡 环保小贴士</h4>
                        <p>
                          {currentCard.healthScore > 0.7 ? '🌱 这是很好的环保选择！' :
                           currentCard.healthScore > 0.4 ? '🔄 可以考虑更环保的替代品' :
                           '⚠️ 建议选择更可持续的食材'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="animation-controls">
          <motion.button
            className="cartoon-button flip-button"
            onClick={handleFlip}
            disabled={isFlipping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isFlipping ? '翻转中...' : '🔄 翻转卡牌'}
          </motion.button>
          
          <div className="card-navigation">
            <motion.button
              className="nav-button"
              onClick={() => setCurrentCardIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentCardIndex === 0 || isFlipping}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← 上一张
            </motion.button>
            <motion.button
              className="nav-button"
              onClick={() => setCurrentCardIndex((prev) => Math.min(foods.length - 1, prev + 1))}
              disabled={currentCardIndex === foods.length - 1 || isFlipping}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              下一张 →
            </motion.button>
          </div>
        </div>

        <div className="tips-section">
          <h3>💡 学习要点</h3>
          <ul>
            <li>🌱 植物性食物通常有更低的碳排放</li>
            <li>💧 关注水资源消耗，选择当季食材</li>
            <li>❤️ 均衡饮食，营养搭配要合理</li>
            <li>🔄 可持续饮食保护地球未来</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CardFlipAnimation