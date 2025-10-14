import React from 'react'
import { motion } from 'framer-motion'

const FoodCard = ({ food, isSelected, onSelect }) => {
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: { y: -5, scale: 1.03, boxShadow: "var(--shadow-large)" },
    tap: { scale: 0.97 }
  }

  return (
    <motion.div
      className={`food-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={!isSelected ? "hover" : ""}
      whileTap={!isSelected ? "tap" : ""}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      layout
    >
      <div className="food-card__emoji-background">{food.emoji}</div>
      <div className="food-card__content">
        <div className="food-card__header">
          <span className="food-card__emoji">{food.emoji}</span>
          <h3 className="food-card__name">{food.name}</h3>
        </div>
        <p className="food-card__description">{food.description}</p>
        <div className="food-card__footer">
          <div className="food-card__stats">
            <span className="stat" title="碳排放">
              🌍 {Math.round(food.carbonFootprint * 100)}
            </span>
            <span className="stat" title="水资源消耗">
              💧 {Math.round(food.waterUsage * 100)}
            </span>
            <span className="stat" title="健康指数">
              ❤️ {Math.round(food.healthScore * 100)}
            </span>
          </div>
          <div className={`food-card__select-indicator ${isSelected ? 'visible' : ''}`}>
            ✓
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FoodCard