import React, { useState, useEffect, useRef } from 'react'

// 音效管理器组件
const AudioManager = ({ 
  backgroundMusic = true,
  soundEffects = true,
  onMusicToggle,
  onSoundToggle 
}) => {
  const [isMusicEnabled, setIsMusicEnabled] = useState(backgroundMusic)
  const [isSoundEnabled, setIsSoundEnabled] = useState(soundEffects)
  const [currentMusic, setCurrentMusic] = useState('main-theme')
  const [musicVolume, setMusicVolume] = useState(0.3)
  const [soundVolume, setSoundVolume] = useState(0.5)
  
  const audioRef = useRef(null)
  const soundEffectsRef = useRef({})
  
  // 音效文件映射
  const soundFiles = {
    // 背景音乐
    'main-theme': '/assets/sounds/main-theme.mp3',
    'cooking-music': '/assets/sounds/cooking-music.mp3',
    'result-music': '/assets/sounds/result-music.mp3',
    
    // 交互音效
    'card-flip': '/assets/sounds/card-flip.mp3',
    'card-select': '/assets/sounds/card-select.mp3',
    'card-deselect': '/assets/sounds/card-deselect.mp3',
    'button-click': '/assets/sounds/button-click.mp3',
    'button-hover': '/assets/sounds/button-hover.mp3',
    'success': '/assets/sounds/success.mp3',
    'error': '/assets/sounds/error.mp3',
    'cooking-start': '/assets/sounds/cooking-start.mp3',
    'cooking-complete': '/assets/sounds/cooking-complete.mp3',
    'planet-change': '/assets/sounds/planet-change.mp3',
    'achievement-unlock': '/assets/sounds/achievement-unlock.mp3'
  }
  
  // 初始化音效
  useEffect(() => {
    // 预加载音效文件
    Object.keys(soundFiles).forEach(key => {
      const audio = new Audio(soundFiles[key])
      audio.volume = soundVolume
      soundEffectsRef.current[key] = audio
    })
    
    // 设置背景音乐
    if (audioRef.current && isMusicEnabled) {
      audioRef.current.volume = musicVolume
      audioRef.current.loop = true
      audioRef.current.play().catch(error => {
        console.log('自动播放被阻止，需要用户交互:', error)
      })
    }
    
    return () => {
      // 清理音效
      Object.values(soundEffectsRef.current).forEach(audio => {
        audio.pause()
        audio.src = ''
      })
    }
  }, [])
  
  // 播放背景音乐
  const playBackgroundMusic = (musicKey) => {
    if (!isMusicEnabled || !audioRef.current) return
    
    setCurrentMusic(musicKey)
    const musicSrc = soundFiles[musicKey]
    
    if (audioRef.current.src !== musicSrc) {
      audioRef.current.src = musicSrc
      audioRef.current.play().catch(error => {
        console.log('背景音乐播放失败:', error)
      })
    }
  }
  
  // 播放音效
  const playSound = (soundKey) => {
    if (!isSoundEnabled || !soundEffectsRef.current[soundKey]) return
    
    const audio = soundEffectsRef.current[soundKey]
    audio.currentTime = 0 // 重置到开始
    audio.play().catch(error => {
      console.log('音效播放失败:', error)
    })
  }
  
  // 切换音乐开关
  const toggleMusic = () => {
    const newState = !isMusicEnabled
    setIsMusicEnabled(newState)
    
    if (audioRef.current) {
      if (newState) {
        audioRef.current.play().catch(error => {
          console.log('音乐恢复播放失败:', error)
        })
      } else {
        audioRef.current.pause()
      }
    }
    
    if (onMusicToggle) {
      onMusicToggle(newState)
    }
  }
  
  // 切换音效开关
  const toggleSound = () => {
    const newState = !isSoundEnabled
    setIsSoundEnabled(newState)
    
    if (onSoundToggle) {
      onSoundToggle(newState)
    }
  }
  
  // 调整音乐音量
  const setMusicVolumeLevel = (volume) => {
    setMusicVolume(volume)
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }
  
  // 调整音效音量
  const setSoundVolumeLevel = (volume) => {
    setSoundVolume(volume)
    Object.values(soundEffectsRef.current).forEach(audio => {
      audio.volume = volume
    })
  }
  
  // 音效播放函数（供外部调用）
  const sounds = {
    playCardFlip: () => playSound('card-flip'),
    playCardSelect: () => playSound('card-select'),
    playCardDeselect: () => playSound('card-deselect'),
    playButtonClick: () => playSound('button-click'),
    playButtonHover: () => playSound('button-hover'),
    playSuccess: () => playSound('success'),
    playError: () => playSound('error'),
    playCookingStart: () => playSound('cooking-start'),
    playCookingComplete: () => playSound('cooking-complete'),
    playPlanetChange: () => playSound('planet-change'),
    playAchievementUnlock: () => playSound('achievement-unlock')
  }
  
  return (
    <div className="audio-manager">
      {/* 背景音乐音频元素 */}
      <audio 
        ref={audioRef} 
        loop 
        volume={musicVolume}
      />
      
      {/* 音效控制面板 */}
      <div className="audio-controls">
        <button 
          className={`audio-toggle ${isMusicEnabled ? 'enabled' : 'disabled'}`}
          onClick={toggleMusic}
          title={isMusicEnabled ? '关闭音乐' : '开启音乐'}
        >
          🎵 {isMusicEnabled ? '音乐开启' : '音乐关闭'}
        </button>
        
        <button 
          className={`audio-toggle ${isSoundEnabled ? 'enabled' : 'disabled'}`}
          onClick={toggleSound}
          title={isSoundEnabled ? '关闭音效' : '开启音效'}
        >
          🔊 {isSoundEnabled ? '音效开启' : '音效关闭'}
        </button>
        
        {/* 音量控制 */}
        {isMusicEnabled && (
          <div className="volume-control">
            <label>音乐音量:</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={musicVolume}
              onChange={(e) => setMusicVolumeLevel(parseFloat(e.target.value))}
            />
            <span>{Math.round(musicVolume * 100)}%</span>
          </div>
        )}
        
        {isSoundEnabled && (
          <div className="volume-control">
            <label>音效音量:</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={soundVolume}
              onChange={(e) => setSoundVolumeLevel(parseFloat(e.target.value))}
            />
            <span>{Math.round(soundVolume * 100)}%</span>
          </div>
        )}
      </div>
      
      {/* 音效API供其他组件使用 */}
      <div className="sound-api" data-sounds={JSON.stringify(sounds)} />
    </div>
  )
}

// 高阶组件：为组件添加音效功能
export const withSoundEffects = (WrappedComponent) => {
  return function WithSoundEffects(props) {
    const soundApiRef = useRef(null)
    
    useEffect(() => {
      // 获取音效API
      const soundApiElement = document.querySelector('.sound-api')
      if (soundApiElement) {
        const sounds = JSON.parse(soundApiElement.dataset.sounds)
        soundApiRef.current = sounds
      }
    }, [])
    
    // 为组件添加音效方法
    const enhancedProps = {
      ...props,
      sounds: {
        playCardFlip: () => soundApiRef.current?.playCardFlip(),
        playCardSelect: () => soundApiRef.current?.playCardSelect(),
        playCardDeselect: () => soundApiRef.current?.playCardDeselect(),
        playButtonClick: () => soundApiRef.current?.playButtonClick(),
        playButtonHover: () => soundApiRef.current?.playButtonHover(),
        playSuccess: () => soundApiRef.current?.playSuccess(),
        playError: () => soundApiRef.current?.playError(),
        playCookingStart: () => soundApiRef.current?.playCookingStart(),
        playCookingComplete: () => soundApiRef.current?.playCookingComplete(),
        playPlanetChange: () => soundApiRef.current?.playPlanetChange(),
        playAchievementUnlock: () => soundApiRef.current?.playAchievementUnlock()
      }
    }
    
    return <WrappedComponent {...enhancedProps} />
  }
}

// 音效触发钩子
export const useSoundEffects = () => {
  const [soundApi, setSoundApi] = useState(null)
  
  useEffect(() => {
    const soundApiElement = document.querySelector('.sound-api')
    if (soundApiElement) {
      const sounds = JSON.parse(soundApiElement.dataset.sounds)
      setSoundApi(sounds)
    }
  }, [])
  
  return {
    playCardFlip: () => soundApi?.playCardFlip(),
    playCardSelect: () => soundApi?.playCardSelect(),
    playCardDeselect: () => soundApi?.playCardDeselect(),
    playButtonClick: () => soundApi?.playButtonClick(),
    playButtonHover: () => soundApi?.playButtonHover(),
    playSuccess: () => soundApi?.playSuccess(),
    playError: () => soundApi?.playError(),
    playCookingStart: () => soundApi?.playCookingStart(),
    playCookingComplete: () => soundApi?.playCookingComplete(),
    playPlanetChange: () => soundApi?.playPlanetChange(),
    playAchievementUnlock: () => soundApi?.playAchievementUnlock()
  }
}

export default AudioManager