import React, { useState, useEffect } from 'react'
import { useWindowSize } from '@react-hook/window-size'

// 响应式布局组件
export const ResponsiveLayout = ({ children }) => {
  const [windowWidth] = useWindowSize()
  const [deviceType, setDeviceType] = useState('desktop')
  const [breakpoint, setBreakpoint] = useState('')
  
  // 检测设备类型和断点
  useEffect(() => {
    if (windowWidth < 480) {
      setDeviceType('mobile-small')
      setBreakpoint('xs')
    } else if (windowWidth < 768) {
      setDeviceType('mobile')
      setBreakpoint('sm')
    } else if (windowWidth < 1024) {
      setDeviceType('tablet')
      setBreakpoint('md')
    } else if (windowWidth < 1440) {
      setDeviceType('desktop')
      setBreakpoint('lg')
    } else {
      setDeviceType('large-desktop')
      setBreakpoint('xl')
    }
  }, [windowWidth])
  
  // 为子组件提供响应式上下文
  const contextValue = {
    deviceType,
    breakpoint,
    windowWidth,
    isMobile: deviceType.includes('mobile'),
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isLargeDesktop: deviceType === 'large-desktop'
  }
  
  return (
    <ResponsiveContext.Provider value={contextValue}>
      <div className={`responsive-layout ${deviceType}`}>
        {children}
      </div>
    </ResponsiveContext.Provider>
  )
}

// 响应式上下文
const ResponsiveContext = React.createContext()

// 响应式钩子
export const useResponsive = () => {
  const context = React.useContext(ResponsiveContext)
  if (!context) {
    throw new Error('useResponsive must be used within a ResponsiveLayout')
  }
  return context
}

// 响应式容器组件
export const ResponsiveContainer = ({ 
  children, 
  className = '',
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 3,
  largeDesktopCols = 4,
  gap = 16,
  ...props 
}) => {
  const { deviceType } = useResponsive()
  
  // 根据设备类型确定列数
  const getColumns = () => {
    switch (deviceType) {
      case 'mobile-small':
      case 'mobile':
        return mobileCols
      case 'tablet':
        return tabletCols
      case 'desktop':
        return desktopCols
      case 'large-desktop':
        return largeDesktopCols
      default:
        return desktopCols
    }
  }
  
  const columns = getColumns()
  
  return (
    <div 
      className={`responsive-container ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        ...props.style
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// 响应式网格组件
export const ResponsiveGrid = ({ 
  children, 
  className = '',
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 3,
  largeDesktopCols = 4,
  gap = 16,
  ...props 
}) => {
  const { deviceType } = useResponsive()
  
  const getColumns = () => {
    switch (deviceType) {
      case 'mobile-small':
      case 'mobile':
        return mobileCols
      case 'tablet':
        return tabletCols
      case 'desktop':
        return desktopCols
      case 'large-desktop':
        return largeDesktopCols
      default:
        return desktopCols
    }
  }
  
  const columns = getColumns()
  
  return (
    <div 
      className={`responsive-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap}px`,
        ...props.style
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// 响应式flex组件
export const ResponsiveFlex = ({ 
  children, 
  className = '',
  direction = 'row',
  mobileDirection = 'column',
  tabletDirection = 'column',
  wrap = 'wrap',
  gap = 16,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  ...props 
}) => {
  const { deviceType } = useResponsive()
  
  // 根据设备类型确定方向
  const getDirection = () => {
    if (deviceType.includes('mobile')) return mobileDirection
    if (deviceType === 'tablet') return tabletDirection
    return direction
  }
  
  const flexDirection = getDirection()
  
  return (
    <div 
      className={`responsive-flex ${className}`}
      style={{
        display: 'flex',
        flexDirection: flexDirection,
        flexWrap: wrap,
        gap: `${gap}px`,
        justifyContent,
        alignItems,
        ...props.style
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// 响应式文本组件
export const ResponsiveText = ({ 
  children, 
  className = '',
  mobileSize = '1rem',
  tabletSize = '1.2rem',
  desktopSize = '1.5rem',
  largeDesktopSize = '1.8rem',
  mobileWeight = 400,
  tabletWeight = 500,
  desktopWeight = 600,
  ...props 
}) => {
  const { deviceType } = useResponsive()
  
  // 根据设备类型确定字体大小
  const getFontSize = () => {
    switch (deviceType) {
      case 'mobile-small':
      case 'mobile':
        return mobileSize
      case 'tablet':
        return tabletSize
      case 'desktop':
        return desktopSize
      case 'large-desktop':
        return largeDesktopSize
      default:
        return desktopSize
    }
  }
  
  // 根据设备类型确定字体粗细
  const getFontWeight = () => {
    switch (deviceType) {
      case 'mobile-small':
      case 'mobile':
        return mobileWeight
      case 'tablet':
        return tabletWeight
      case 'desktop':
      case 'large-desktop':
        return desktopWeight
      default:
        return desktopWeight
    }
  }
  
  return (
    <div 
      className={`responsive-text ${className}`}
      style={{
        fontSize: getFontSize(),
        fontWeight: getFontWeight(),
        ...props.style
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// 响应式图片组件
export const ResponsiveImage = ({ 
  src, 
  alt, 
  className = '',
  mobileWidth = '100%',
  tabletWidth = '80%',
  desktopWidth = '60%',
  largeDesktopWidth = '50%',
  mobileHeight = 'auto',
  tabletHeight = 'auto',
  desktopHeight = 'auto',
  largeDesktopHeight = 'auto',
  ...props 
}) => {
  const { deviceType } = useResponsive()
  
  // 根据设备类型确定尺寸
  const getWidth = () => {
    switch (deviceType) {
      case 'mobile-small':
      case 'mobile':
        return mobileWidth
      case 'tablet':
        return tabletWidth
      case 'desktop':
        return desktopWidth
      case 'large-desktop':
        return largeDesktopWidth
      default:
        return desktopWidth
    }
  }
  
  const getHeight = () => {
    switch (deviceType) {
      case 'mobile-small':
      case 'mobile':
        return mobileHeight
      case 'tablet':
        return tabletHeight
      case 'desktop':
        return desktopHeight
      case 'large-desktop':
        return largeDesktopHeight
      default:
        return desktopHeight
    }
  }
  
  return (
    <img 
      src={src}
      alt={alt}
      className={`responsive-image ${className}`}
      style={{
        width: getWidth(),
        height: getHeight(),
        objectFit: 'cover',
        ...props.style
      }}
      {...props}
    />
  )
}

// 响应式间距组件
export const ResponsiveSpacing = ({ 
  children, 
  className = '',
  mobile = 16,
  tablet = 24,
  desktop = 32,
  largeDesktop = 40,
  direction = 'margin',
  sides = 'all'
}) => {
  const { deviceType } = useResponsive()
  
  // 根据设备类型确定间距值
  const getSpacing = () => {
    switch (deviceType) {
      case 'mobile-small':
      case 'mobile':
        return mobile
      case 'tablet':
        return tablet
      case 'desktop':
        return desktop
      case 'large-desktop':
        return largeDesktop
      default:
        return desktop
    }
  }
  
  const spacing = getSpacing()
  
  // 构建样式对象
  const getSpacingStyle = () => {
    const style = {}
    
    if (direction === 'margin') {
      if (sides === 'all' || sides.includes('top')) style.marginTop = `${spacing}px`
      if (sides === 'all' || sides.includes('right')) style.marginRight = `${spacing}px`
      if (sides === 'all' || sides.includes('bottom')) style.marginBottom = `${spacing}px`
      if (sides === 'all' || sides.includes('left')) style.marginLeft = `${spacing}px`
    } else if (direction === 'padding') {
      if (sides === 'all' || sides.includes('top')) style.paddingTop = `${spacing}px`
      if (sides === 'all' || sides.includes('right')) style.paddingRight = `${spacing}px`
      if (sides === 'all' || sides.includes('bottom')) style.paddingBottom = `${spacing}px`
      if (sides === 'all' || sides.includes('left')) style.paddingLeft = `${spacing}px`
    }
    
    return style
  }
  
  return (
    <div 
      className={`responsive-spacing ${className}`}
      style={getSpacingStyle()}
    >
      {children}
    </div>
  )
}

// 响应式隐藏/显示组件
export const ResponsiveShow = ({ 
  children, 
  className = '',
  showMobile = true,
  showTablet = true,
  showDesktop = true,
  showLargeDesktop = true,
  ...props 
}) => {
  const { deviceType } = useResponsive()
  
  // 根据设备类型决定是否显示
  const shouldShow = () => {
    switch (deviceType) {
      case 'mobile-small':
      case 'mobile':
        return showMobile
      case 'tablet':
        return showTablet
      case 'desktop':
        return showDesktop
      case 'large-desktop':
        return showLargeDesktop
      default:
        return showDesktop
    }
  }
  
  if (!shouldShow()) return null
  
  return (
    <div className={`responsive-show ${className}`} {...props}>
      {children}
    </div>
  )
}

export const ResponsiveHide = ({ 
  children, 
  className = '',
  hideMobile = false,
  hideTablet = false,
  hideDesktop = false,
  hideLargeDesktop = false,
  ...props 
}) => {
  const { deviceType } = useResponsive()
  
  // 根据设备类型决定是否隐藏
  const shouldHide = () => {
    switch (deviceType) {
      case 'mobile-small':
      case 'mobile':
        return hideMobile
      case 'tablet':
        return hideTablet
      case 'desktop':
        return hideDesktop
      case 'large-desktop':
        return hideLargeDesktop
      default:
        return hideDesktop
    }
  }
  
  if (shouldHide()) return null
  
  return (
    <div className={`responsive-hide ${className}`} {...props}>
      {children}
    </div>
  )
}

// 响应式断点组件
export const ResponsiveBreakpoint = ({ 
  children, 
  className = '',
  xs,
  sm,
  md,
  lg,
  xl,
  ...props 
}) => {
  const { breakpoint } = useResponsive()
  
  // 根据断点选择子组件
  const renderChildren = () => {
    switch (breakpoint) {
      case 'xs':
        return xs || children
      case 'sm':
        return sm || children
      case 'md':
        return md || children
      case 'lg':
        return lg || children
      case 'xl':
        return xl || children
      default:
        return children
    }
  }
  
  return (
    <div className={`responsive-breakpoint ${className}`} {...props}>
      {renderChildren()}
    </div>
  )
}

export default ResponsiveLayout