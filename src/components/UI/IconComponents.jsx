import React from 'react'

// 卡通风格图标组件库
const IconComponents = {
  // 游戏相关图标
  GameIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),

  // 食物相关图标
  FoodIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C10 2 8 4 8 6C8 8 10 10 12 10C14 10 16 8 16 6C16 4 14 2 12 2Z" fill="currentColor"/>
      <path d="M8 14C6 14 4 16 4 18C4 20 6 22 8 22H16C18 22 20 20 20 18C20 16 18 14 16 14H8Z" fill="currentColor"/>
      <circle cx="12" cy="6" r="1" fill="white"/>
      <circle cx="10" cy="18" r="1" fill="white"/>
      <circle cx="14" cy="18" r="1" fill="white"/>
    </svg>
  ),

  // 环保相关图标
  EcoIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15 9H22L16 14L19 21L12 16L5 21L8 14L2 9H9L12 2Z" fill="currentColor"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
    </svg>
  ),

  // 星球相关图标
  PlanetIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="12" cy="12" rx="8" ry="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 12C4 12 6 8 12 8C18 8 20 12 20 12" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
    </svg>
  ),

  // 烹饪相关图标
  CookIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8 2 5 5 5 9C5 13 8 16 12 16C16 16 19 13 19 9C19 5 16 2 12 2Z" fill="currentColor"/>
      <path d="M5 9C5 9 3 11 3 14C3 17 5 19 8 19H16C19 19 21 17 21 14C21 11 19 9 19 9" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M8 19V21" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 19V21" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="6" r="1" fill="white"/>
    </svg>
  ),

  // 成就相关图标
  TrophyIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 9H3V21H21V9H19" stroke="currentColor" strokeWidth="2"/>
      <path d="M5 9C5 9 7 5 12 5C17 5 19 9 19 9" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="14" r="2" fill="currentColor"/>
      <path d="M9 21V19C9 17 10 16 12 16C14 16 15 17 15 19V21" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  // 健康相关图标
  HealthIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15 9H22L16 14L19 21L12 16L5 21L8 14L2 9H9L12 2Z" fill="currentColor"/>
      <path d="M12 8V12M12 12V16M12 12H8M12 12H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),

  // 水资源相关图标
  WaterIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 8 6 8 12C8 16 10 18 12 20C14 18 16 16 16 12C16 6 12 2 12 2Z" fill="currentColor"/>
      <ellipse cx="12" cy="12" rx="2" ry="3" fill="white"/>
    </svg>
  ),

  // 碳排放相关图标
  CarbonIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),

  // 土地使用相关图标
  LandIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="16" width="16" height="4" fill="currentColor"/>
      <path d="M4 16L12 8L20 16" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="8" r="2" fill="currentColor"/>
    </svg>
  ),

  // 植物相关图标
  PlantIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22V12" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 16C8 16 6 14 6 12C6 10 8 8 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 16C16 16 18 14 18 12C18 10 16 8 16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 8C12 8 10 6 10 4C10 2 12 2 12 2C12 2 14 2 14 4C14 6 12 8 12 8Z" fill="currentColor"/>
      <circle cx="12" cy="12" r="1" fill="white"/>
    </svg>
  ),

  // 动物相关图标
  AnimalIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" fill="currentColor"/>
      <circle cx="9" cy="10" r="1" fill="white"/>
      <circle cx="15" cy="10" r="1" fill="white"/>
      <path d="M8 14C8 14 10 16 12 16C14 16 16 14 16 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 2C12 2 10 4 10 6C10 8 12 10 12 10C12 10 14 8 14 6C14 4 12 2 12 2Z" fill="currentColor"/>
    </svg>
  ),

  // 昆虫相关图标
  InsectIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="6" ry="8" fill="currentColor"/>
      <circle cx="9" cy="10" r="1" fill="white"/>
      <circle cx="15" cy="10" r="1" fill="white"/>
      <path d="M8 14C8 14 10 16 12 16C14 16 16 14 16 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6 8C6 8 4 6 4 4C4 2 6 2 6 2" stroke="currentColor" strokeWidth="2"/>
      <path d="M18 8C18 8 20 6 20 4C20 2 18 2 18 2" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 16C6 16 4 18 4 20C4 22 6 22 6 22" stroke="currentColor" strokeWidth="2"/>
      <path d="M18 16C18 16 20 18 20 20C20 22 18 22 18 22" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  // 实验室培育相关图标
  LabIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="16" height="12" rx="2" fill="currentColor"/>
      <rect x="8" y="4" width="8" height="4" fill="currentColor"/>
      <circle cx="12" cy="14" r="2" fill="white"/>
      <path d="M10 14L12 16L14 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),

  // 快餐相关图标
  FastFoodIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12C3 12 5 8 12 8C19 8 21 12 21 12" stroke="currentColor" strokeWidth="2"/>
      <path d="M3 12V16C3 18 5 20 7 20H17C19 20 21 18 21 16V12" stroke="currentColor" strokeWidth="2"/>
      <circle cx="7" cy="14" r="1" fill="currentColor"/>
      <circle cx="12" cy="14" r="1" fill="currentColor"/>
      <circle cx="17" cy="14" r="1" fill="currentColor"/>
    </svg>
  ),

  // 蔬菜相关图标
  VegetableIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="8" ry="10" fill="currentColor"/>
      <path d="M12 2C12 2 10 4 10 6C10 8 12 10 12 10C12 10 14 8 14 6C14 4 12 2 12 2Z" fill="white"/>
      <circle cx="12" cy="12" r="1" fill="white"/>
    </svg>
  ),

  // 肉类相关图标
  MeatIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8 2 5 5 5 9C5 13 8 16 12 16C16 16 19 13 19 9C19 5 16 2 12 2Z" fill="currentColor"/>
      <circle cx="12" cy="9" r="1" fill="white"/>
      <circle cx="9" cy="12" r="1" fill="white"/>
      <circle cx="15" cy="12" r="1" fill="white"/>
    </svg>
  ),

  // 豆类相关图标
  BeanIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="6" ry="8" fill="currentColor"/>
      <path d="M12 4C12 4 10 6 10 8C10 10 12 12 12 12C12 12 14 10 14 8C14 6 12 4 12 4Z" fill="white"/>
      <circle cx="12" cy="12" r="1" fill="white"/>
    </svg>
  ),

  // 谷物相关图标
  GrainIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L8 8H16L12 2Z" fill="currentColor"/>
      <path d="M8 8L6 14H18L16 8H8Z" fill="currentColor"/>
      <path d="M6 14L4 20H20L18 14H6Z" fill="currentColor"/>
      <circle cx="12" cy="12" r="1" fill="white"/>
    </svg>
  ),

  // 奶制品相关图标
  DairyIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8 2 5 5 5 9V15C5 19 8 22 12 22C16 22 19 19 19 15V9C19 5 16 2 12 2Z" fill="currentColor"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
      <path d="M8 8H16" stroke="white" strokeWidth="2"/>
    </svg>
  ),

  // 蛋类相关图标
  EggIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="6" ry="8" fill="currentColor"/>
      <ellipse cx="12" cy="12" rx="3" ry="4" fill="white"/>
    </svg>
  ),

  // 水果相关图标
  FruitIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" fill="currentColor"/>
      <path d="M12 4C12 4 10 6 10 8C10 10 12 12 12 12C12 12 14 10 14 8C14 6 12 4 12 4Z" fill="white"/>
      <circle cx="12" cy="12" r="1" fill="white"/>
    </svg>
  ),

  // 坚果相关图标
  NutIcon: ({ className = "" }) => (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8 2 5 5 5 9C5 13 8 16 12 16C16 16 19 13 19 9C19 5 16 2 12 2Z" fill="currentColor"/>
      <path d="M12 6C12 6 10 8 10 10C10 12 12 14 12 14C12 14 14 12 14 10C14 8 12 6 12 6Z" fill="white"/>
      <circle cx="12" cy="10" r="1" fill="white"/>
    </svg>
  )
}

export default IconComponents