import React from 'react'
import { motion } from 'framer-motion'
import HeaderActions from '../UI/HeaderActions'
import Encyclopedia from '../UI/Encyclopedia'
import AIAssistant from '../UI/AIAssistant'
import styles from './IntroScreen.module.css'

const IntroScreen = ({
  onStartGame,
  gameStats,
  onOpenCookbook,
  onOpenAchievements,
  dailyChallenge,
  onOpenEncyclopedia,
  collectedFoods,
  onCloseEncyclopedia,
  showAIAssistant = true
}) => {
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
      className={styles.screen}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <HeaderActions onCookbookClick={onOpenCookbook} onAchievementsClick={onOpenAchievements} />
      <div className={styles.content}>
        <motion.div className={styles.contentBlock} variants={itemVariants}>
          <h1 className={styles.title}>未来食物实验室</h1>
          <p className={styles.subtitle}>探索可持续饮食，塑造更美好的地球。</p>
        </motion.div>

        <motion.div className={styles.contentBlock} variants={itemVariants}>
          <h2 className={styles.contentBlockTitle}>🌍 故事背景</h2>
          <p>2050年，地球资源紧张。作为“未来食物实验室”的研究员，你的每次选择都将决定我们星球的未来。</p>
        </motion.div>

        <motion.div className={styles.contentBlock} variants={itemVariants}>
          <h2 className={styles.contentBlockTitle}>🎮 游戏目标</h2>
          <ul>
            <li>选择不同食材进行组合实验。</li>
            <li>观察并学习每种选择对环境的影响。</li>
            <li>努力解锁环保成就，培养一个绿色的饮食星球。</li>
          </ul>
        </motion.div>

        {dailyChallenge && (
          <motion.div className={styles.contentBlock} variants={itemVariants}>
            <h2 className={styles.contentBlockTitle}>🎯 今日 SDG 挑战</h2>
            <div className={styles.contentBlock}>
              <p><strong>{dailyChallenge.title}</strong></p>
              <p>{dailyChallenge.description}</p>
              <p><small>SDG: {dailyChallenge.sdg} | 奖励: +{dailyChallenge.bonusScore} 分</small></p>
            </div>
          </motion.div>
        )}

        {gameStats.totalMeals > 0 && (
          <motion.div className={styles.contentBlock} variants={itemVariants}>
            <h2 className={styles.contentBlockTitle}>🏆 过往成就</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{gameStats.totalMeals}</span>
                <span className={styles.statLabel}>完成实验</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{gameStats.unlockedAchievements.length}</span>
                <span className={styles.statLabel}>解锁成就</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{gameStats.ecoStreak}</span>
                <span className={styles.statLabel}>环保连击</span>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div className={styles.contentBlock} variants={itemVariants}>
          <h2 className={styles.contentBlockTitle}>📚 食材图鉴</h2>
          <p>探索所有食材的详细信息，了解它们对环境和健康的影响。收集稀有食材，解锁更多知识！</p>
          <motion.button
            className={styles.encyclopediaButton}
            onClick={onOpenEncyclopedia}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📖 查看食材图鉴 ({collectedFoods.length} / {require('../../data/foods.json').foods.length})
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.button
            className={styles.startButton}
            onClick={onStartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 开始新的实验
          </motion.button>
        </motion.div>
      </div>
    </motion.div>

    {/* 食材图鉴模态框 */}
    {onOpenEncyclopedia && (
      <Encyclopedia onClose={onCloseEncyclopedia} />
    )}

    {/* AI助手 */}
    {showAIAssistant && (
      <AIAssistant
        currentScreen="intro"
        onClose={() => {}}
      />
    )}
  )
}

export default IntroScreen