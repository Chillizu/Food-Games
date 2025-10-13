import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PlanetVisualization from '../3D/PlanetVisualization'
import AchievementPopup from '../UI/AchievementPopup'
import { getAchievements } from '../../utils/dataProcessing'

const ResultScreen = ({
  selectedFoods,
  environmentalImpact,
  planetStatus,
  currentRecipe,
  additionalRecipes,
  planetHistory,
  tips,
  unlockedAchievements,
  onRestart,
  onNewGame
}) => {
  const [showAchievements, setShowAchievements] = useState(false)
  const [displayedAchievements, setDisplayedAchievements] = useState([])
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0)

  const achievements = getAchievements()

  useEffect(() => {
    if (unlockedAchievements && unlockedAchievements.length > 0) {
      const newAchievements = unlockedAchievements.map(id =>
        achievements.find(a => a.id === id)
      ).filter(Boolean)
      
      setDisplayedAchievements(newAchievements)
      setShowAchievements(true)
    }
  }, [unlockedAchievements, achievements])

  const handleNextAchievement = () => {
    if (currentAchievementIndex < displayedAchievements.length - 1) {
      setCurrentAchievementIndex(currentAchievementIndex + 1)
    } else {
      setShowAchievements(false)
      setCurrentAchievementIndex(0)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#84cc16'
    if (score >= 40) return '#eab308'
    if (score >= 20) return '#f97316'
    return '#dc2626'
  }

  const getScoreMessage = (score) => {
    if (score >= 80) return '🌟 优秀！'
    if (score >= 60) return '👍 良好！'
    if (score >= 40) return '📊 一般'
    if (score >= 20) return '⚠️ 需改进'
    return '🚨 急需改善'
  }

  return (
    <div className="result-screen">
      <div className="result-content">
        {/* 标题 */}
        <motion.div 
          className="result-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="result-title">🎯 实验结果</h1>
          <p className="result-subtitle">
            你的料理对环境的影响分析
          </p>
        </motion.div>

        <div className="result-grid">
          {/* 左侧：星球状态 */}
          <motion.div
            className="planet-section"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3>🌍 你的饮食星球</h3>
            
            {/* 星球历史记录 */}
            {planetHistory && planetHistory.length > 1 && (
              <div className="planet-history">
                <h4>📈 星球进化史</h4>
                <div className="history-timeline">
                  {planetHistory.map((entry, index) => (
                    <div
                      key={entry.timestamp}
                      className="history-item"
                      style={{ borderLeftColor: entry.status.color }}
                    >
                      <div className="history-score">
                        第{index + 1}次: {entry.score}分
                      </div>
                      <div className="history-status">
                        {entry.status.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="planet-container">
              <PlanetVisualization planetStatus={planetStatus} />
            </div>
            <div className="planet-status">
              <div
                className="status-indicator"
                style={{ backgroundColor: planetStatus.color }}
              />
              <div className="status-text">
                <h4>{planetStatus.description}</h4>
                <div className="ecosystem-icons">
                  <div className="animals">
                    {planetStatus.animals.map((animal, index) => (
                      <span key={index} className="ecosystem-icon">{animal}</span>
                    ))}
                  </div>
                  <div className="plants">
                    {planetStatus.plants.map((plant, index) => (
                      <span key={index} className="ecosystem-icon">{plant}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 右侧：环境影响数据 */}
          <motion.div 
            className="impact-section"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3>📊 环境影响分析</h3>
            
            {/* 综合分数 */}
            <div className="total-score">
              <div className="score-circle">
                <motion.div 
                  className="score-fill"
                  style={{ 
                    backgroundColor: getScoreColor(environmentalImpact.totalScore)
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <span className="score-number">{environmentalImpact.totalScore}</span>
                </motion.div>
              </div>
              <div className="score-info">
                <h4>{getScoreMessage(environmentalImpact.totalScore)}</h4>
                <p>综合环保评分</p>
              </div>
            </div>

            {/* 详细数据 */}
            <div className="impact-details">
              <div className="impact-item">
                <div className="impact-icon">🌍</div>
                <div className="impact-content">
                  <div className="impact-label">碳排放</div>
                  <div className="impact-value">
                    <div className="impact-bar">
                      <div 
                        className="impact-fill"
                        style={{ 
                          width: `${environmentalImpact.carbonFootprint * 100}%`,
                          backgroundColor: '#dc2626'
                        }}
                      />
                    </div>
                    <span>{Math.round(environmentalImpact.carbonFootprint * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="impact-item">
                <div className="impact-icon">💧</div>
                <div className="impact-content">
                  <div className="impact-label">水资源</div>
                  <div className="impact-value">
                    <div className="impact-bar">
                      <div 
                        className="impact-fill"
                        style={{ 
                          width: `${environmentalImpact.waterUsage * 100}%`,
                          backgroundColor: '#06b6d4'
                        }}
                      />
                    </div>
                    <span>{Math.round(environmentalImpact.waterUsage * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="impact-item">
                <div className="impact-icon">🏞️</div>
                <div className="impact-content">
                  <div className="impact-label">土地占用</div>
                  <div className="impact-value">
                    <div className="impact-bar">
                      <div 
                        className="impact-fill"
                        style={{ 
                          width: `${environmentalImpact.landUsage * 100}%`,
                          backgroundColor: '#f59e0b'
                        }}
                      />
                    </div>
                    <span>{Math.round(environmentalImpact.landUsage * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="impact-item">
                <div className="impact-icon">❤️</div>
                <div className="impact-content">
                  <div className="impact-label">健康度</div>
                  <div className="impact-value">
                    <div className="impact-bar">
                      <div 
                        className="impact-fill"
                        style={{ 
                          width: `${environmentalImpact.healthScore * 100}%`,
                          backgroundColor: '#22c55e'
                        }}
                      />
                    </div>
                    <span>{Math.round(environmentalImpact.healthScore * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 食谱信息 */}
            {currentRecipe && (
              <div className="recipe-info">
                <h4>📖 主食谱</h4>
                <div className="recipe-card">
                  <h5>{currentRecipe.name}</h5>
                  <p>{currentRecipe.description}</p>
                  <div className="recipe-ingredients">
                    {selectedFoods
                      .filter(food => currentRecipe.ingredients?.includes(food.id))
                      .map(food => (
                      <span key={food.id} className="recipe-ingredient">
                        {food.emoji} {food.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* 额外食谱 */}
                {additionalRecipes.length > 0 && (
                  <div className="additional-recipes">
                    <h4>🍽️ 其他食谱</h4>
                    <div className="recipes-grid">
                      {additionalRecipes.map((recipe, index) => (
                        <div key={index} className="recipe-card">
                          <h5>{recipe.name}</h5>
                          <p>{recipe.description}</p>
                          <div className="recipe-ingredients">
                            {selectedFoods
                              .filter(food => recipe.ingredients?.includes(food.id))
                              .map(food => (
                              <span key={food.id} className="recipe-ingredient">
                                {food.emoji} {food.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* 环保提示 */}
        <motion.div 
          className="tips-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3>💡 环保建议</h3>
          <div className="tips-container">
            {tips && tips.map((tip, index) => (
              <motion.div
                key={index}
                className="tip-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                {tip}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          className="action-buttons"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.button
            className="cartoon-button primary-button"
            onClick={onNewGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 开始新实验
          </motion.button>
          <motion.button
            className="cartoon-button secondary-button"
            onClick={onRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 重新制作
          </motion.button>
        </motion.div>
      </div>

      {/* 成就弹窗 */}
      <AnimatePresence>
        {showAchievements && displayedAchievements.length > 0 && (
          <AchievementPopup
            achievement={displayedAchievements[currentAchievementIndex]}
            onNext={handleNextAchievement}
            isLast={currentAchievementIndex === displayedAchievements.length - 1}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ResultScreen