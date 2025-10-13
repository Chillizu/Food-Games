import React, { useState, useEffect } from 'react'
import IconComponents from './IconComponents'

// 卡通风格装饰气泡
const CartoonBubble = ({ text, icon: Icon, className = "" }) => {
  return (
    <div className={`cartoon-bubble ${className}`}>
      {Icon && <Icon className="cartoon-icon" />}
      <span className="bubble-text">{text}</span>
    </div>
  )
}

// 卡通风格星星背景
const StarryBackground = ({ count = 50 }) => {
  const [stars, setStars] = useState([])

  useEffect(() => {
    const newStars = []
    for (let i = 0; i < count; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        animationDelay: Math.random() * 3
      })
    }
    setStars(newStars)
  }, [count])

  return (
    <div className="starry-background">
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.animationDelay}s`
          }}
        />
      ))}
    </div>
  )
}

// 卡通风格浮动元素
const FloatingElements = ({ elements }) => {
  return (
    <div className="floating-elements">
      {elements.map((element, index) => (
        <div
          key={index}
          className="floating-element"
          style={{
            left: element.x,
            top: element.y,
            animationDelay: element.delay,
            animationDuration: element.duration
          }}
        >
          {element.icon}
        </div>
      ))}
    </div>
  )
}

// 卡通风格进度指示器
const CartoonProgress = ({ 
  current, 
  total, 
  label, 
  color = "primary",
  showPercentage = true 
}) => {
  const percentage = Math.round((current / total) * 100)
  
  return (
    <div className="cartoon-progress-container">
      <div className="progress-info">
        <span className="progress-label">{label}</span>
        {showPercentage && (
          <span className="progress-percentage">{percentage}%</span>
        )}
      </div>
      <div className="cartoon-progress">
        <div 
          className={`cartoon-progress-fill color-${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="progress-stats">
        <span>{current} / {total}</span>
      </div>
    </div>
  )
}

// 卡通风格成就徽章
const AchievementBadge = ({ 
  title, 
  description, 
  icon: Icon, 
  unlocked = false,
  size = "medium"
}) => {
  return (
    <div className={`achievement-badge ${size} ${unlocked ? 'unlocked' : 'locked'}`}>
      <div className="badge-icon">
        {Icon ? <Icon /> : <div className="default-icon">🏆</div>}
      </div>
      <div className="badge-content">
        <h3 className="badge-title">{title}</h3>
        <p className="badge-description">{description}</p>
      </div>
      {!unlocked && (
        <div className="badge-lock">
          🔒
        </div>
      )}
    </div>
  )
}

// 卡通风格提示卡片
const InfoCard = ({ 
  title, 
  content, 
  icon: Icon, 
  variant = "info",
  closable = false,
  onClose 
}) => {
  return (
    <div className={`info-card variant-${variant}`}>
      <div className="card-header">
        {Icon && <div className="card-icon">{Icon}</div>}
        <h3 className="card-title">{title}</h3>
        {closable && (
          <button className="card-close" onClick={onClose}>
            ✕
          </button>
        )}
      </div>
      <div className="card-content">
        {content}
      </div>
    </div>
  )
}

// 卡通风格加载动画
const CartoonLoader = ({ size = "medium", text = "加载中..." }) => {
  return (
    <div className="cartoon-loader-container">
      <div className={`cartoon-loader size-${size}`}>
        <div className="loader-spinner" />
      </div>
      <div className="loader-text">{text}</div>
    </div>
  )
}

// 卡通风格计数器动画
const CounterAnimation = ({ target, duration = 1000, suffix = "" }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime
    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      setCount(Math.floor(progress * target))
      
      if (progress < 1) {
        requestAnimationFrame(animateCount)
      }
    }
    
    requestAnimationFrame(animateCount)
  }, [target, duration])
  
  return (
    <span className="counter-animation">
      {count}{suffix}
    </span>
  )
}

// 卡通风格按钮组
const ButtonGroup = ({ buttons, className = "" }) => {
  return (
    <div className={`cartoon-button-group ${className}`}>
      {buttons.map((button, index) => (
        <button
          key={index}
          className={`cartoon-button ${button.variant || 'primary'}`}
          onClick={button.onClick}
          disabled={button.disabled}
        >
          {button.icon && <span className="button-icon">{button.icon}</span>}
          {button.text}
        </button>
      ))}
    </div>
  )
}

// 卡通风格标签云
const TagCloud = ({ tags, maxTags = 10 }) => {
  const displayedTags = tags.slice(0, maxTags)
  
  return (
    <div className="cartoon-tag-cloud">
      {displayedTags.map((tag, index) => (
        <span
          key={index}
          className="cartoon-tag"
          style={{
            fontSize: `${0.8 + (tag.weight || 1) * 0.4}rem`,
            opacity: 0.6 + (tag.weight || 1) * 0.4
          }}
        >
          {tag.name}
        </span>
      ))}
    </div>
  )
}

// 卡通风格时间轴
const Timeline = ({ items }) => {
  return (
    <div className="cartoon-timeline">
      {items.map((item, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-marker">
            {item.icon || <div className="default-marker">●</div>}
          </div>
          <div className="timeline-content">
            <div className="timeline-date">{item.date}</div>
            <div className="timeline-title">{item.title}</div>
            <div className="timeline-description">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// 卡通风格评分显示
const StarRating = ({ rating, max = 5, size = "medium" }) => {
  return (
    <div className={`star-rating size-${size}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`star ${i < rating ? 'filled' : 'empty'}`}
        >
          ⭐
        </span>
      ))}
      <span className="rating-value">{rating}/{max}</span>
    </div>
  )
}

export {
  CartoonBubble,
  StarryBackground,
  FloatingElements,
  CartoonProgress,
  AchievementBadge,
  InfoCard,
  CartoonLoader,
  CounterAnimation,
  ButtonGroup,
  TagCloud,
  Timeline,
  StarRating
}