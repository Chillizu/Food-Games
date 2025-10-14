import React from 'react'
import { motion } from 'framer-motion'
import { IconLeaf, IconDroplet, IconWorld, IconHeart } from '@tabler/icons-react'
import styles from './FoodCard.module.css'

const FoodCard = ({ food, isSelected, onSelect }) => {
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: { y: -6, scale: 1.03 },
    tap: { scale: 0.97 }
  }

  const cardClasses = `${styles.card} ${isSelected ? styles.selected : ''}`

  return (
    <motion.div
      className={cardClasses}
      onClick={onSelect}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      layout
    >
      <div className={styles.emojiBackground}>{food.emoji}</div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.emoji}>{food.emoji}</div>
          <h3 className={styles.name}>{food.name}</h3>
        </div>
        <p className={styles.description}>{food.description}</p>
        <div className={styles.footer}>
          <div className={styles.stats}>
            <div className={styles.statItem} title={`碳排放 (越低越好): ${food.carbonFootprint}`}>
              <IconLeaf size={16} />
              <span>{Math.round(food.carbonFootprint * 100)}</span>
            </div>
            <div className={styles.statItem} title={`水消耗 (越低越好): ${food.waterUsage}`}>
              <IconDroplet size={16} />
              <span>{Math.round(food.waterUsage * 100)}</span>
            </div>
            <div className={styles.statItem} title={`健康指数 (越高越好): ${food.healthScore}`}>
              <IconHeart size={16} />
              <span>{Math.round(food.healthScore * 100)}</span>
            </div>
          </div>
          <div className={`${styles.selectIndicator} ${isSelected ? styles.visible : ''}`}>
            ✓
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FoodCard