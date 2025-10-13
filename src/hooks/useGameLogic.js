import { useState, useCallback, useEffect } from 'react'
import { calculateEnvironmentalImpact, calculatePlanetStatus, checkAchievements, identifyRecipe, generateTips } from '../utils/dataProcessing'

export const useGameLogic = () => {
  // 游戏状态
  const [gameStage, setGameStage] = useState('intro') // intro, selecting, cooking, result
  const [selectedFoods, setSelectedFoods] = useState([])
  const [additionalRecipes, setAdditionalRecipes] = useState([])
  const [planetHistory, setPlanetHistory] = useState([])
  const [gameStats, setGameStats] = useState({
    totalMeals: 0,
    ecoStreak: 0,
    healthyStreak: 0,
    vegetarianStreak: 0,
    uniqueRecipes: 0,
    unlockedAchievements: []
  })
  const [environmentalImpact, setEnvironmentalImpact] = useState(null)
  const [planetStatus, setPlanetStatus] = useState(null)
  const [currentRecipe, setCurrentRecipe] = useState(null)
  const [tips, setTips] = useState([])
  const [unlockedAchievements, setUnlockedAchievements] = useState([])

  // 选择食材
  const selectFood = useCallback((food) => {
    if (selectedFoods.length >= 9) return
    
    setSelectedFoods(prev => [...prev, food])
  }, [selectedFoods.length])

  // 取消选择食材
  const deselectFood = useCallback((foodId) => {
    setSelectedFoods(prev => prev.filter(food => food.id !== foodId))
  }, [])

  // 开始烹饪
  const startCooking = useCallback(() => {
    if (selectedFoods.length < 2) return
    
    setGameStage('cooking')
    
    // 计算环境影响
    const impact = calculateEnvironmentalImpact(selectedFoods)
    setEnvironmentalImpact(impact)
    
    // 计算星球状态
    const status = calculatePlanetStatus(impact.totalScore)
    setPlanetStatus(status)
    
    // 添加到星球历史（累加效果）
    setPlanetHistory(prev => [...prev, {
      timestamp: Date.now(),
      score: impact.totalScore,
      status: status,
      foods: [...selectedFoods]
    }])
    
    // 识别多个食谱（每2-3种食材一个食谱）
    const recipes = []
    const usedFoods = new Set()
    
    for (let i = 0; i < selectedFoods.length; i += 2) {
      if (i + 1 >= selectedFoods.length) break
      
      const recipeFoods = selectedFoods.slice(i, Math.min(i + 3, selectedFoods.length))
      if (!recipeFoods.some(food => usedFoods.has(food.id))) {
        const recipe = identifyRecipe(recipeFoods)
        recipe.ingredients = recipeFoods.map(f => f.id)
        recipes.push(recipe)
        recipeFoods.forEach(food => usedFoods.add(food.id))
      }
    }
    
    setCurrentRecipe(recipes[0] || null)
    setAdditionalRecipes(recipes.slice(1))
    
    // 生成提示
    const newTips = generateTips(impact)
    setTips(newTips)
  }, [selectedFoods])

  // 完成烹饪，显示结果
  const completeCooking = useCallback(() => {
    setGameStage('result')
    
    // 更新游戏统计
    const newStats = { ...gameStats }
    newStats.totalMeals += 1
    
    // 检查环保连续记录
    if (environmentalImpact && environmentalImpact.totalScore >= 60) {
      newStats.ecoStreak += 1
    } else {
      newStats.ecoStreak = 0
    }
    
    // 检查健康连续记录
    if (environmentalImpact && environmentalImpact.healthScore >= 0.8) {
      newStats.healthyStreak += 1
    } else {
      newStats.healthyStreak = 0
    }
    
    // 检查素食连续记录
    const isVegetarian = selectedFoods.every(food => food.category === 'plant')
    if (isVegetarian) {
      newStats.vegetarianStreak += 1
    } else {
      newStats.vegetarianStreak = 0
    }
    
    // 检查新解锁的成就
    const achievements = checkAchievements(selectedFoods, newStats)
    const newAchievements = achievements.filter(id => !newStats.unlockedAchievements.includes(id))
    
    if (newAchievements.length > 0) {
      newStats.unlockedAchievements = [...newStats.unlockedAchievements, ...newAchievements]
      setUnlockedAchievements(newAchievements)
    }
    
    setGameStats(newStats)
  }, [environmentalImpact, selectedFoods, gameStats])

  // 重新开始游戏
  const restartGame = useCallback(() => {
    setSelectedFoods([])
    setGameStage('selecting')
    setEnvironmentalImpact(null)
    setPlanetStatus(null)
    setCurrentRecipe(null)
    setTips([])
    setUnlockedAchievements([])
  }, [])

  // 重置整个游戏
  const resetGame = useCallback(() => {
    setSelectedFoods([])
    setGameStage('intro')
    setGameStats({
      totalMeals: 0,
      ecoStreak: 0,
      healthyStreak: 0,
      vegetarianStreak: 0,
      uniqueRecipes: 0,
      unlockedAchievements: []
    })
    setEnvironmentalImpact(null)
    setPlanetStatus(null)
    setCurrentRecipe(null)
    setTips([])
    setUnlockedAchievements([])
  }, [])

  // 开始新游戏
  const startNewGame = useCallback(() => {
    setGameStage('selecting')
    setSelectedFoods([])
    setEnvironmentalImpact(null)
    setPlanetStatus(null)
    setCurrentRecipe(null)
    setTips([])
    setUnlockedAchievements([])
  }, [])

  // 检查是否可以开始烹饪
  const canStartCooking = selectedFoods.length >= 2

  return {
    // 状态
    gameStage,
    selectedFoods,
    additionalRecipes,
    planetHistory,
    gameStats,
    environmentalImpact,
    planetStatus,
    currentRecipe,
    tips,
    unlockedAchievements,
    
    // 操作
    selectFood,
    deselectFood,
    startCooking,
    completeCooking,
    restartGame,
    resetGame,
    startNewGame,
    
    // 计算属性
    canStartCooking
  }
}