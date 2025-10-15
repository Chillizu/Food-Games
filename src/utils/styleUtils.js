export const getHighlightStyle = (colors) => {
  if (!colors || colors.length === 0) {
    return {};
  }

  // 单色高亮，使用简单边框
  if (colors.length === 1) {
    return {
      borderColor: colors[0],
      borderWidth: '2px',
    };
  }

  // 多色高亮，使用 background-clip 技术实现带圆角的渐变边框
  if (colors.length > 1) {
    const gradient = `linear-gradient(45deg, ${colors.join(', ')})`;
    return {
      border: '2px solid transparent',
      backgroundImage: `linear-gradient(var(--background-color), var(--background-color)), ${gradient}`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    };
  }

  return {};
};