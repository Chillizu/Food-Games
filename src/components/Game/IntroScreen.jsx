import React from 'react'
import { motion } from 'framer-motion'
import HeaderActions from '../UI/HeaderActions'

const IntroScreen = ({ onStartGame, gameStats, onOpenCookbook, onOpenAchievements }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      className="intro-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <HeaderActions onCookbookClick={onOpenCookbook} onAchievementsClick={onOpenAchievements} />
      <div className="intro-screen__content">
        <motion.div className="content-block" variants={itemVariants}>
          <h1 className="intro-screen__title">未来食物实验室</h1>
          <p className="intro-screen__subtitle">探索可持续饮食，塑造更美好的地球。</p>
        </motion.div>

        <motion.div className="content-block" variants={itemVariants}>
          <h2 className="content-block__title">🌍 故事背景</h2>
          <p>2050年，地球资源紧张。作为“未来食物实验室”的研究员，你的每次选择都将决定我们星球的未来。</p>
        </motion.div>

        <motion.div className="content-block" variants={itemVariants}>
          <h2 className="content-block__title">🎮 游戏目标</h2>
          <ul>
            <li>选择不同食材进行组合实验。</li>
            <li>观察并学习每种选择对环境的影响。</li>
            <li>努力解锁环保成就，培养一个绿色的饮食星球。</li>
          </ul>
        </motion.div>

        {gameStats.totalMeals > 0 && (
          <motion.div className="content-block" variants={itemVariants}>
            <h2 className="content-block__title">🏆 过往成就</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{gameStats.totalMeals}</span>
                <span className="stat-label">完成实验</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{gameStats.unlockedAchievements.length}</span>
                <span className="stat-label">解锁成就</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{gameStats.ecoStreak}</span>
                <span className="stat-label">环保连击</span>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <motion.button
            className="button button--primary button--large"
            onClick={onStartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 开始新的实验
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default IntroScreen