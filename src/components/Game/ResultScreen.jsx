import React, { useMemo, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { PlanetScene } from '../3D/PlanetVisualization'
import MealComposition from '../UI/MealComposition'
import { getSDGMessage } from '../../utils/dataProcessing'
import HeaderActions from '../UI/HeaderActions'
import ModernProgressBar from '../UI/ModernProgressBar';
import AnimatedScore from '../UI/AnimatedScore';

const ResultScreen = ({ onNewGame, onOpenCookbook, onOpenAchievements, onResetGame, planetStatus: initialPlanetStatus, selectedFoods: initialSelectedFoods }) => {
  const location = useLocation();
  const [resultData, setResultData] = useState(location.state);

  useEffect(() => {
    if (!resultData) {
      try {
        const storedData = sessionStorage.getItem('lastResultData');
        if (storedData) {
          setResultData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Failed to load result from sessionStorage", error);
      }
    }
  }, [resultData]);

  const handleGoHome = () => {
    if (onResetGame) {
      onResetGame();
    }
  };

  if (!resultData) {
    return (
      <div className="content-block" style={{ textAlign: 'center', margin: 'auto' }}>
        <h2>没有可用的结果</h2>
        <p>请先开始一个新的实验来查看结果。</p>
        <button className="button button--primary" onClick={onResetGame} style={{ marginTop: '1rem' }}>
          返回主界面
        </button>
      </div>
    );
  }

  // 确保environmentalImpact存在且有必要的属性
  if (!resultData.environmentalImpact) {
    console.error('Result data missing environmentalImpact:', resultData);
    return (
      <div className="content-block" style={{ textAlign: 'center', margin: 'auto' }}>
        <h2>数据不完整</h2>
        <p>实验结果数据不完整，请重新开始实验。</p>
        <button className="button button--primary" onClick={onResetGame} style={{ marginTop: '1rem' }}>
          返回主界面
        </button>
      </div>
    );
  }

  const {
    environmentalImpact,
    planetStatus: dataPlanetStatus,
    foundRecipes = [],
    unmatchedFoods = [],
    planetHistory = [],
    tips = [],
  } = resultData;

  const planetStatus = dataPlanetStatus || initialPlanetStatus;
  const selectedFoods = useMemo(() => {
    if (initialSelectedFoods && initialSelectedFoods.length > 0) return initialSelectedFoods;
    if (!foundRecipes || !unmatchedFoods) return [];
    const foodsFromRecipes = foundRecipes.flatMap(recipe => recipe.ingredients_details || []);
    return [...foodsFromRecipes, ...unmatchedFoods];
  }, [foundRecipes, unmatchedFoods, initialSelectedFoods]);

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
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, ease: 'easeOut', duration: 0.3 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.3 } }
  }

  return (
    <motion.div
      className="result-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <HeaderActions onCookbookClick={onOpenCookbook} onAchievementsClick={onOpenAchievements} />
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
              {planetStatus && selectedFoods && (
                <Canvas
                  camera={{ position: [0, 0, 5], fov: 50 }}
                  gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                  }}
                  onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0);
                  }}
                >
                  <PlanetScene
                    planetStatus={planetStatus}
                    selectedFoods={selectedFoods}
                  />
                </Canvas>
              )}
            </div>
            <div className="planet-status-info">
              <span className="planet-status-info__indicator" style={{backgroundColor: planetStatus?.color}} />
              <span className="planet-status-info__text">{planetStatus?.description}</span>
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
           <div className="content-block">
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
              <AnimatedScore score={environmentalImpact.totalScore} />
              <div className="overall-score__label">综合环保评分</div>
              <div className="overall-score__tag">{getScoreMessage(environmentalImpact.totalScore)}</div>
            </div>
            <div className="stats-progress-bars">
              <ModernProgressBar
                label="碳排放"
                icon="💨"
                value={environmentalImpact.carbonFootprint || 0}
                max={1.5}
                delay={0.4}
              />
              <ModernProgressBar
                label="水资源消耗"
                icon="💧"
                value={environmentalImpact.waterUsage || 0}
                max={1.5}
                delay={0.5}
              />
              <ModernProgressBar
                label="土地占用"
                icon="🌳"
                value={environmentalImpact.landUsage || 0}
                max={1.5}
                delay={0.6}
              />
              <ModernProgressBar
                label="健康度"
                icon="❤️"
                value={environmentalImpact.healthScore || 0}
                max={1}
                delay={0.7}
              />
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
        <button
          className="button button--primary button--large"
          onClick={onNewGame}
        >
          🚀 开始新实验
        </button>
        <button
          className="button button--secondary button--large"
          onClick={handleGoHome}
        >
          ↩️ 返回主界面
        </button>
      </motion.div>

    </motion.div>
  )
}

export default ResultScreen