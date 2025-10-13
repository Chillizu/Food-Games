import React, { useState, useEffect, createContext, useContext } from 'react'
import achievementsData from '../../data/achievements.json'

// 成就上下文
const AchievementContext = createContext()

// 成就管理器组件
export const AchievementProvider = ({ children }) => {
  const [achievements, setAchievements] = useState({})
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  const [recentlyUnlocked, setRecentlyUnlocked] = useState([])
  const [showNotification, setShowNotification] = useState(false)
  
  // 初始化成就数据
  useEffect(() => {
    const savedAchievements = localStorage.getItem('gameAchievements')
    const savedUnlocked = localStorage.getItem('unlockedAchievements')
    
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    } else {
      // 初始化成就数据
      const initialAchievements = {}
      Object.keys(achievementsData.achievements).forEach(key => {
        initialAchievements[key] = {
          ...achievementsData.achievements[key],
          unlocked: false,
          progress: 0,
          unlockedAt: null
        }
      })
      setAchievements(initialAchievements)
    }
    
    if (savedUnlocked) {
      setUnlockedAchievements(JSON.parse(savedUnlocked))
    }
  }, [])
  
  // 保存成就数据到本地存储
  useEffect(() => {
    if (Object.keys(achievements).length > 0) {
      localStorage.setItem('gameAchievements', JSON.stringify(achievements))
    }
  }, [achievements])
  
  useEffect(() => {
    if (unlockedAchievements.length > 0) {
      localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements))
    }
  }, [unlockedAchievements])
  
  // 检查成就是否解锁
  const checkAchievement = (achievementId, gameData) => {
    const achievement = achievements[achievementId]
    if (!achievement || achievement.unlocked) return false
    
    let shouldUnlock = false
    let newProgress = achievement.progress
    
    switch (achievement.requirements.type) {
      case 'recipe_count':
        newProgress = gameData.recipesCreated || 0
        shouldUnlock = newProgress >= achievement.requirements.target
        break
        
      case 'streak_score':
        const streakCount = gameData.streakCount || 0
        const currentScore = gameData.currentScore || 0
        newProgress = streakCount
        shouldUnlock = streakCount >= achievement.requirements.target && 
                      currentScore >= achievement.requirements.minScore
        break
        
      case 'total_cooking':
        newProgress = gameData.totalCooking || 0
        shouldUnlock = newProgress >= achievement.requirements.target
        break
        
      case 'ingredient_type':
        const ingredientCount = gameData.ingredientUsage?.[achievement.requirements.ingredientType] || 0
        newProgress = ingredientCount
        shouldUnlock = ingredientCount >= achievement.requirements.target
        break
        
      case 'first_use':
        const hasUsed = gameData.firstUse?.[achievement.requirements.ingredientType] || false
        shouldUnlock = hasUsed
        break
        
      case 'perfect_score':
        const perfectScore = gameData.currentScore || 0
        newProgress = perfectScore
        shouldUnlock = perfectScore >= achievement.requirements.target
        break
        
      case 'max_selection':
        const maxSelection = gameData.maxSelection || 0
        newProgress = maxSelection
        shouldUnlock = maxSelection >= achievement.requirements.target
        break
        
      case 'resource_efficiency':
        const resourceUsage = gameData.resourceEfficiency?.[achievement.requirements.resourceType] || 1
        newProgress = Math.round((1 - resourceUsage) * 100)
        shouldUnlock = gameData.resourceEfficiencyCount?.[achievement.requirements.resourceType] || 0 >= 
                      achievement.requirements.target &&
                      resourceUsage <= achievement.requirements.maxUsage
        break
    }
    
    // 更新进度
    const updatedAchievements = {
      ...achievements,
      [achievementId]: {
        ...achievement,
        progress: newProgress
      }
    }
    setAchievements(updatedAchievements)
    
    // 如果解锁成就
    if (shouldUnlock) {
      unlockAchievement(achievementId)
      return true
    }
    
    return false
  }
  
  // 解锁成就
  const unlockAchievement = (achievementId) => {
    const achievement = achievements[achievementId]
    if (!achievement || achievement.unlocked) return
    
    const updatedAchievements = {
      ...achievements,
      [achievementId]: {
        ...achievement,
        unlocked: true,
        unlockedAt: new Date().toISOString()
      }
    }
    
    setAchievements(updatedAchievements)
    setUnlockedAchievements(prev => [...prev, achievementId])
    
    // 添加到最近解锁列表
    setRecentlyUnlocked(prev => [achievementId, ...prev.slice(0, 4)])
    
    // 显示通知
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
    
    // 播放音效
    if (window.playAchievementUnlock) {
      window.playAchievementUnlock()
    }
    
    return achievement
  }
  
  // 获取成就统计
  const getAchievementStats = () => {
    const totalAchievements = Object.keys(achievements).length
    const unlockedCount = unlockedAchievements.length
    const progressPercentage = Math.round((unlockedCount / totalAchievements) * 100)
    
    const categoryStats = {}
    Object.keys(achievementsData.categories).forEach(category => {
      categoryStats[category] = {
        total: Object.values(achievements).filter(a => a.category === category).length,
        unlocked: unlockedAchievements.filter(id => achievements[id].category === category).length
      }
    })
    
    return {
      total: totalAchievements,
      unlocked: unlockedCount,
      progress: progressPercentage,
      categories: categoryStats,
      recentlyUnlocked
    }
  }
  
  // 获取成就详情
  const getAchievementDetails = (achievementId) => {
    const achievement = achievements[achievementId]
    if (!achievement) return null
    
    const badgeData = achievementsData.badges[achievement.reward.value]
    const rarityData = achievementsData.rarity_levels[achievement.rarity]
    
    return {
      ...achievement,
      badge: badgeData,
      rarity: rarityData,
      category: achievementsData.categories[achievement.category]
    }
  }
  
  // 获取所有成就
  const getAllAchievements = () => {
    return Object.keys(achievements).map(id => getAchievementDetails(id))
  }
  
  // 获取未解锁成就
  const getLockedAchievements = () => {
    return Object.keys(achievements)
      .filter(id => !achievements[id].unlocked)
      .map(id => getAchievementDetails(id))
  }
  
  // 获取已解锁成就
  const getUnlockedAchievements = () => {
    return unlockedAchievements.map(id => getAchievementDetails(id))
  }
  
  // 重置成就（用于调试）
  const resetAchievements = () => {
    const resetAchievementsData = {}
    Object.keys(achievementsData.achievements).forEach(key => {
      resetAchievementsData[key] = {
        ...achievementsData.achievements[key],
        unlocked: false,
        progress: 0,
        unlockedAt: null
      }
    })
    
    setAchievements(resetAchievementsData)
    setUnlockedAchievements([])
    setRecentlyUnlocked([])
    
    localStorage.removeItem('gameAchievements')
    localStorage.removeItem('unlockedAchievements')
  }
  
  const value = {
    achievements,
    unlockedAchievements,
    recentlyUnlocked,
    showNotification,
    checkAchievement,
    unlockAchievement,
    getAchievementStats,
    getAchievementDetails,
    getAllAchievements,
    getLockedAchievements,
    getUnlockedAchievements,
    resetAchievements,
    setShowNotification
  }
  
  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  )
}

// 成就钩子
export const useAchievements = () => {
  const context = useContext(AchievementContext)
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider')
  }
  return context
}

// 成就通知组件
export const AchievementNotification = () => {
  const { showNotification, recentlyUnlocked, getAchievementDetails, setShowNotification } = useAchievements()
  const [currentNotification, setCurrentNotification] = useState(null)
  
  useEffect(() => {
    if (showNotification && recentlyUnlocked.length > 0) {
      const achievementId = recentlyUnlocked[0]
      const achievement = getAchievementDetails(achievementId)
      
      if (achievement) {
        setCurrentNotification(achievement)
        
        // 5秒后自动关闭
        const timer = setTimeout(() => {
          setShowNotification(false)
          setCurrentNotification(null)
        }, 5000)
        
        return () => clearTimeout(timer)
      }
    }
  }, [showNotification, recentlyUnlocked, getAchievementDetails, setShowNotification])
  
  if (!showNotification || !currentNotification) return null
  
  const rarityColors = {
    common: 'bg-gray-100 text-gray-800',
    rare: 'bg-blue-100 text-blue-800',
    epic: 'bg-purple-100 text-purple-800',
    legendary: 'bg-yellow-100 text-yellow-800'
  }
  
  return (
    <div className="achievement-notification">
      <div className="notification-content">
        <div className="achievement-icon">{currentNotification.icon}</div>
        <div className="achievement-info">
          <h3 className="achievement-title">🎉 成就解锁！</h3>
          <div className="achievement-name">{currentNotification.name}</div>
          <div className="achievement-description">{currentNotification.description}</div>
          <div className={`achievement-rarity ${rarityColors[currentNotification.rarity]}`}>
            {currentNotification.rarity}
          </div>
        </div>
        <button 
          className="notification-close"
          onClick={() => setShowNotification(false)}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default AchievementProvider