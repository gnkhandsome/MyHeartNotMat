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
  // --- 感性愈系系列：采用经典低饱和配色体系（莫兰迪 / 奶油法式 / 日系雾感） ---
  {
    id: 0,
    name: "莫兰迪鼠尾草",
    primaryColor: "#7C9A92",
    bgColor: "#F4F5F2",
    cardColor: "rgba(255, 255, 255, 0.84)",
    textColor: "#30454A",
    accentColor: "#CFD8D3",
    borderRadius: "46rpx",
    shadow: "0 16rpx 42rpx rgba(124, 154, 146, 0.18)",
    glassMode: true,
    audioSrc: "/static/audio/morning_birds.mp3",
    particleType: "petal",
    vibe: "misty"
  },
  {
    id: 1,
    name: "法式玫瑰奶油",
    primaryColor: "#C77D8C",
    bgColor: "#FFF6F6",
    cardColor: "rgba(255, 255, 255, 0.9)",
    textColor: "#6F4A5A",
    accentColor: "#F2D8DE",
    borderRadius: "50rpx",
    shadow: "0 14rpx 40rpx rgba(199, 125, 140, 0.16)",
    glassMode: true,
    audioSrc: "/static/audio/soft_wind.mp3",
    particleType: "petal",
    vibe: "warm"
  },
  {
    id: 2,
    name: "鸢尾薄暮",
    primaryColor: "#8F88C9",
    bgColor: "#F7F5FF",
    cardColor: "rgba(255, 255, 255, 0.86)",
    textColor: "#45416B",
    accentColor: "#DCD7F5",
    borderRadius: "44rpx",
    shadow: "0 14rpx 36rpx rgba(143, 136, 201, 0.18)",
    glassMode: true,
    audioSrc: "/static/audio/zen_bell.mp3",
    particleType: "star",
    vibe: "starry"
  },
  {
    id: 3,
    name: "燕麦奶咖",
    primaryColor: "#B0815D",
    bgColor: "#FCF7F1",
    cardColor: "#FFFFFF",
    textColor: "#5E4432",
    accentColor: "#E6CFBC",
    borderRadius: "36rpx",
    shadow: "0 12rpx 32rpx rgba(176, 129, 93, 0.14)",
    glassMode: false,
    audioSrc: "/static/audio/cafe_ambient.mp3",
    particleType: "bubble",
    vibe: "cozy"
  },
  {
    id: 4,
    name: "薄荷冰晶",
    primaryColor: "#4FAF9F",
    bgColor: "#F1FBF8",
    cardColor: "rgba(255, 255, 255, 0.84)",
    textColor: "#285A56",
    accentColor: "#BFE8DF",
    borderRadius: "44rpx",
    shadow: "0 14rpx 34rpx rgba(79, 175, 159, 0.16)",
    glassMode: true,
    audioSrc: "/static/audio/underwater.mp3",
    particleType: "bubble",
    vibe: "fresh"
  },
  {
    id: 5,
    name: "珊瑚晚霞",
    primaryColor: "#E58E73",
    bgColor: "#FFF4EF",
    cardColor: "#FFFFFF",
    textColor: "#6E4E45",
    accentColor: "#F5CCBF",
    borderRadius: "40rpx",
    shadow: "0 14rpx 34rpx rgba(229, 142, 115, 0.16)",
    glassMode: false,
    audioSrc: "/static/audio/sea_waves.mp3",
    particleType: "petal",
    vibe: "sunset"
  },
  {
    id: 6,
    name: "薰衣雾紫",
    primaryColor: "#9B8EC7",
    bgColor: "#F8F5FF",
    cardColor: "rgba(255, 255, 255, 0.88)",
    textColor: "#55487A",
    accentColor: "#DCD4F0",
    borderRadius: "48rpx",
    shadow: "0 14rpx 36rpx rgba(155, 142, 199, 0.18)",
    glassMode: true,
    audioSrc: "/static/audio/lavender_breeze.mp3",
    particleType: "petal",
    vibe: "lavender"
  },
  {
    id: 7,
    name: "樱雾绒光",
    primaryColor: "#D986A2",
    bgColor: "#FFF8FB",
    cardColor: "rgba(255, 255, 255, 0.92)",
    textColor: "#7A4D63",
    accentColor: "#F5D7E5",
    borderRadius: "52rpx",
    shadow: "0 14rpx 40rpx rgba(217, 134, 162, 0.16)",
    glassMode: true,
    audioSrc: "/static/audio/sakura_wind.mp3",
    particleType: "petal",
    vibe: "blush"
  },
  {
    id: 8,
    name: "青柠晨露",
    primaryColor: "#7DBB77",
    bgColor: "#F5FCF3",
    cardColor: "rgba(255, 255, 255, 0.84)",
    textColor: "#385F38",
    accentColor: "#D5EBCF",
    borderRadius: "42rpx",
    shadow: "0 12rpx 32rpx rgba(125, 187, 119, 0.16)",
    glassMode: true,
    audioSrc: "/static/audio/rain_leaf.mp3",
    particleType: "bubble",
    vibe: "dew"
  },
  {
    id: 9,
    name: "蜜桃乌龙",
    primaryColor: "#C8876E",
    bgColor: "#FFF7F2",
    cardColor: "#FFFFFF",
    textColor: "#724C3A",
    accentColor: "#F2CCBC",
    borderRadius: "38rpx",
    shadow: "0 12rpx 28rpx rgba(200, 135, 110, 0.15)",
    glassMode: false,
    audioSrc: "/static/audio/tea_house.mp3",
    particleType: "petal",
    vibe: "tea"
  },
  {
    id: 10,
    name: "琥珀麦浪",
    primaryColor: "#BE8F57",
    bgColor: "#FFF9EF",
    cardColor: "#FFFFFF",
    textColor: "#674625",
    accentColor: "#EED7B2",
    borderRadius: "36rpx",
    shadow: "0 12rpx 28rpx rgba(190, 143, 87, 0.15)",
    glassMode: false,
    audioSrc: "/static/audio/autumn_leaves.mp3",
    particleType: "petal",
    vibe: "amber"
  },
  {
    id: 11,
    name: "海盐天青",
    primaryColor: "#6EAED9",
    bgColor: "#F2F9FF",
    cardColor: "rgba(255, 255, 255, 0.9)",
    textColor: "#2E5774",
    accentColor: "#CDE5F7",
    borderRadius: "44rpx",
    shadow: "0 12rpx 32rpx rgba(110, 174, 217, 0.16)",
    glassMode: true,
    audioSrc: "/static/audio/sea_breeze_light.mp3",
    particleType: "bubble",
    vibe: "sky"
  },

  // --- 理性深邃系列：采用经典暗色体系（Nord / Tokyo Night / Carbon / Navy） ---
  {
    id: 12,
    name: "北境极夜",
    primaryColor: "#7A8BA3",
    bgColor: "#0F1117",
    cardColor: "#171A23",
    textColor: "#E5E9F0",
    accentColor: "#2A3040",
    borderRadius: "14rpx",
    shadow: "0 10rpx 24rpx rgba(5, 8, 14, 0.48)",
    borderStyle: "1px solid rgba(122, 139, 163, 0.22)",
    glassMode: false,
    audioSrc: "/static/audio/deep_space.mp3",
    particleType: "shatter",
    vibe: "dark"
  },
  {
    id: 13,
    name: "深海蓝金",
    primaryColor: "#2A6FA8",
    bgColor: "#0A1A2A",
    cardColor: "#10263B",
    textColor: "#E3EEF7",
    accentColor: "#E0B85A",
    borderRadius: "16rpx",
    shadow: "0 10rpx 24rpx rgba(8, 19, 31, 0.5)",
    borderStyle: "1px solid rgba(42, 111, 168, 0.26)",
    glassMode: false,
    audioSrc: "/static/audio/sonar.mp3",
    particleType: "shatter",
    vibe: "deepsea"
  },
  {
    id: 14,
    name: "焦土余烬",
    primaryColor: "#B45A4A",
    bgColor: "#161314",
    cardColor: "#211B1D",
    textColor: "#EFE8E5",
    accentColor: "#D39A62",
    borderRadius: "12rpx",
    shadow: "0 10rpx 22rpx rgba(0, 0, 0, 0.42)",
    borderStyle: "1px solid rgba(180, 90, 74, 0.22)",
    glassMode: false,
    audioSrc: "/static/audio/fire_crackling.mp3",
    particleType: "shatter",
    vibe: "wild"
  },
  {
    id: 15,
    name: "赛博灰蓝",
    primaryColor: "#5F6C90",
    bgColor: "#161B28",
    cardColor: "#20283A",
    textColor: "#E8EBF2",
    accentColor: "#8FA2D9",
    borderRadius: "18rpx",
    shadow: "0 10rpx 24rpx rgba(6, 10, 18, 0.45)",
    borderStyle: "1px solid rgba(143, 162, 217, 0.2)",
    glassMode: false,
    audioSrc: "/static/audio/keyboard_typing.mp3",
    particleType: "shatter",
    vibe: "tech"
  },
  {
    id: 16,
    name: "风暴石墨",
    primaryColor: "#7B8695",
    bgColor: "#1A1D22",
    cardColor: "#232830",
    textColor: "#E5E7EB",
    accentColor: "#D4A95A",
    borderRadius: "12rpx",
    shadow: "0 10rpx 24rpx rgba(4, 7, 12, 0.45)",
    borderStyle: "1px solid rgba(123, 134, 149, 0.24)",
    glassMode: false,
    audioSrc: "/static/audio/thunder_rain.mp3",
    particleType: "shatter",
    vibe: "storm"
  },
  {
    id: 17,
    name: "冰原极昼",
    primaryColor: "#4F86A8",
    bgColor: "#EAF3F8",
    cardColor: "#FFFFFF",
    textColor: "#1F3D52",
    accentColor: "#A8CADB",
    borderRadius: "24rpx",
    shadow: "0 10rpx 24rpx rgba(79, 134, 168, 0.18)",
    glassMode: true,
    audioSrc: "/static/audio/ice_wind.mp3",
    particleType: "shatter",
    vibe: "cold"
  },
  {
    id: 18,
    name: "曜石终端",
    primaryColor: "#4C5566",
    bgColor: "#0B0F17",
    cardColor: "#121925",
    textColor: "#E7ECF3",
    accentColor: "#2B3448",
    borderRadius: "10rpx",
    shadow: "0 10rpx 24rpx rgba(2, 4, 9, 0.48)",
    borderStyle: "1px solid rgba(76, 85, 102, 0.24)",
    glassMode: false,
    audioSrc: "/static/audio/obsidian_hum.mp3",
    particleType: "shatter",
    vibe: "obsidian"
  },
  {
    id: 19,
    name: "深渊霓光",
    primaryColor: "#2E7AB7",
    bgColor: "#08111D",
    cardColor: "#0F1D31",
    textColor: "#DDEBFA",
    accentColor: "#4EB3E7",
    borderRadius: "12rpx",
    shadow: "0 10rpx 24rpx rgba(3, 10, 18, 0.5)",
    borderStyle: "1px solid rgba(78, 179, 231, 0.22)",
    glassMode: false,
    audioSrc: "/static/audio/neon_city.mp3",
    particleType: "shatter",
    vibe: "neon"
  },
  {
    id: 20,
    name: "钢蓝晨星",
    primaryColor: "#6E7F97",
    bgColor: "#151A23",
    cardColor: "#1E2532",
    textColor: "#EAEFF6",
    accentColor: "#A7B5C8",
    borderRadius: "12rpx",
    shadow: "0 10rpx 24rpx rgba(4, 7, 12, 0.44)",
    borderStyle: "1px solid rgba(110, 127, 151, 0.24)",
    glassMode: false,
    audioSrc: "/static/audio/metal_ambience.mp3",
    particleType: "shatter",
    vibe: "steel"
  },
  {
    id: 21,
    name: "夜航电台",
    primaryColor: "#3E648D",
    bgColor: "#101A2A",
    cardColor: "#17253A",
    textColor: "#E4EDF8",
    accentColor: "#D9B56B",
    borderRadius: "14rpx",
    shadow: "0 10rpx 24rpx rgba(5, 10, 17, 0.46)",
    borderStyle: "1px solid rgba(62, 100, 141, 0.24)",
    glassMode: false,
    audioSrc: "/static/audio/night_signal.mp3",
    particleType: "shatter",
    vibe: "signal"
  },
  {
    id: 22,
    name: "砂岩余温",
    primaryColor: "#9A6F4F",
    bgColor: "#1B1411",
    cardColor: "#261D19",
    textColor: "#EFE6DF",
    accentColor: "#C49B7A",
    borderRadius: "12rpx",
    shadow: "0 10rpx 22rpx rgba(7, 4, 3, 0.42)",
    borderStyle: "1px solid rgba(154, 111, 79, 0.24)",
    glassMode: false,
    audioSrc: "/static/audio/sand_wind.mp3",
    particleType: "shatter",
    vibe: "sand"
  },
  {
    id: 23,
    name: "极光航线",
    primaryColor: "#4B88D7",
    bgColor: "#0A1020",
    cardColor: "#131D34",
    textColor: "#EAF2FF",
    accentColor: "#77C3D9",
    borderRadius: "18rpx",
    shadow: "0 10rpx 24rpx rgba(4, 8, 16, 0.48)",
    borderStyle: "1px solid rgba(75, 136, 215, 0.24)",
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
  const darkPrimary = isDarkColor(theme.primaryColor);
  const fallbackBody = darkBg ? '#E5E7EB' : '#334155';
  const bodyTextColor = theme.bodyTextColor || theme.textColor || fallbackBody;

  return {
    ...theme,
    bodyTextColor,
    titleTextColor: theme.titleTextColor || (darkBg ? '#F8FAFC' : '#1F2937'),
    subtitleTextColor: theme.subtitleTextColor || (darkBg ? '#CBD5E1' : '#64748B'),
    tertiaryTextColor: theme.tertiaryTextColor || (darkBg ? '#94A3B8' : '#94A3B8'),
    inverseTextColor: theme.inverseTextColor || (darkPrimary ? '#FFFFFF' : '#0F172A')
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