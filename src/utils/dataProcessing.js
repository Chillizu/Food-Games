import foodsData from '../data/foods.json'
import achievementsData from '../data/achievements.json'

// 计算环境影响分数
export function calculateEnvironmentalImpact(selectedFoods) {
  if (!selectedFoods || selectedFoods.length === 0) {
    return {
      carbonFootprint: 0,
      waterUsage: 0,
      landUsage: 0,
      healthScore: 0,
      totalScore: 0
    }
  }

  const total = selectedFoods.reduce((acc, food) => ({
    carbonFootprint: acc.carbonFootprint + food.carbonFootprint,
    waterUsage: acc.waterUsage + food.waterUsage,
    landUsage: acc.landUsage + food.landUsage,
    healthScore: acc.healthScore + food.healthScore
  }), {
    carbonFootprint: 0,
    waterUsage: 0,
    landUsage: 0,
    healthScore: 0
  })

  // 计算平均值
  const count = selectedFoods.length
  const averages = {
    carbonFootprint: total.carbonFootprint / count,
    waterUsage: total.waterUsage / count,
    landUsage: total.landUsage / count,
    healthScore: total.healthScore / count
  }

  // 计算综合分数 (0-100，越高越好)
  const totalScore = Math.round(
    (100 - averages.carbonFootprint * 50) * 0.3 +  // 碳排放权重30%
    (100 - averages.waterUsage * 50) * 0.3 +     // 水资源权重30%
    (100 - averages.landUsage * 50) * 0.2 +      // 土地占用权重20%
    averages.healthScore * 100 * 0.2             // 健康度权重20%
  )

  return {
    ...averages,
    totalScore: Math.max(0, Math.min(100, totalScore))
  }
}

// 计算星球状态
export function calculatePlanetStatus(environmentalScore) {
  if (environmentalScore >= 80) {
    return {
      health: 'excellent',
      color: '#22c55e',
      description: '星球生态完美，生机勃勃！',
      animals: ['🐨', '🦋', '🐠', '🦌'],
      plants: ['🌳', '🌻', '🌺', '🍃']
    }
  } else if (environmentalScore >= 60) {
    return {
      health: 'good',
      color: '#84cc16',
      description: '星球生态良好，继续保持！',
      animals: ['🐿️', '🦆', '🐢', '🐇'],
      plants: ['🌿', '🌱', '🌸', '🌾']
    }
  } else if (environmentalScore >= 40) {
    return {
      health: 'fair',
      color: '#eab308',
      description: '星球生态一般，需要改善',
      animals: ['🐭', '🦎', '🐸', '🦗'],
      plants: ['🌵', '🌾', '🍀', '🌿']
    }
  } else if (environmentalScore >= 20) {
    return {
      health: 'poor',
      color: '#f97316',
      description: '星球生态恶化，急需行动',
      animals: ['🐁', '🐛', '🕷️', '🦟'],
      plants: ['🌾', '🍂', '🌱', '🌵']
    }
  } else {
    return {
      health: 'critical',
      color: '#dc2626',
      description: '星球生态崩溃，必须改变！',
      animals: ['🐜', '🪲', '🦟', '🦗'],
      plants: ['🥀', '🍂', '🌵', '🌱']
    }
  }
}

// 检查成就解锁
export function checkAchievements(selectedFoods, gameStats) {
  const achievements = []
  const environmentalImpact = calculateEnvironmentalImpact(selectedFoods)
  
  // 初次尝试
  if (gameStats.totalMeals >= 1) {
    achievements.push('first-meal')
  }

  // 环保战士 - 连续5次低碳饮食
  if (gameStats.ecoStreak >= 5) {
    achievements.push('eco-warrior')
  }

  // 美食探索家 - 尝试所有类别
  const categories = new Set(selectedFoods.map(food => food.category))
  if (categories.size === 5) { // plant, animal, insect, lab, processed
    achievements.push('food-explorer')
  }

  // 健康厨师 - 连续3次高健康度
  if (gameStats.healthyStreak >= 3) {
    achievements.push('healthy-chef')
  }

  // 发明家 - 使用实验室食物
  if (selectedFoods.some(food => food.category === 'lab')) {
    achievements.push('inventor')
  }

  // 素食大师 - 连续10次植物性食物
  if (gameStats.vegetarianStreak >= 10) {
    achievements.push('vegetarian-master')
  }

  // 均衡饮食 - 包含所有营养类别
  if (categories.size >= 3 && selectedFoods.length >= 3) {
    achievements.push('balanced-diet')
  }

  // 节水专家 - 低水足迹
  if (environmentalImpact.waterUsage < 0.3) {
    achievements.push('water-saver')
  }

  // 碳中和达人 - 低碳足迹
  if (environmentalImpact.carbonFootprint < 0.2) {
    achievements.push('carbon-neutral')
  }

  // 美食家 - 解锁20种食谱
  if (gameStats.uniqueRecipes >= 20) {
    achievements.push('gourmet-chef')
  }

  return achievements
}

// 识别食谱
export function identifyRecipe(selectedFoods) {
  const foodIds = selectedFoods.map(food => food.id).sort()
  
  // 检查预设食谱
  const recipes = achievementsData.recipes
  for (const recipe of recipes) {
    const ingredientIds = recipe.ingredients.sort()
    if (JSON.stringify(foodIds) === JSON.stringify(ingredientIds)) {
      return recipe
    }
  }

  // 如果没有匹配的预设食谱，创建一个自定义食谱
  const environmentalImpact = calculateEnvironmentalImpact(selectedFoods)
  
  return {
    id: `custom_${Date.now()}`,
    name: '自定义料理',
    description: '你的独特创造！',
    ingredients: foodIds,
    carbonScore: environmentalImpact.carbonFootprint,
    waterScore: environmentalImpact.waterUsage,
    healthScore: environmentalImpact.healthScore
  }
}

// 获取食材数据
export function getFoods() {
  return foodsData.foods
}

// 获取食材分类
export function getFoodCategories() {
  return foodsData.categories
}

// 获取成就数据
export function getAchievements() {
  return achievementsData.achievements
}

// 获取食谱数据
export function getRecipes() {
  return achievementsData.recipes
}

// 生成游戏提示
export function generateTips(environmentalImpact) {
  const tips = []
  
  if (environmentalImpact.carbonFootprint > 0.7) {
    tips.push('🌍 碳排放较高，试试更多蔬菜和植物蛋白吧！')
  }
  
  if (environmentalImpact.waterUsage > 0.6) {
    tips.push('💧 水资源消耗较大，选择当季蔬果更环保')
  }
  
  if (environmentalImpact.healthScore < 0.5) {
    tips.push('❤️ 健康度偏低，建议增加新鲜蔬果摄入')
  }
  
  if (environmentalImpact.totalScore >= 80) {
    tips.push('🎉 太棒了！你的选择对地球很友好')
  }
  
  if (tips.length === 0) {
    tips.push('👍 很好的选择！继续保持健康饮食')
  }
  
  return tips
}