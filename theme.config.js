/**
 * 树洞小程序全局主题配置文件
 * 包含 24 组主题：0-11 为感性愈系（柔美），12-23 为理性深邃（硬朗）
 */
export const THEME_STYLE_TYPES = {
  FEMALE: 'female',
  MALE: 'male'
};

export const THEME_STYLE_RANGE = {
  [THEME_STYLE_TYPES.FEMALE]: { start: 0, end: 11 },
  [THEME_STYLE_TYPES.MALE]: { start: 12, end: 23 }
};

const BASE_THEMES = [
  // --- 感性愈系系列 (Female-Friendly: 柔和、通透、高留白) ---
  {
    id: 0,
    name: "莫奈花园",
    primaryColor: "#A3B18A",
    bgColor: "#F1F3F0",
    cardColor: "rgba(255, 255, 255, 0.8)",
    textColor: "#3A5A40",
    accentColor: "#DAD7CD",
    borderRadius: "48rpx",
    shadow: "0 12rpx 40rpx rgba(163, 177, 138, 0.2)",
    glassMode: true,
    audioSrc: "/static/audio/morning_birds.mp3",
    particleType: "petal",
    vibe: "misty"
  },
  {
    id: 1,
    name: "玫瑰云端",
    primaryColor: "#E5989B",
    bgColor: "#FFF5F5",
    cardColor: "rgba(255, 255, 255, 0.85)",
    textColor: "#6D597A",
    accentColor: "#FFCDB2",
    borderRadius: "50rpx",
    shadow: "0 12rpx 40rpx rgba(229, 152, 155, 0.15)",
    glassMode: true,
    audioSrc: "/static/audio/soft_wind.mp3",
    particleType: "petal",
    vibe: "warm"
  },
  {
    id: 2,
    name: "月光银河",
    primaryColor: "#BDB2FF",
    bgColor: "#F8F7FF",
    cardColor: "rgba(255, 255, 255, 0.8)",
    textColor: "#4CC9F0",
    accentColor: "#A0C4FF",
    borderRadius: "40rpx",
    shadow: "0 10rpx 30rpx rgba(189, 178, 255, 0.2)",
    glassMode: true,
    audioSrc: "/static/audio/zen_bell.mp3",
    particleType: "star",
    vibe: "starry"
  },
  {
    id: 3,
    name: "午后奶茶",
    primaryColor: "#CB997E",
    bgColor: "#FDF8F5",
    cardColor: "#FFFFFF",
    textColor: "#6B4423",
    accentColor: "#DDBEA9",
    borderRadius: "32rpx",
    shadow: "0 8rpx 24rpx rgba(203, 153, 126, 0.1)",
    glassMode: false,
    audioSrc: "/static/audio/cafe_ambient.mp3",
    particleType: "bubble",
    vibe: "cozy"
  },
  {
    id: 4,
    name: "薄荷苏打",
    primaryColor: "#84DCC6",
    bgColor: "#F0FFF1",
    cardColor: "rgba(255, 255, 255, 0.7)",
    textColor: "#2D6A4F",
    accentColor: "#A5FFD6",
    borderRadius: "44rpx",
    shadow: "0 12rpx 36rpx rgba(132, 220, 198, 0.15)",
    glassMode: true,
    audioSrc: "/static/audio/underwater.mp3",
    particleType: "bubble",
    vibe: "fresh"
  },
  {
    id: 5,
    name: "落日橘海",
    primaryColor: "#FFB4A2",
    bgColor: "#FFF2EF",
    cardColor: "#FFFFFF",
    textColor: "#6D6875",
    accentColor: "#FFCDB2",
    borderRadius: "40rpx",
    shadow: "0 10rpx 30rpx rgba(255, 180, 162, 0.2)",
    glassMode: false,
    audioSrc: "/static/audio/sea_waves.mp3",
    particleType: "petal",
    vibe: "sunset"
  },
  {
    id: 6,
    name: "晨雾薰衣",
    primaryColor: "#C8B6FF",
    bgColor: "#F7F3FF",
    cardColor: "rgba(255, 255, 255, 0.82)",
    textColor: "#5B4B8A",
    accentColor: "#E7D8FF",
    borderRadius: "46rpx",
    shadow: "0 12rpx 36rpx rgba(200, 182, 255, 0.18)",
    glassMode: true,
    audioSrc: "/static/audio/lavender_breeze.mp3",
    particleType: "petal",
    vibe: "lavender"
  },
  {
    id: 7,
    name: "樱雪绒云",
    primaryColor: "#F4A9C3",
    bgColor: "#FFF7FA",
    cardColor: "rgba(255, 255, 255, 0.9)",
    textColor: "#7E4A62",
    accentColor: "#FFD5E5",
    borderRadius: "52rpx",
    shadow: "0 12rpx 40rpx rgba(244, 169, 195, 0.16)",
    glassMode: true,
    audioSrc: "/static/audio/sakura_wind.mp3",
    particleType: "petal",
    vibe: "blush"
  },
  {
    id: 8,
    name: "青柠雨露",
    primaryColor: "#9AD99A",
    bgColor: "#F4FFF4",
    cardColor: "rgba(255, 255, 255, 0.78)",
    textColor: "#2F6A3A",
    accentColor: "#D3F8D3",
    borderRadius: "42rpx",
    shadow: "0 10rpx 30rpx rgba(154, 217, 154, 0.18)",
    glassMode: true,
    audioSrc: "/static/audio/rain_leaf.mp3",
    particleType: "bubble",
    vibe: "dew"
  },
  {
    id: 9,
    name: "桃花乌龙",
    primaryColor: "#EFA48B",
    bgColor: "#FFF6F2",
    cardColor: "#FFFFFF",
    textColor: "#7A4E3A",
    accentColor: "#F7C9B8",
    borderRadius: "38rpx",
    shadow: "0 8rpx 24rpx rgba(239, 164, 139, 0.16)",
    glassMode: false,
    audioSrc: "/static/audio/tea_house.mp3",
    particleType: "petal",
    vibe: "tea"
  },
  {
    id: 10,
    name: "琥珀落叶",
    primaryColor: "#D9A066",
    bgColor: "#FFF8ED",
    cardColor: "#FFFFFF",
    textColor: "#6F4A22",
    accentColor: "#F0D0A8",
    borderRadius: "34rpx",
    shadow: "0 8rpx 24rpx rgba(217, 160, 102, 0.16)",
    glassMode: false,
    audioSrc: "/static/audio/autumn_leaves.mp3",
    particleType: "petal",
    vibe: "amber"
  },
  {
    id: 11,
    name: "海盐晴空",
    primaryColor: "#8FD3FF",
    bgColor: "#F2FAFF",
    cardColor: "rgba(255, 255, 255, 0.88)",
    textColor: "#2A5674",
    accentColor: "#BFE8FF",
    borderRadius: "44rpx",
    shadow: "0 10rpx 30rpx rgba(143, 211, 255, 0.16)",
    glassMode: true,
    audioSrc: "/static/audio/sea_breeze_light.mp3",
    particleType: "bubble",
    vibe: "sky"
  },

  // --- 理性深邃系列 (Male-Friendly: 极简、硬朗、深色调) ---
  {
    id: 12,
    name: "极夜之境",
    primaryColor: "#212529",
    bgColor: "#121212",
    cardColor: "#1E1E1E",
    textColor: "#E9ECEF",
    accentColor: "#343A40",
    borderRadius: "12rpx",
    shadow: "none",
    borderStyle: "1px solid #333",
    glassMode: false,
    audioSrc: "/static/audio/deep_space.mp3",
    particleType: "shatter",
    vibe: "dark"
  },
  {
    id: 13,
    name: "深海潜航",
    primaryColor: "#003566",
    bgColor: "#001D3D",
    cardColor: "#002855",
    textColor: "#FFC300",
    accentColor: "#003566",
    borderRadius: "16rpx",
    shadow: "0 4rpx 20rpx rgba(0,0,0,0.4)",
    glassMode: false,
    audioSrc: "/static/audio/sonar.mp3",
    particleType: "shatter",
    vibe: "deepsea"
  },
  {
    id: 14,
    name: "荒野篝火",
    primaryColor: "#BC4749",
    bgColor: "#1A1A1A",
    cardColor: "#2B2D42",
    textColor: "#EDF2F4",
    accentColor: "#D90429",
    borderRadius: "8rpx",
    shadow: "0 4rpx 12rpx rgba(188, 71, 73, 0.3)",
    glassMode: false,
    audioSrc: "/static/audio/fire_crackling.mp3",
    particleType: "shatter",
    vibe: "wild"
  },
  {
    id: 15,
    name: "机械先驱",
    primaryColor: "#4A4E69",
    bgColor: "#22223B",
    cardColor: "#4A4E69",
    textColor: "#F2E9E4",
    accentColor: "#9A8C98",
    borderRadius: "20rpx",
    shadow: "0 6rpx 18rpx rgba(0,0,0,0.5)",
    glassMode: false,
    audioSrc: "/static/audio/keyboard_typing.mp3",
    particleType: "shatter",
    vibe: "tech"
  },
  {
    id: 16,
    name: "风暴前夜",
    primaryColor: "#353535",
    bgColor: "#242424",
    cardColor: "#333533",
    textColor: "#D6D6D6",
    accentColor: "#F5CB5C",
    borderRadius: "12rpx",
    shadow: "none",
    borderStyle: "1px solid #444",
    glassMode: false,
    audioSrc: "/static/audio/thunder_rain.mp3",
    particleType: "shatter",
    vibe: "storm"
  },
  {
    id: 17,
    name: "无声冰原",
    primaryColor: "#8ECAE6",
    bgColor: "#E9F5F9",
    cardColor: "#FFFFFF",
    textColor: "#023047",
    accentColor: "#219EBC",
    borderRadius: "24rpx",
    shadow: "0 4rpx 15rpx rgba(142, 202, 230, 0.2)",
    glassMode: true,
    audioSrc: "/static/audio/ice_wind.mp3",
    particleType: "shatter",
    vibe: "cold"
  },
  {
    id: 18,
    name: "曜石矩阵",
    primaryColor: "#1F2937",
    bgColor: "#0B1220",
    cardColor: "#111827",
    textColor: "#E5E7EB",
    accentColor: "#374151",
    borderRadius: "10rpx",
    shadow: "none",
    borderStyle: "1px solid #2A3342",
    glassMode: false,
    audioSrc: "/static/audio/obsidian_hum.mp3",
    particleType: "shatter",
    vibe: "obsidian"
  },
  {
    id: 19,
    name: "深渊霓虹",
    primaryColor: "#0F4C81",
    bgColor: "#08111F",
    cardColor: "#0C1B2E",
    textColor: "#DDEEFF",
    accentColor: "#18A0FB",
    borderRadius: "12rpx",
    shadow: "0 4rpx 14rpx rgba(24, 160, 251, 0.18)",
    glassMode: false,
    audioSrc: "/static/audio/neon_city.mp3",
    particleType: "shatter",
    vibe: "neon"
  },
  {
    id: 20,
    name: "钢铁黎明",
    primaryColor: "#6B7280",
    bgColor: "#161A20",
    cardColor: "#1F2937",
    textColor: "#F3F4F6",
    accentColor: "#9CA3AF",
    borderRadius: "10rpx",
    shadow: "none",
    borderStyle: "1px solid #374151",
    glassMode: false,
    audioSrc: "/static/audio/metal_ambience.mp3",
    particleType: "shatter",
    vibe: "steel"
  },
  {
    id: 21,
    name: "夜航信号",
    primaryColor: "#1D3557",
    bgColor: "#0E1A2B",
    cardColor: "#14263D",
    textColor: "#E2ECF8",
    accentColor: "#E9C46A",
    borderRadius: "14rpx",
    shadow: "0 4rpx 16rpx rgba(0,0,0,0.35)",
    glassMode: false,
    audioSrc: "/static/audio/night_signal.mp3",
    particleType: "shatter",
    vibe: "signal"
  },
  {
    id: 22,
    name: "砂岩引擎",
    primaryColor: "#7F5539",
    bgColor: "#1E1612",
    cardColor: "#2A211C",
    textColor: "#F2E9E4",
    accentColor: "#B08968",
    borderRadius: "12rpx",
    shadow: "0 4rpx 12rpx rgba(127, 85, 57, 0.25)",
    glassMode: false,
    audioSrc: "/static/audio/sand_wind.mp3",
    particleType: "shatter",
    vibe: "sand"
  },
  {
    id: 23,
    name: "北境极光",
    primaryColor: "#3A86FF",
    bgColor: "#0A1020",
    cardColor: "#121A30",
    textColor: "#EAF2FF",
    accentColor: "#8ECAE6",
    borderRadius: "18rpx",
    shadow: "0 4rpx 16rpx rgba(58, 134, 255, 0.22)",
    glassMode: false,
    audioSrc: "/static/audio/aurora_wind.mp3",
    particleType: "shatter",
    vibe: "aurora"
  }
];

function parseColorToRgb(color = '') {
  const value = String(color || '').trim();
  if (!value) return null;

  if (value.startsWith('#')) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r, g, b };
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b };
    }
    return null;
  }

  const rgbMatch = value.match(/rgba?\(([^)]+)\)/i);
  if (!rgbMatch) return null;
  const [r, g, b] = rgbMatch[1].split(',').map((item) => Number(item.trim()));
  if (![r, g, b].every(Number.isFinite)) return null;
  return { r, g, b };
}

function isDarkColor(color = '') {
  const rgb = parseColorToRgb(color);
  if (!rgb) return false;
  const { r, g, b } = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.52;
}

function withSemanticTextPalette(theme = {}) {
  const darkBg = isDarkColor(theme.bgColor);
  const fallbackBody = darkBg ? '#E5E7EB' : '#334155';
  const bodyTextColor = theme.bodyTextColor || theme.textColor || fallbackBody;

  return {
    ...theme,
    bodyTextColor,
    titleTextColor: theme.titleTextColor || (darkBg ? '#F8FAFC' : '#1F2937'),
    subtitleTextColor: theme.subtitleTextColor || (darkBg ? '#CBD5E1' : '#64748B'),
    tertiaryTextColor: theme.tertiaryTextColor || (darkBg ? '#94A3B8' : '#94A3B8'),
    inverseTextColor: theme.inverseTextColor || (darkBg ? '#0F172A' : '#FFFFFF')
  };
}

export const THEMES = BASE_THEMES.map((theme) => withSemanticTextPalette(theme));

export const getThemeTypeById = (id) => {
  const numericId = Number(id);
  const femaleRange = THEME_STYLE_RANGE[THEME_STYLE_TYPES.FEMALE];
  return numericId >= femaleRange.start && numericId <= femaleRange.end
    ? THEME_STYLE_TYPES.FEMALE
    : THEME_STYLE_TYPES.MALE;
};

export const getThemesByType = (type) => {
  const normalizedType = type === THEME_STYLE_TYPES.MALE
    ? THEME_STYLE_TYPES.MALE
    : THEME_STYLE_TYPES.FEMALE;
  return THEMES.filter((theme) => getThemeTypeById(theme.id) === normalizedType);
};

// 默认导出获取主题的方法
export const getThemeById = (id) => THEMES.find(t => t.id === id) || THEMES[0];