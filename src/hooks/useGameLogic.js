import { useState, useCallback, useEffect, useMemo } from 'react'
import { calculateEnvironmentalImpact, calculatePlanetStatus, checkAchievements, identifyRecipes, generateTips, getAllRecipes } from '../utils/dataProcessing'

export const useGameLogic = () => {
  // 游戏状态
  const [gameStage, setGameStage] = useState('intro') // intro, selecting, cooking, result
  const [selectedFoods, setSelectedFoods] = useState([])
  const [highlightedFoods, setHighlightedFoods] = useState({});
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
  const [isCookbookOpen, setIsCookbookOpen] = useState(false);
  const [isAchievementGalleryOpen, setIsAchievementGalleryOpen] = useState(false);
  const [unlockedRecipeIds, setUnlockedRecipeIds] = useState([]);

  const recipes = useMemo(() => getAllRecipes(), []);

  // 计算当前选择总览
  const selectionStats = useMemo(() => {
    const RECOMMENDED_MAX_ITEMS = 5; // 定义一餐推荐的最大食物数量作为参考基准

    if (selectedFoods.length === 0) {
      return {
        carbonFootprint: 0,
        waterUsage: 0,
        healthScore: 0,
        carbonFootprintNormalized: 0,
        waterUsageNormalized: 0,
      };
    }

    const totals = selectedFoods.reduce((acc, food) => {
      acc.carbonFootprint += food.carbonFootprint;
      acc.waterUsage += food.waterUsage;
      acc.healthScore += food.healthScore;
      return acc;
    }, {
      carbonFootprint: 0,
      waterUsage: 0,
      healthScore: 0,
    });

    // 平均健康分
    totals.healthScore = totals.healthScore / selectedFoods.length;
    
    // 标准化环境影响指标
    // 假设单个食物的平均影响值为 0.4 (这是一个估算值，可以调整)
    // 那么推荐最大数量食物的总影响就是 RECOMMENDED_MAX_ITEMS * 0.4 = 2
    const maxImpact = RECOMMENDED_MAX_ITEMS * 0.5;
    totals.carbonFootprintNormalized = Math.min(totals.carbonFootprint / maxImpact, 1);
    totals.waterUsageNormalized = Math.min(totals.waterUsage / maxImpact, 1);

    return totals;
  }, [selectedFoods]);

  // 更新高亮食物的逻辑
  const updateHighlightedFoods = useCallback((currentSelectedFoods) => {
    const highlights = {};
    const selectedIds = new Set(currentSelectedFoods.map(f => f.id));

    // 找出所有已选择食物可以组成的完整食谱
    const completableRecipes = recipes.filter(recipe =>
      recipe.ingredients.every(id => selectedIds.has(id))
    );

    // 只有当存在一个或多个完整食谱时，才进行高亮
    if (completableRecipes.length > 0) {
      for (const recipe of completableRecipes) {
        for (const ingredientId of recipe.ingredients) {
          if (!highlights[ingredientId]) {
            highlights[ingredientId] = { count: 0, colors: [], isComplete: true };
          }
          highlights[ingredientId].count++;
          highlights[ingredientId].colors.push(recipe.color || 'var(--primary-color)');
        }
      }
    }
    
    setHighlightedFoods(highlights);
  }, [recipes]);

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
    const newSelectedFoods = selectedFoods.some(item => item.id === food.id)
      ? selectedFoods.filter(item => item.id !== food.id)
      : [...selectedFoods, food];
    
    setSelectedFoods(newSelectedFoods);
    updateHighlightedFoods(newSelectedFoods);
  }, [selectedFoods, updateHighlightedFoods]);

  // 为了保持向后兼容，保留旧的函数名，但指向新逻辑
  const selectFood = toggleFoodSelection;
  const deselectFood = (foodId) => {
    setSelectedFoods(prev => prev.filter(food => food.id !== foodId));
  };

  // 开始烹饪
  const startCooking = useCallback(() => {
    if (selectedFoods.length < 2) return
    
    setGameStage('cooking')
    
    // 识别菜品组合
    const { foundRecipes, unmatchedFoods } = identifyRecipes(selectedFoods);
    setFoundRecipes(foundRecipes);
    setUnmatchedFoods(unmatchedFoods);

    // 在计算环境影响时直接传入菜谱，让函数内部处理加分
    const impact = calculateEnvironmentalImpact(selectedFoods, foundRecipes);
    setEnvironmentalImpact(impact);

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
    
    // 计算星球状态
    const status = calculatePlanetStatus(impact.totalScore);
    setPlanetStatus(status);
    
    // 添加到星球历史（累加效果）
    setPlanetHistory(prev => [...prev, {
      timestamp: Date.now(),
      score: impact.totalScore,
      status: status,
      foods: [...selectedFoods]
    }]);
    
    // 生成提示
    const newTips = generateTips(impact);
    setTips(newTips);
  }, [selectedFoods])

  // 完成烹饪，显示结果
  const completeCooking = useCallback(() => {
    // 将结果数据存入 sessionStorage，以防 location.state 丢失
    try {
      const resultData = {
        environmentalImpact,
        planetStatus,
        foundRecipes,
        unmatchedFoods,
        planetHistory: [...planetHistory, {
          timestamp: Date.now(),
          score: environmentalImpact.totalScore,
          status: planetStatus,
          foods: [...selectedFoods]
        }],
        tips,
      };
      sessionStorage.setItem('lastResultData', JSON.stringify(resultData));
    } catch (error) {
      console.error("Failed to save result to sessionStorage", error);
    }

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
    sessionStorage.removeItem('lastResultData');
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
    sessionStorage.removeItem('lastResultData');
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

  const openAchievementGallery = useCallback(() => setIsAchievementGalleryOpen(true), []);
  const closeAchievementGallery = useCallback(() => setIsAchievementGalleryOpen(false), []);

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
    isAchievementGalleryOpen,
    highlightedFoods,
    
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
    openAchievementGallery,
    closeAchievementGallery,
    
    // 计算属性
    canStartCooking,
    selectionStats,
  }
}