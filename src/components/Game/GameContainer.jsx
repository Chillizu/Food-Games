import React, { Suspense, useState, useEffect } from 'react'
import { useGameLogic } from '../../hooks/useGameLogic'
import IntroScreen from './IntroScreen'
import FoodSelectionScreen from './FoodSelectionScreen'
import CookingScreen from './CookingScreen'
import ResultScreen from './ResultScreen'
import LoadingSpinner from '../UI/LoadingSpinner'
import SelectedCards from '../Cards/SelectedCards'
import AchievementPopup from '../UI/AchievementPopup'
import Cookbook from '../UI/Cookbook'

const GameContainer = () => {
  const {
    gameStage,
    selectedFoods,
    planetHistory,
    gameStats,
    environmentalImpact,
    planetStatus,
    tips,
    unlockedAchievements,
    toggleFoodSelection,
    startCooking,
    completeCooking,
    restartGame,
    startNewGame,
    canStartCooking,
    foundRecipes,
    unmatchedFoods,
    isCookbookOpen,
    unlockedRecipeIds,
    openCookbook,
    closeCookbook,
    deselectFood,
  } = useGameLogic();

  const [achievementQueue, setAchievementQueue] = useState([]);
  const [currentAchievement, setCurrentAchievement] = useState(null);

  useEffect(() => {
    if (unlockedAchievements.length > 0) {
      setAchievementQueue(prev => [...prev, ...unlockedAchievements]);
    }
  }, [unlockedAchievements]);

  useEffect(() => {
    if (!currentAchievement && achievementQueue.length > 0) {
      const nextAchievementId = achievementQueue[0];
      const allAchievements = getAchievements();
      const nextAchievement = allAchievements.find(a => a.id === nextAchievementId);
      setCurrentAchievement(nextAchievement);
    }
  }, [achievementQueue, currentAchievement]);

  const handleNextAchievement = () => {
    const newQueue = achievementQueue.slice(1);
    setAchievementQueue(newQueue);
    setCurrentAchievement(null);
  };

  const renderCurrentScreen = () => {
    switch (gameStage) {
      case 'intro':
        return (
          <IntroScreen
            onStartGame={startNewGame}
            gameStats={gameStats}
          />
        )
      
      case 'selecting':
        return (
          <FoodSelectionScreen
            selectedFoods={selectedFoods}
            onToggleFoodSelection={toggleFoodSelection}
            onDeselectFood={deselectFood}
            onStartCooking={startCooking}
            canStartCooking={canStartCooking}
          />
        )
      
      case 'cooking':
        return (
          <CookingScreen
            selectedFoods={selectedFoods}
            onCompleteCooking={completeCooking}
          />
        )
      
      case 'result':
        return (
          <ResultScreen
            selectedFoods={selectedFoods}
            environmentalImpact={environmentalImpact}
            planetStatus={planetStatus}
            foundRecipes={foundRecipes}
            unmatchedFoods={unmatchedFoods}
            planetHistory={planetHistory || []}
            tips={tips}
            unlockedAchievements={unlockedAchievements}
            onRestart={restartGame}
            onNewGame={startNewGame}
          />
        )
      
      default:
        return <IntroScreen onStartGame={startNewGame} />
    }
  }

  return (
    <>
      <div className="game-layout">
        <main className="main-area">
          <Suspense fallback={<LoadingSpinner />}>
            {renderCurrentScreen()}
          </Suspense>
        </main>
        
        {(gameStage === 'selecting' || gameStage === 'cooking') && (
          <aside className="hand-area">
            <SelectedCards
              selectedFoods={selectedFoods}
              onDeselectFood={deselectFood}
            />
          </aside>
        )}
      </div>
      {currentAchievement && (
        <AchievementPopup
          achievement={currentAchievement}
          onNext={handleNextAchievement}
          isLast={achievementQueue.length === 1}
        />
      )}
      <Cookbook
        show={isCookbookOpen}
        onClose={closeCookbook}
        unlockedRecipeIds={unlockedRecipeIds}
      />
    </>
  )
}

export default GameContainer