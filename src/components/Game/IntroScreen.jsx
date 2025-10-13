import React from 'react'
import { motion } from 'framer-motion'
import { getFoods, getAchievements } from '../../utils/dataProcessing'

const IntroScreen = ({ onStartGame, gameStats }) => {
  const foods = getFoods()
  const achievements = getAchievements()

  return (
    <div className="intro-screen">
      <div className="intro-content">
        {/* 标题区域 */}
        <motion.div
          className="intro-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="header-card">
            <h1 className="intro-title">🧪 未来食物实验室</h1>
            <p className="intro-subtitle">探索可持续饮食，塑造美好未来</p>
          </div>
        </motion.div>

        {/* 游戏说明 */}
        <motion.div
          className="intro-description"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="story-card">
            <h2>🌍 故事背景</h2>
            <p>2050年，地球资源紧张，人类需要重新设计饮食方式。</p>
            <p>作为"未来食物实验室"的研究员，你的任务是：</p>
            <ul>
              <li>🔬 选择不同的食材进行实验</li>
              <li>📊 分析每顿饭的环境影响</li>
              <li>🌱 培养出更健康的饮食星球</li>
            </ul>
          </div>

          <div className="rules-card">
            <h2>🎮 游戏规则</h2>
            <ol>
              <li>从食材卡中选择2-3种食物</li>
              <li>观察它们的环境影响数据</li>
              <li>点击"开始烹饪"制作料理</li>
              <li>查看你的选择对星球的影响</li>
              <li>解锁环保成就，成为地球守护者！</li>
            </ol>
          </div>
        </motion.div>

        {/* 统计信息 */}
        {gameStats.totalMeals > 0 && (
          <motion.div 
            className="game-stats"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3>🏆 你的成就</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{gameStats.totalMeals}</span>
                <span className="stat-label">制作料理</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{gameStats.unlockedAchievements.length}</span>
                <span className="stat-label">解锁成就</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{gameStats.ecoStreak}</span>
                <span className="stat-label">环保连续</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 开始按钮 */}
        <motion.button
          className="cartoon-button start-button"
          onClick={onStartGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          🚀 开始实验
        </motion.button>

        {/* 食材预览 */}
        <motion.div 
          className="food-preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h3>🥗 可用食材</h3>
          <div className="food-grid">
            {foods.slice(0, 8).map((food, index) => (
              <div 
                key={food.id}
                className="food-preview-item"
                style={{ backgroundColor: food.color + '20' }}
              >
                <span className="food-emoji">{food.emoji}</span>
                <span className="food-name">{food.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default IntroScreen