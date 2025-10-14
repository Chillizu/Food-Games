import { useState, useCallback, useEffect } from 'react'
import { calculateEnvironmentalImpact, calculatePlanetStatus, checkAchievements, identifyRecipes, generateTips } from '../utils/dataProcessing'

export const useGameLogic = () => {
  // 游戏状态
  const [gameStage, setGameStage] = useState('intro') // intro, selecting, cooking, result
  const [selectedFoods, setSelectedFoods] = useState([])
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
  const [tips, setTips] = useState([])
  const [foundRecipes, setFoundRecipes] = useState([])
  const [unmatchedFoods, setUnmatchedFoods] = useState([])
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  const [isCookbookOpen, setIsCookbookOpen] = useState(false)
  const [unlockedRecipeIds, setUnlockedRecipeIds] = useState([])

  // 从 localStorage 加载已解锁的图鉴
  useEffect(() => {
    try {
      const savedRecipes = localStorage.getItem('unlockedRecipeIds');
      if (savedRecipes) {
        setUnlockedRecipeIds(JSON.parse(savedRecipes));
      }
    } catch (error) {
      console.error("Failed to load recipes from localStorage", error);
    }
  }, []);

  // 切换食材选择状态（选择/取消选择）
  const toggleFoodSelection = useCallback((food) => {
    setSelectedFoods(prev => {
      const isSelected = prev.some(item => item.id === food.id);
      if (isSelected) {
        return prev.filter(item => item.id !== food.id);
      } else {
        return [...prev, food];
      }
    });
  }, []);

  // 为了保持向后兼容，保留旧的函数名，但指向新逻辑
  const selectFood = toggleFoodSelection;
  const deselectFood = (foodId) => {
    setSelectedFoods(prev => prev.filter(food => food.id !== foodId));
  };

  // 开始烹饪
  const startCooking = useCallback(() => {
    if (selectedFoods.length < 2) return
    
    setGameStage('cooking')
    
    // 计算环境影响
    const impact = calculateEnvironmentalImpact(selectedFoods);
    
    // 识别菜品组合
    const { foundRecipes, unmatchedFoods } = identifyRecipes(selectedFoods);
    setFoundRecipes(foundRecipes);
    setUnmatchedFoods(unmatchedFoods);

    // 解锁并保存新菜谱
    if (foundRecipes.length > 0) {
      const newRecipeIds = foundRecipes.map(r => r.id);
      setUnlockedRecipeIds(prevUnlocked => {
        const updatedIds = [...new Set([...prevUnlocked, ...newRecipeIds])];
        try {
          localStorage.setItem('unlockedRecipeIds', JSON.stringify(updatedIds));
        } catch (error) {
          console.error("Failed to save recipes to localStorage", error);
        }
        return updatedIds;
      });
    }

    // 计算总分（基础分 + 菜品加分）
    const recipeBonus = foundRecipes.reduce((sum, recipe) => sum + recipe.bonusScore, 0);
    const finalScore = impact.totalScore + recipeBonus;
    
    const finalImpact = { ...impact, totalScore: finalScore };
    setEnvironmentalImpact(finalImpact);
    
    // 计算星球状态
    const status = calculatePlanetStatus(finalImpact.totalScore);
    setPlanetStatus(status);
    
    // 添加到星球历史（累加效果）
    setPlanetHistory(prev => [...prev, {
      timestamp: Date.now(),
      score: finalImpact.totalScore,
      status: status,
      foods: [...selectedFoods]
    }]);
    
    // 生成提示
    const newTips = generateTips(finalImpact);
    setTips(newTips);
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
    setTips([])
    setUnlockedAchievements([])
    setFoundRecipes([])
    setUnmatchedFoods([])
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
    setTips([])
    setUnlockedAchievements([])
    setFoundRecipes([])
    setUnmatchedFoods([])
  }, [])

  // 开始新游戏
  const startNewGame = useCallback(() => {
    setGameStage('selecting')
    setSelectedFoods([])
    setEnvironmentalImpact(null)
    setPlanetStatus(null)
    setTips([])
    setUnlockedAchievements([])
    setFoundRecipes([])
    setUnmatchedFoods([])
  }, [])

  // 检查是否可以开始烹饪
  const canStartCooking = selectedFoods.length >= 2

  // 图鉴控制
  const openCookbook = useCallback(() => setIsCookbookOpen(true), []);
  const closeCookbook = useCallback(() => setIsCookbookOpen(false), []);

  return {
    // 状态
    gameStage,
    selectedFoods,
    planetHistory,
    gameStats,
    environmentalImpact,
    planetStatus,
    tips,
    foundRecipes,
    unmatchedFoods,
    unlockedAchievements,
    isCookbookOpen,
    unlockedRecipeIds,
    
    // 操作
    toggleFoodSelection,
    selectFood,
    deselectFood,
    startCooking,
    completeCooking,
    restartGame,
    resetGame,
    startNewGame,
    openCookbook,
    closeCookbook,
    
    // 计算属性
    canStartCooking
  }
}