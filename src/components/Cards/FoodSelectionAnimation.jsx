import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getFoods } from '../../utils/dataProcessing'

// 食材卡片组件
const FoodCard = ({ food, isSelected, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      className={`food-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(food)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          duration: 0.5,
          delay: index * 0.1,
          ease: "easeOut"
        }
      }}
      whileHover={{ 
        scale: 1.05,
        y: -10,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
      variants={{
        selected: {
          scale: 1.1,
          y: -20,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        },
        unselected: {
          scale: 1,
          y: 0,
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        }
      }}
      animate={isSelected ? "selected" : "unselected"}
    >
      <div className="card-content">
        <div className="card-emoji" style={{ fontSize: isHovered ? '3rem' : '2.5rem' }}>
          {food.emoji}
        </div>
        <h3 className="card-name">{food.name}</h3>
        <div className="card-category" style={{ backgroundColor: food.color + '20' }}>
          {food.category}
        </div>
        
        {/* 环保指标 */}
        <div className="eco-indicators">
          <div className="eco-item" title="碳排放">
            <span className="eco-icon">🌍</span>
            <div className="eco-bar">
              <div 
                className="eco-fill"
                style={{ 
                  width: `${food.carbonFootprint * 100}%`,
                  backgroundColor: '#dc2626'
                }}
              />
            </div>
          </div>
          <div className="eco-item" title="健康度">
            <span className="eco-icon">❤️</span>
            <div className="eco-bar">
              <div 
                className="eco-fill"
                style={{ 
                  width: `${food.healthScore * 100}%`,
                  backgroundColor: '#22c55e'
                }}
              />
            </div>
          </div>
        </div>
        
        {isSelected && (
          <div className="selected-badge">
            ✅ 已选择
          </div>
        )}
      </div>
      
      {/* 卡片光晕效果 */}
      {isSelected && (
        <motion.div
          className="card-glow"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1.2,
            transition: { 
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
          style={{ 
            backgroundColor: food.color + '30',
          }}
        />
      )}
    </motion.div>
  )
}

// 食材选择动画主组件
const FoodSelectionAnimation = ({ 
  maxSelection = 9, 
  onSelectionComplete,
  initialSelection = []
}) => {
  const [selectedFoods, setSelectedFoods] = useState(initialSelection)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const foods = getFoods()
  
  const handleFoodClick = (food) => {
    if (isAnimating) return
    
    const isSelected = selectedFoods.some(f => f.id === food.id)
    
    if (isSelected) {
      // 取消选择
      setSelectedFoods(prev => prev.filter(f => f.id !== food.id))
    } else if (selectedFoods.length < maxSelection) {
      // 添加选择
      setSelectedFoods(prev => [...prev, food])
    }
  }
  
  const handleStartCooking = () => {
    if (selectedFoods.length < 2) {
      alert('请至少选择2种食材！')
      return
    }
    
    setIsAnimating(true)
    setShowProgress(true)
    
    // 模拟烹饪准备动画
    setTimeout(() => {
      setIsAnimating(false)
      if (onSelectionComplete) {
        onSelectionComplete(selectedFoods)
      }
    }, 1000)
  }
  
  const handleReset = () => {
    setSelectedFoods([])
    setShowProgress(false)
  }
  
  // 计算环保总分
  const calculateEcoScore = () => {
    if (selectedFoods.length === 0) return 0
    
    const avgHealth = selectedFoods.reduce((sum, food) => sum + food.healthScore, 0) / selectedFoods.length
    const avgCarbon = selectedFoods.reduce((sum, food) => sum + food.carbonFootprint, 0) / selectedFoods.length
    const avgWater = selectedFoods.reduce((sum, food) => sum + food.waterUsage, 0) / selectedFoods.length
    const avgLand = selectedFoods.reduce((sum, food) => sum + food.landUsage, 0) / selectedFoods.length
    
    // 综合评分（健康度权重最高）
    return Math.round((avgHealth * 0.4 + (1 - avgCarbon) * 0.2 + (1 - avgWater) * 0.2 + (1 - avgLand) * 0.2) * 100)
  }
  
  const ecoScore = calculateEcoScore()
  
  return (
    <div className="food-selection-animation">
      <div className="selection-header">
        <h2>🎮 选择你的食材</h2>
        <p>最多可选择 {maxSelection} 种食材，制作美味环保料理</p>
      </div>
      
      {/* 进度指示器 */}
      <div className="selection-progress">
        <div className="progress-info">
          <span className="selected-count">
            已选择: {selectedFoods.length} / {maxSelection}
          </span>
          <span className="eco-score">
            环保评分: {ecoScore}分
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${(selectedFoods.length / maxSelection) * 100}%`,
              background: `linear-gradient(to right, #22c55e, #16a34a)`
            }}
          />
        </div>
      </div>
      
      {/* 食材网格 */}
      <div className="food-grid">
        <AnimatePresence>
          {foods.map((food, index) => (
            <FoodCard
              key={food.id}
              food={food}
              isSelected={selectedFoods.some(f => f.id === food.id)}
              onClick={handleFoodClick}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* 控制按钮 */}
      <div className="selection-controls">
        <motion.button
          className="cartoon-button reset-button"
          onClick={handleReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isAnimating}
        >
          🔄 重置选择
        </motion.button>
        
        <motion.button
          className="cartoon-button start-button"
          onClick={handleStartCooking}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isAnimating || selectedFoods.length < 2}
        >
          {isAnimating ? '🍳 准备中...' : '🍳 开始烹饪'}
        </motion.button>
      </div>
      
      {/* 已选择的食材预览 */}
      {selectedFoods.length > 0 && (
        <div className="selected-preview">
          <h3>📋 已选择的食材</h3>
          <div className="selected-items">
            {selectedFoods.map((food, index) => (
              <motion.div
                key={food.id}
                className="selected-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="item-emoji">{food.emoji}</span>
                <span className="item-name">{food.name}</span>
              </motion.div>
            ))}
          </div>
          
          {/* 预估菜品数量 */}
          <div className="recipe-estimate">
            <p>预计制作: {Math.ceil(selectedFoods.length / 2)} 道菜</p>
          </div>
        </div>
      )}
      
      {/* 环保提示 */}
      <div className="eco-tips">
        <h4>💡 环保小贴士</h4>
        <ul>
          <li>🌱 选择植物性食材可以减少碳排放</li>
          <li>💧 关注当季食材，减少运输能耗</li>
          <li>🔄 合理搭配，避免食物浪费</li>
          <li>❤️ 均衡营养，健康饮食两不误</li>
        </ul>
      </div>
      
      {/* 动画背景效果 */}
      <div className="animation-background">
        <div className="floating-particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)]
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FoodSelectionAnimation