import React from 'react'
import { motion } from 'framer-motion'
import PlanetVisualization from '../3D/PlanetVisualization'
import MealComposition from '../UI/MealComposition'
import { getSDGMessage } from '../../utils/dataProcessing'
import styles from './ResultScreen.module.css'

const StatCard = ({ label, value }) => (
  <div className={styles.statCard}>
    <div className={styles.statValue}>{value}</div>
    <div className={styles.statLabel}>{label}</div>
  </div>
)

const ResultScreen = ({
  environmentalImpact,
  planetStatus,
  foundRecipes,
  unmatchedFoods,
  tips,
  onRestart,
  onNewGame
}) => {
  const sdgMessage = environmentalImpact ? getSDGMessage(environmentalImpact.totalScore) : null

  const getScoreMessage = (score) => {
    if (score >= 80) return '优秀'
    if (score >= 60) return '良好'
    if (score >= 40) return '一般'
    if (score >= 20) return '需改进'
    return '较差'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  }

  if (!environmentalImpact || !planetStatus) {
    return <div>加载结果中...</div>
  }

  return (
    <motion.div
      className={styles.screen}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
    >
      <motion.h1 variants={itemVariants} className={styles.title}>
        实验结果分析
      </motion.h1>
      <motion.p variants={itemVariants} className={styles.subtitle}>
        你的选择如何塑造了饮食星球？
      </motion.p>

      <motion.div variants={itemVariants} className={styles.mainContent}>
        <div className={styles.planetContainer}>
          <PlanetVisualization planetStatus={planetStatus} />
        </div>

        <div className={styles.resultsContainer}>
          <div className={styles.statsGrid}>
            <StatCard label="综合评分" value={environmentalImpact.totalScore} />
            <StatCard label="碳排放" value={Math.round(100 - environmentalImpact.carbonFootprint * 100)} />
            <StatCard label="水资源" value={Math.round(100 - environmentalImpact.waterUsage * 100)} />
            <StatCard label="健康度" value={Math.round(environmentalImpact.healthScore * 100)} />
          </div>

          <div className={styles.feedback}>
            <h3 className={styles.feedbackTitle}>星球状态: {planetStatus.description}</h3>
            <p className={styles.feedbackText}>
              你的饮食选择的综合评分为 <strong>{environmentalImpact.totalScore}分</strong>，
              表现 <strong>{getScoreMessage(environmentalImpact.totalScore)}</strong>。
              {tips && tips.length > 0 && ` ${tips[0]}`}
            </p>
          </div>
          
          {sdgMessage && (
           <div className={styles.feedback}>
             <h3 className={styles.feedbackTitle}>{sdgMessage.icon} {sdgMessage.title}</h3>
             <p className={styles.feedbackText}>{sdgMessage.message}</p>
           </div>
          )}

          <div className={styles.feedback}>
            <h3 className={styles.feedbackTitle}>🍽️ 本次实验成果</h3>
            <MealComposition
              foundRecipes={foundRecipes}
              unmatchedFoods={unmatchedFoods}
            />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className={styles.actions}>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={onNewGame}
        >
          🚀 开始新实验
        </button>
        <button
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={onRestart}
        >
          🔄 重新制作
        </button>
      </motion.div>
    </motion.div>
  )
}

export default ResultScreen