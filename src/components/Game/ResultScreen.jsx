import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PlanetVisualization from '../3D/PlanetVisualization'
import MealComposition from '../UI/MealComposition'
import { getSDGMessage } from '../../utils/dataProcessing'

const ResultScreen = ({
  selectedFoods,
  environmentalImpact,
  planetStatus,
  foundRecipes,
  unmatchedFoods,
  planetHistory,
  tips,
  onRestart,
  onNewGame
}) => {
  const sdgMessage = environmentalImpact ? getSDGMessage(environmentalImpact.totalScore) : null;

  const getScoreMessage = (score) => {
    if (score >= 80) return '优秀'
    if (score >= 60) return '良好'
    if (score >= 40) return '一般'
    if (score >= 20) return '需改进'
    return '较差'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      className="result-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="screen-header">
        <motion.h1 variants={itemVariants}>实验结果分析</motion.h1>
        <motion.p className="screen-subtitle" variants={itemVariants}>
          你的选择如何塑造了饮食星球？
        </motion.p>
      </div>

      <div className="result-screen__grid">
        {/* Left Column */}
        <motion.div className="result-screen__column" variants={itemVariants}>
          <div className="content-block">
            <h2 className="content-block__title">🌍 饮食星球状态</h2>
            <div className="result-screen__planet-container">
              <PlanetVisualization planetStatus={planetStatus} />
            </div>
            <div className="planet-status-info">
              <span className="planet-status-info__indicator" style={{backgroundColor: planetStatus.color}} />
              <span className="planet-status-info__text">{planetStatus.description}</span>
            </div>
          </div>
          
          {planetHistory && planetHistory.length > 1 && (
            <div className="content-block">
              <h2 className="content-block__title">📈 星球进化史</h2>
              <ul className="timeline">
                {planetHistory.map((entry, index) => (
                  <li key={entry.timestamp} className="timeline__item">
                    第{index + 1}次实验: <strong>{entry.score}分</strong> - {entry.status.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {tips && tips.length > 0 && (
            <div className="content-block">
              <h2 className="content-block__title">💡 环保建议</h2>
              <ul className="tips-list">
                {tips.map((tip, index) => (
                  <li key={index} className="tips-list__item">{tip}</li>
                ))}
              </ul>
            </div>
          )}
          
          {sdgMessage && (
           <div className="content-block sdg-info-block">
             <h2 className="content-block__title">{sdgMessage.icon} {sdgMessage.title}</h2>
             <p>{sdgMessage.message}</p>
           </div>
          )}
        </motion.div>

        {/* Right Column */}
        <motion.div className="result-screen__column" variants={itemVariants}>
          <div className="content-block">
            <h2 className="content-block__title">📊 环境影响总览</h2>
            <div className="overall-score">
              <div className="overall-score__value">{environmentalImpact.totalScore}</div>
              <div className="overall-score__label">综合环保评分</div>
              <div className="overall-score__tag">{getScoreMessage(environmentalImpact.totalScore)}</div>
            </div>
            <div className="impact-bars">
              {/* Impact Bars Here */}
              <div className="impact-bar-item">
                <span className="impact-bar-item__label">碳排放</span>
                <div className="impact-bar-item__bar">
                  <motion.div className="impact-bar-item__fill" initial={{ width: 0 }} animate={{ width: `${100 - environmentalImpact.carbonFootprint * 100}%` }} />
                </div>
                <span className="impact-bar-item__value">{Math.round(100 - environmentalImpact.carbonFootprint * 100)}</span>
              </div>
              <div className="impact-bar-item">
                <span className="impact-bar-item__label">水资源</span>
                <div className="impact-bar-item__bar">
                  <motion.div className="impact-bar-item__fill" initial={{ width: 0 }} animate={{ width: `${100 - environmentalImpact.waterUsage * 100}%` }} />
                </div>
                <span className="impact-bar-item__value">{Math.round(100 - environmentalImpact.waterUsage * 100)}</span>
              </div>
              <div className="impact-bar-item">
                <span className="impact-bar-item__label">土地占用</span>
                <div className="impact-bar-item__bar">
                  <motion.div className="impact-bar-item__fill" initial={{ width: 0 }} animate={{ width: `${100 - environmentalImpact.landUsage * 100}%` }} />
                </div>
                <span className="impact-bar-item__value">{Math.round(100 - environmentalImpact.landUsage * 100)}</span>
              </div>
              <div className="impact-bar-item">
                <span className="impact-bar-item__label">健康度</span>
                <div className="impact-bar-item__bar">
                  <motion.div className="impact-bar-item__fill" initial={{ width: 0 }} animate={{ width: `${environmentalImpact.healthScore * 100}%` }} />
                </div>
                <span className="impact-bar-item__value">{Math.round(environmentalImpact.healthScore * 100)}</span>
              </div>
            </div>
          </div>

          <div className="content-block">
            <h2 className="content-block__title">🍽️ 本次实验成果</h2>
            <MealComposition
              foundRecipes={foundRecipes}
              unmatchedFoods={unmatchedFoods}
            />
          </div>
        </motion.div>
      </div>

      <motion.div className="result-screen__actions" variants={itemVariants}>
        <motion.button
          className="button button--primary button--large"
          onClick={onNewGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🚀 开始新实验
        </motion.button>
        <motion.button
          className="button button--secondary button--large"
          onClick={onRestart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 重新制作
        </motion.button>
      </motion.div>

    </motion.div>
  )
}

export default ResultScreen