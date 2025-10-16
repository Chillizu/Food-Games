import React, { Suspense, useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useGameLogic } from './hooks/useGameLogic'

import IntroScreen from './components/Game/IntroScreen'
import FoodSelectionScreen from './components/Game/FoodSelectionScreen'
import CookingScreen from './components/Game/CookingScreen'
import ResultScreen from './components/Game/ResultScreen'
import LoadingSpinner from './components/UI/LoadingSpinner'
import SelectedCards from './components/Cards/SelectedCards'
import AchievementPopup from './components/UI/AchievementPopup'
import Cookbook from './components/UI/Cookbook'
import AchievementGallery from './components/UI/AchievementGallery'
import { getAchievements } from './utils/dataProcessing'

function App() {
  const gameLogic = useGameLogic()
  const navigate = useNavigate()
  const location = useLocation()

  // Achievement Queue Logic
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [currentAchievement, setCurrentAchievement] = useState(null);

  useEffect(() => {
    if (gameLogic.unlockedAchievements.length > 0) {
      setAchievementQueue(prevQueue => {
        if (prevQueue.length === 0) return [...gameLogic.unlockedAchievements];
        return prevQueue;
      });
    } else {
      setAchievementQueue([]);
    }
  }, [gameLogic.unlockedAchievements]);

  useEffect(() => {
    if (!currentAchievement && achievementQueue.length > 0) {
      const nextAchievementId = achievementQueue;
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

  // Navigation Logic
  useEffect(() => {
    switch (gameLogic.gameStage) {
      case 'intro':
        navigate('/');
        break;
      case 'selecting':
        navigate('/selection');
        break;
      case 'cooking':
        navigate('/cooking');
        break;
      case 'result':
        navigate('/result', {
          state: {
            selectedFoods: gameLogic.selectedFoods,
            environmentalImpact: gameLogic.environmentalImpact,
            planetStatus: gameLogic.planetStatus,
            foundRecipes: gameLogic.foundRecipes,
            unmatchedFoods: gameLogic.unmatchedFoods,
            planetHistory: gameLogic.planetHistory || [],
            tips: gameLogic.tips,
          }
        });
        break;
      default:
        navigate('/');
    }
  }, [gameLogic.gameStage, navigate]);

  const showSidePanel = location.pathname === '/selection' || location.pathname === '/cooking';

  return (
    <>
      <div className="game-layout">
        <main className="main-area">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={
                <IntroScreen
                  onStartGame={gameLogic.startNewGame}
                  gameStats={gameLogic.gameStats}
                  onOpenCookbook={gameLogic.openCookbook}
                  onOpenAchievements={gameLogic.openAchievementGallery}
                  unlockedRecipeIds={gameLogic.unlockedRecipeIds}
                />}
              />
              <Route path="/selection" element={
                <FoodSelectionScreen
                  selectedFoods={gameLogic.selectedFoods}
                  onToggleFoodSelection={gameLogic.toggleFoodSelection}
                  onDeselectFood={gameLogic.deselectFood}
                  onStartCooking={gameLogic.startCooking}
                  canStartCooking={gameLogic.canStartCooking}
                  selectionStats={gameLogic.selectionStats}
                />}
              />
              <Route path="/cooking" element={
                <CookingScreen
                  selectedFoods={gameLogic.selectedFoods}
                  onCompleteCooking={gameLogic.completeCooking}
                />}
              />
              <Route path="/result" element={
                <ResultScreen
                  onNewGame={gameLogic.startNewGame}
                  onOpenCookbook={gameLogic.openCookbook}
                  onOpenAchievements={gameLogic.openAchievementGallery}
                  onResetGame={gameLogic.resetGame}
                  planetStatus={gameLogic.planetStatus}
                  selectedFoods={gameLogic.selectedFoods}
                />}
              />
            </Routes>
          </Suspense>
        </main>
        
        {showSidePanel && (
          <aside className="hand-area">
            <SelectedCards
              selectedFoods={gameLogic.selectedFoods}
              onDeselectFood={gameLogic.deselectFood}
              highlightedFoods={gameLogic.highlightedFoods}
              isLocked={gameLogic.gameStage === 'cooking'}
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
        show={gameLogic.isCookbookOpen}
        onClose={gameLogic.closeCookbook}
        unlockedRecipeIds={gameLogic.unlockedRecipeIds}
      />
      <AchievementGallery
        show={gameLogic.isAchievementGalleryOpen}
        onClose={gameLogic.closeAchievementGallery}
        unlockedAchievementIds={gameLogic.gameStats.unlockedAchievements}
      />
    </>
  )
}

export default App