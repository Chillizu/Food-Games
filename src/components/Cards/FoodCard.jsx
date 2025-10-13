import React from 'react'
import { motion } from 'framer-motion'

const FoodCard = ({ food, isSelected, onSelect }) => {
  const handleClick = () => {
    if (!isSelected) {
      onSelect()
    }
  }

  return (
    <motion.div
      className={`food-card playing-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      whileHover={!isSelected ? { scale: 1.05, y: -8, rotateX: 5 } : {}}
      whileTap={!isSelected ? { scale: 0.95, rotateX: -2 } : {}}
      initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
      style={{
        transformStyle: 'preserve-3d',
        borderColor: isSelected ? food.color : '#e5e7eb',
        backgroundColor: isSelected ? food.color + '15' : 'white',
        boxShadow: isSelected ?
          `0 15px 35px ${food.color}40, 0 8px 20px rgba(0,0,0,0.15), 0 0 0 3px ${food.color}40` :
          '0 8px 25px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)',
        borderWidth: '2px',
        borderRadius: '16px'
      }}
    >
      {/* 卡片边框装饰 */}
      <div className="card-border" style={{ borderColor: food.color }} />
      
      {/* 卡片顶部 - 食材图标（类似扑克牌花色位置） */}
      <div className="card-top">
        <div className="food-emoji large">{food.emoji}</div>
        <div className="card-corner">
          <div className="corner-emoji">{food.emoji}</div>
          <div className="corner-name">{food.name}</div>
        </div>
      </div>

      {/* 卡片中部 - 食材名称（主标题） */}
      <div className="card-middle">
        <h3 className="food-name">{food.name}</h3>
        <div className="category-badge" style={{
          backgroundColor: food.color + '25',
          borderColor: food.color,
          borderWidth: '2px',
          borderStyle: 'solid'
        }}>
          {food.category}
        </div>
      </div>

      {/* 卡片底部 - 环保指标（类似扑克牌数字区域） */}
      <div className="card-bottom">
        <div className="impact-indicators">
          <div className="impact-item">
            <span className="impact-icon">🌍</span>
            <div className="impact-bar">
              <div
                className="impact-fill"
                style={{
                  width: `${food.carbonFootprint * 100}%`,
                  background: `linear-gradient(to right, #dc2626, #ef4444)`
                }}
              />
            </div>
            <span className="impact-label">碳排</span>
          </div>
          <div className="impact-item">
            <span className="impact-icon">💧</span>
            <div className="impact-bar">
              <div
                className="impact-fill"
                style={{
                  width: `${food.waterUsage * 100}%`,
                  background: `linear-gradient(to right, #06b6d4, #0891b2)`
                }}
              />
            </div>
            <span className="impact-label">水耗</span>
          </div>
          <div className="impact-item">
            <span className="impact-icon">❤️</span>
            <div className="impact-bar">
              <div
                className="impact-fill"
                style={{
                  width: `${food.healthScore * 100}%`,
                  background: `linear-gradient(to right, #22c55e, #16a34a)`
                }}
              />
            </div>
            <span className="impact-label">健康</span>
          </div>
        </div>
      </div>

      {/* 卡片中心装饰 */}
      <div className="card-center-decoration">
        <div className="center-emoji">{food.emoji}</div>
      </div>

      {/* 选中状态指示器 */}
      {isSelected && (
        <div className="selection-glow" style={{
          boxShadow: `0 0 20px ${food.color}60, inset 0 0 20px ${food.color}30`
        }} />
      )}

      {/* 卡片悬停时的详细信息 */}
      <div className="card-hover-info">
        <p className="food-description">{food.description}</p>
        <div className="impact-values">
          <span className="impact-value">
            🌍 碳排: {Math.round(food.carbonFootprint * 100)}%
          </span>
          <span className="impact-value">
            💧 水耗: {Math.round(food.waterUsage * 100)}%
          </span>
          <span className="impact-value">
            ❤️ 健康: {Math.round(food.healthScore * 100)}%
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default FoodCard