import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { IconBook, IconAward } from '@tabler/icons-react';
import { PlanetScene } from '../3D/PlanetVisualization';
import foodData from '../../data/foods.json';

const IntroScreen = ({ onStartGame, gameStats, onOpenCookbook, onOpenAchievements, unlockedRecipeIds }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  const cardHoverEffect = {
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: { type: 'spring', stiffness: 300 }
    }
  };

  return (
    <motion.div 
      className="intro-screen-reimagined"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left Column */}
      <div className="intro-left-panel">
        <motion.div variants={itemVariants} className="intro-header">
          <h1 className="intro-title">未来食物实验室</h1>
          <p className="intro-subtitle">你的选择，决定星球的命运</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="intro-description">
          <p>欢迎来到2050年。地球资源日益紧张，人类的未来悬于一线。作为“未来食物实验室”的顶尖研究员，你的任务是通过精心设计每一餐，探索可持续的饮食方案，为我们的星球寻找一条绿色、健康的未来之路。</p>
        </motion.div>

        <motion.div variants={itemVariants} className="intro-start-button-container">
          <motion.button
            className="button button--primary button--large button--pulse"
            onClick={onStartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 进入实验室
          </motion.button>
        </motion.div>
      </div>

      {/* Right Column */}
      <div className="intro-right-panel">
        <motion.div variants={itemVariants} className="intro-planet-container">
          <Canvas style={{ width: '120%', height: '120%' }}>
            <PlanetScene
              planetStatus={{ health: 'excellent' }}
              selectedFoods={[]}
            />
          </Canvas>
        </motion.div>
        
        <div className="intro-cards-container">
          <motion.div
            className="intro-info-card"
            variants={itemVariants}
            whileHover="hover"
            onClick={onOpenCookbook}
          >
            <div className="intro-card-header">
              <IconBook size={24} className="intro-card-icon" />
              <h3 className="intro-card-title">食谱图鉴</h3>
            </div>
            <div className="intro-card-progress">
              <p className="intro-card-value">{unlockedRecipeIds.length}</p>
              <p className="intro-card-label">已解锁</p>
            </div>
          </motion.div>

          <motion.div
            className="intro-info-card"
            variants={itemVariants}
            whileHover="hover"
            onClick={onOpenAchievements}
          >
            <div className="intro-card-header">
              <IconAward size={24} className="intro-card-icon" />
              <h3 className="intro-card-title">成就殿堂</h3>
            </div>
            <div className="intro-card-progress">
              <p className="intro-card-value">{gameStats.unlockedAchievements.length}</p>
              <p className="intro-card-label">已达成</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default IntroScreen;