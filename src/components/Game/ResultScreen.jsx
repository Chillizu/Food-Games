import React from 'react'
import { motion } from 'framer-motion'
import PlanetVisualization from '../3D/PlanetVisualization'
import MealComposition from '../UI/MealComposition'
import { getSDGMessage } from '../../utils/dataProcessing'
import foodReactionsData from '../../data/foodReactions.json'
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
  onNewGame,
  dailyChallenge,
  foundReactions,
  selectedFoods
}) => {
  const sdgMessage = environmentalImpact ? getSDGMessage(environmentalImpact.totalScore) : null

  const getScoreMessage = (score) => {
    if (score >= 80) return '优秀'
    if (score >= 60) return '良好'
    if (score >= 40) return '一般'
    if (score >= 20) return '需改进'
    return '较差'
  }

  // 获取反应的类别和颜色
  const getReactionCategory = (reactionId) => {
    for (const [categoryKey, category] of Object.entries(foodReactionsData.reactionCategories)) {
      if (category.reactions.includes(reactionId)) {
        return {
          key: categoryKey,
          name: category.name,
          color: categoryKey === 'environmental' ? '#10b981' :
                 categoryKey === 'health' ? '#22c55e' : '#8b5cf6'
        }
      }
    }
    return { key: 'unknown', name: '未知', color: '#6b7280' }
  }

  // 渲染反应项
  const renderReactionItem = (reaction) => {
    const category = getReactionCategory(reaction.id)
    
    return (
      <div key={reaction.id} className={`${styles.reactionItem} reaction-${category.key}`}>
        <div className={styles.reactionHeader}>
          <div
            className={styles.reactionIcon}
            style={{ backgroundColor: `${category.color}20`, color: category.color }}
          >
            {category.name.charAt(0)}
          </div>
          <div>
            <div className={styles.reactionName}>{reaction.name}</div>
            <div className={styles.reactionDescription}>{reaction.description}</div>
          </div>
        </div>
        
        <div className={styles.reactionEffects}>
          {/* SDG 协同效应 */}
          {Object.entries(reaction.sdgSynergy).map(([sdg, level]) => (
            <div key={sdg} className={`${styles.effectBadge} ${styles.sdgBadge}`}>
              <span>{sdg}</span>
              <span>★{level}</span>
            </div>
          ))}
          
          {/* 加成效果 */}
          {Object.entries(reaction.bonusEffects).map(([effect, value]) => (
            <div key={effect} className={`${styles.effectBadge} ${styles.bonusBadge}`}>
              <span>{effect}</span>
              <span>+{Math.round(value * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 检查每日挑战是否完成
  const checkDailyChallengeCompletion = () => {
    if (!dailyChallenge || !environmentalImpact || !selectedFoods) return null
    
    const selectedFoodIds = selectedFoods.map(food => food.id)
    const requiredIngredientIds = dailyChallenge.requiredIngredients.map(ingredient => ingredient.id)
    
    // 检查是否包含了所有必需的食材
    const isCompleted = requiredIngredientIds.every(id => selectedFoodIds.includes(id))
    
    return {
      isCompleted,
      challenge: dailyChallenge,
      bonusScore: isCompleted ? dailyChallenge.bonusScore : 0
    }
  }

  const dailyChallengeResult = checkDailyChallengeCompletion()

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

          {/* 每日挑战结果 */}
          {dailyChallengeResult && (
           <div className={`${styles.feedback} ${dailyChallengeResult.isCompleted ? styles.challengeCompleted : styles.challengeIncomplete}`}>
             <h3 className={styles.feedbackTitle}>
               {dailyChallengeResult.challenge.sdgIcon} 今日 SDG 挑战
             </h3>
             <p className={styles.feedbackText}>
               {dailyChallengeResult.isCompleted ? (
                 <>
                   🎉 恭喜！你完成了「{dailyChallengeResult.challenge.title}」挑战！
                   <br />
                   <span className={styles.bonusScore}>+{dailyChallengeResult.bonusScore} 分奖励</span>
                 </>
               ) : (
                 <>
                   很遗憾，你未能完成「{dailyChallengeResult.challenge.title}」挑战。
                   <br />
                   继续努力，为 {dailyChallengeResult.challenge.sgdTitle} 做出贡献！
                 </>
               )}
             </p>
             {dailyChallengeResult.isCompleted && dailyChallengeResult.challenge.reward && (
               <div className={styles.challengeReward}>
                 <h4>🏆 {dailyChallengeResult.challenge.reward.title}</h4>
                 <p>{dailyChallengeResult.challenge.reward.content}</p>
               </div>
             )}
           </div>
          )}

          {/* SDG 化学反应总结 */}
          {foundReactions && foundReactions.length > 0 ? (
           <div className={styles.reactionsSection}>
             <h3 className={styles.reactionsTitle}>
               🧪 SDG 化学反应总结
             </h3>
             <div className={styles.reactionsList}>
               {foundReactions.map(renderReactionItem)}
             </div>
           </div>
          ) : (
           <div className={styles.feedback}>
             <h3 className={styles.feedbackTitle}>🧪 SDG 化学反应</h3>
             <p className={styles.feedbackText}>
               本次实验中没有触发特殊的 SDG 化学反应。
               尝试组合不同的食材，发现更多可持续发展的协同效应！
             </p>
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