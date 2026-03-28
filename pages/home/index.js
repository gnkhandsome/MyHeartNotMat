import {
  THEMES,
  THEME_STYLE_TYPES,
  getThemeTypeById,
  getThemesByType
} from '../../theme.config.js';
import { createPageShredHelper } from '../../utils/shredder.js';

const homeShredHelper = createPageShredHelper({
  canvasSelector: '#homeShredCanvas'
});

const COMPANION_EMOTION_KEYWORDS = {
  sad: ['烦', '累', '焦虑', '难受', '崩溃', '痛苦', '压力', '孤独', '失眠', '烦躁'],
  happy: ['开心', '快乐', '放松', '治愈', '轻松', '幸福', '期待', '喜欢', '顺利', '满足']
};

const POST_TYPE_META = {
  diary: {
    label: '日记',
    icon: '📔',
    placeholder: '写下此刻的心情与想法...',
    tagline: '把心事写进文字里'
  },
  letter: {
    label: '写信',
    icon: '✉️',
    placeholder: '写下此刻的心情与想法...',
    tagline: '把心事写进文字里'
  },
  postcard: {
    label: '明信片',
    icon: '�️',
    placeholder: '写下此刻的心情与想法...',
    tagline: '把心事写进文字里'
  }
};

const POST_ACTION_META = {
  letter: {
    cta: '封装信笺',
    done: '信笺已封装好'
  },
  postcard: {
    cta: '寄出明信片',
    done: '明信片已写好'
  },
  diary: {
    cta: '收进日记页',
    done: '日记已收好'
  }
};

const POST_TYPES = Object.keys(POST_TYPE_META).map((key) => ({
  key,
  ...POST_TYPE_META[key]
}));

const THEME_STYLE_META = {
  minimalist: {
    key: 'minimalist',
    label: '简约白',
    icon: '⬜',
    desc: '干净清爽，专注写作',
    bgColor: '#ffffff',
    cardColor: '#fafafa',
    textColor: '#1f2937',
    subtextColor: '#6b7280',
    primaryColor: '#3b82f6'
  },
  warm: {
    key: 'warm',
    label: '温暖黄',
    icon: '🟡',
    desc: '温馨舒适，像午后的阳光',
    bgColor: '#fef3c7',
    cardColor: '#fffbeb',
    textColor: '#78350f',
    subtextColor: '#92400e',
    primaryColor: '#f59e0b'
  },
  fresh: {
    key: 'fresh',
    label: '清新绿',
    icon: '🟢',
    desc: '自然清新，像春天的草地',
    bgColor: '#d1fae5',
    cardColor: '#ecfdf5',
    textColor: '#065f46',
    subtextColor: '#047857',
    primaryColor: '#10b981'
  },
  calm: {
    key: 'calm',
    label: '宁静蓝',
    icon: '🔵',
    desc: '平静沉稳，像宁静的湖水',
    bgColor: '#dbeafe',
    cardColor: '#eff6ff',
    textColor: '#1e3a8a',
    subtextColor: '#1e40af',
    primaryColor: '#3b82f6'
  },
  romantic: {
    key: 'romantic',
    label: '浪漫粉',
    icon: '🩷',
    desc: '温柔浪漫，像樱花飘落',
    bgColor: '#fce7f3',
    cardColor: '#fdf2f8',
    textColor: '#831843',
    subtextColor: '#9d174d',
    primaryColor: '#ec4899'
  },
  deep: {
    key: 'deep',
    label: '深邃黑',
    icon: '⬛',
    desc: '沉稳内敛，像深夜的星空',
    bgColor: '#111827',
    cardColor: '#1f2937',
    textColor: '#f9fafb',
    subtextColor: '#d1d5db',
    primaryColor: '#6366f1'
  }
};

const MOOD_STYLE_META = {
  healing: {
    key: 'healing',
    label: '治愈插画',
    icon: '🌸',
    desc: '温馨可爱的手绘插画装饰',
    decoration: 'healing'
  },
  classic: {
    key: 'classic',
    label: '古风雅韵',
    icon: '🎋',
    desc: '中国古典风格',
    decoration: 'classic'
  },
  modern: {
    key: 'modern',
    label: '现代简约',
    icon: '✨',
    desc: '简洁现代的设计',
    decoration: 'modern'
  },
  retro: {
    key: 'retro',
    label: '怀旧复古',
    icon: '📷',
    desc: '怀旧复古的感觉',
    decoration: 'retro'
  },
  nature: {
    key: 'nature',
    label: '自然清新',
    icon: '🌿',
    desc: '自然清新的氛围',
    decoration: 'nature'
  },
  artistic: {
    key: 'artistic',
    label: '艺术手绘',
    icon: '🎨',
    desc: '艺术感的手绘风格',
    decoration: 'artistic'
  }
};

const THEME_STYLES = Object.keys(THEME_STYLE_META).map((key) => ({
  key,
  ...THEME_STYLE_META[key]
}));

const MOOD_STYLES = Object.keys(MOOD_STYLE_META).map((key) => ({
  key,
  ...MOOD_STYLE_META[key]
}));

const IMMERSIVE_SCENE_META = {
  sunny: {
    label: '晴天',
    icon: '☀️',
    desc: '阳光洒在肩上，空气轻盈而温暖。',
    soundLabel: '轻风 + 鸟鸣'
  },
  cloudy: {
    label: '阴天',
    icon: '☁️',
    desc: '云层缓缓漂移，世界柔和而安静。',
    soundLabel: '低频风声'
  },
  rainy: {
    label: '下雨',
    icon: '🌧️',
    desc: '雨滴敲打窗沿，思绪慢慢沉下来。',
    soundLabel: '雨声 + 远雷'
  },
  windy: {
    label: '有风',
    icon: '🍃',
    desc: '风穿过草地，带走胸口的闷。',
    soundLabel: '风拂草叶'
  },
  snowy: {
    label: '大雪',
    icon: '❄️',
    desc: '雪落无声，时间像被放慢。',
    soundLabel: '雪落 + 轻回响'
  },
  stream: {
    label: '水流',
    icon: '💧',
    desc: '溪流和鸟鸣在耳边，像走进林间。',
    soundLabel: '溪流 + 鸟鸣'
  }
};

const IMMERSIVE_SCENES = Object.keys(IMMERSIVE_SCENE_META).map((key) => ({
  key,
  ...IMMERSIVE_SCENE_META[key]
}));

const HANGING_ORNAMENT_META = {
  knot: {
    label: '祈愿结',
    symbol: '结'
  },
  bell: {
    label: '铃铛',
    symbol: '铃'
  },
  leaf: {
    label: '银杏叶',
    symbol: '叶'
  },
  feather: {
    label: '羽穗',
    symbol: '羽'
  }
};

const HANGING_ORNAMENT_KEYS = Object.keys(HANGING_ORNAMENT_META);
const HANGING_ORNAMENT_OPTIONS = HANGING_ORNAMENT_KEYS.map((key) => ({
  key,
  ...HANGING_ORNAMENT_META[key]
}));

const COMPANION_SCENE_RANDOM_LINES = {
  sunny: ['阳光正好，写一句让自己发光的话吧。', '今天的风里有好心情，我陪你记录下来。'],
  cloudy: ['阴天也没关系，我们慢慢写。', '云很轻，心也可以轻一点。'],
  rainy: ['雨声很适合把情绪写完整。', '下雨的时候，想说的话更容易被听见。'],
  windy: ['有风的时候，烦恼也会被吹散一点。', '把今天的心事交给风，我帮你记着。'],
  snowy: ['雪落得很安静，文字也会变温柔。', '慢一点没关系，雪天就该慢慢来。'],
  stream: ['像溪流一样，把堵住的话慢慢写出来。', '今天的灵感像水流，顺着写就好。']
};

const COMPANION_TIME_RANDOM_LINES = {
  morning: ['早安，今天也值得被认真记录。', '新的一天开始啦，我先陪你写第一句。'],
  noon: ['中午也要记得照顾自己呀。', '先停一下，和我一起做个深呼吸。'],
  evening: ['傍晚的心事，最适合慢慢写。', '天色变柔和了，我们也轻一点。'],
  night: ['夜深了，我还在，慢慢写不着急。', '把今天放进文字里，然后安心休息。']
};

const COMPANION_ACTION_RANDOM_LINES = {
  switchPostType: ['这个表达方式很适合现在的你。', '换一种写法，说不定会更顺。'],
  focusInput: ['我在旁边守着你，放心写。', '开始啦，我会认真听你写的每一句。'],
  blurInput: ['先歇一下也很好。', '写到这里已经很棒了。'],
  theme: ['新主题真好看，像你的心情滤镜。', '这个配色很有你现在的感觉。'],
  sceneIntensity: ['这个强度刚刚好。', '我感觉到氛围在慢慢变化啦。'],
  volume: ['声音我帮你盯着，舒服最重要。', '音量调得很贴心，耳朵会感谢你的。'],
  generic: ['我一直在，随时都能接住你。', '继续吧，你已经做得很好了。']
};

const WRITING_AMBIENT_INPUT_HINTS = {
  sad: [
    '情绪可以慢一点，我会在这陪你写完。',
    '先把难受写出来，心会轻一点。'
  ],
  happy: [
    '把这份好心情记下来，未来会感谢现在的你。',
    '这段开心很珍贵，慢慢写给未来看。'
  ],
  idle: [
    '你可以按自己的节奏来，不急。',
    '写下当下的呼吸和心跳，就很好。'
  ]
};

const WRITING_LIGHT_COLOR_META = {
  warm: {
    label: '暖黄灯',
    beamCore: '255, 220, 158',
    beamEdge: '255, 183, 77',
    glow: '255, 214, 153'
  },
  white: {
    label: '白炙灯',
    beamCore: '232, 243, 255',
    beamEdge: '184, 214, 255',
    glow: '214, 234, 255'
  }
};

const LOW_PERF_BENCHMARK_THRESHOLD = 20;
const HOME_TOOLBAR_SETTINGS_KEY = 'homeToolbarSettings';
const TOOL_PANEL_AUTO_CLOSE_MS = 10000;

function resolvePerfLevelByBenchmark(benchmarkLevel) {
  const level = Number(benchmarkLevel || 0);
  return level > 0 && level <= LOW_PERF_BENCHMARK_THRESHOLD ? 'low' : 'normal';
}

function resolveCompanionStateByText(text = '') {
  const value = String(text || '').toLowerCase();
  if (!value.trim()) return 'idle';

  if (COMPANION_EMOTION_KEYWORDS.sad.some((keyword) => value.includes(keyword))) {
    return 'sad';
  }

  if (COMPANION_EMOTION_KEYWORDS.happy.some((keyword) => value.includes(keyword))) {
    return 'happy';
  }

  return 'idle';
}

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

function getColorWithAlpha(color = '', alpha = 1) {
  const rgb = parseColorToRgb(color);
  if (!rgb) return color;
  const { r, g, b } = rgb;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getColorWithBrightness(color, percent) {
  const rgb = parseColorToRgb(color);
  if (!rgb) return color;
  
  let { r, g, b } = rgb;
  const factor = percent / 100;
  
  // 根据百分比调整亮度
  r = Math.min(255, Math.max(0, Math.round(r + r * factor)));
  g = Math.min(255, Math.max(0, Math.round(g + g * factor)));
  b = Math.min(255, Math.max(0, Math.round(b + b * factor)));
  
  return `rgb(${r}, ${g}, ${b})`;
}

function resolveSemanticTextPalette(theme = {}) {
  const isDarkColor = (color = '') => {
    const rgb = parseColorToRgb(color);
    if (!rgb) return false;
    const { r, g, b } = rgb;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.52;
  };

  const darkBg = isDarkColor(theme.bgColor);
  const darkPrimary = isDarkColor(theme.primaryColor);
  
  // 对于浅色背景的柔美型主题，使用主题色的衍生色，让文本颜色更接近主题色
  if (!darkBg && theme.id >= 0 && theme.id<= 11) {
    // 柔美型主题：使用主题色的不同亮度版本
    return {
      title: theme.titleTextColor || getColorWithBrightness(theme.primaryColor, -20), // 稍微深一点的主题色
      body: theme.bodyTextColor || getColorWithBrightness(theme.primaryColor, -10), // 稍深的主题色
      subtitle: theme.subtitleTextColor || getColorWithBrightness(theme.primaryColor, 10), // 稍浅的主题色
      tertiary: theme.tertiaryTextColor || getColorWithBrightness(theme.primaryColor, 30), // 更浅的主题色
      inverse: theme.inverseTextColor || (darkPrimary ? '#FFFFFF' : '#0F172A')
    };
  } else {
    // 深色背景或深邃型主题：使用原有逻辑
    const body = theme.bodyTextColor || theme.textColor || (darkBg ? '#E5E7EB' : '#334155');
    return {
      title: theme.titleTextColor || theme.textColor || (darkBg ? '#F8FAFC' : '#1F2937'),
      body,
      subtitle: theme.subtitleTextColor || (darkBg ? '#CBD5E1' : '#64748B'),
      tertiary: theme.tertiaryTextColor || (darkBg ? '#94A3B8' : '#94A3B8'),
      inverse: theme.inverseTextColor || (darkPrimary ? '#FFFFFF' : '#0F172A')
    };
  }
}

function pickRandom(list = []) {
  if (!Array.isArray(list) || !list.length) return '';
  return list[Math.floor(Math.random() * list.length)] || '';
}

Page({
  data: {
    // 页面相关
    currentPage: 0, // 当前页面索引：0-心语，1-广场，2-我的
    
    // 自定义背景
    customBackground: '',
    
    // 发布页面相关
    postContent: '',
    postTitle: '',
    postLocation: '',
    writingDateText: '',
    isAnonymous: true,
    isPostPrivate: true, // 是否本地私密
    activePostType: 'diary', // 默认发布类型
    postPlaceholder: '写下此刻的心情与想法...', // 默认占位文案
    
    // 风格相关
    activeThemeStyle: 'minimalist',
    activeMoodStyle: 'healing',
    themeStyles: THEME_STYLES,
    moodStyles: MOOD_STYLES,
    decoPositions: {},
    decoOpacity: {},
    
    // 我的页面相关
    userInfo: {
      nickname: '匿名用户',
      mood: '今天心情不错'
    },
    activeThemeType: THEME_STYLE_TYPES.FEMALE,
    themeStyleTypes: THEME_STYLE_TYPES,
    themes: THEMES,
    filteredThemes: getThemesByType(THEME_STYLE_TYPES.FEMALE),
    isFlipping: false,
    showQuote: false,
    currentQuote: '',
    myDiaryList: [],
    squarePostList: [],
    cloudPosts: [],
    currentPage: 0, // 当前页面索引：0-心语，1-广场，2-我的
    cloudPage: 1, // 云端数据分页
    cloudPageSize: 10, // 每页加载数量
    hasMoreCloudPosts: true, // 是否有更多云端数据
    isLoadingCloudPosts: false, // 是否正在加载云端数据
    shatteringCardIds: [],
    isPostShattering: false,
    isShredCanvasVisible: false,
    isAudioPlaying: false,
    audioVolume: 50,
    showAudioPanel: false,
    isAmbientControlExpanded: false,
    isRainModeEnabled: false,
    rainDrops: [],
    rainPerfLevel: 'normal',
    activeScene: 'cloudy',
    sceneLabel: IMMERSIVE_SCENE_META.cloudy.label,
    sceneOptions: IMMERSIVE_SCENES,
    sceneParticles: [],
    sceneDescription: IMMERSIVE_SCENE_META.cloudy.desc,
    sceneSoundLabel: IMMERSIVE_SCENE_META.cloudy.soundLabel,
    selectedHangingOrnament: 'knot',
    pendingHangingOrnament: 'knot',
    hangingOrnamentOptions: HANGING_ORNAMENT_OPTIONS,
    hangingOrnamentLabel: HANGING_ORNAMENT_META.knot.label,
    hangingOrnamentSymbol: HANGING_ORNAMENT_META.knot.symbol,
    isOrnamentHookHighlighted: false,
    isOrnamentDragging: false,
    ornamentDragStyle: '',
    ornamentDraggingKey: '',
    ornamentDraggingSymbol: '',
    showToolPanel: false,
    activeToolPanel: '',
    miniToolTopPx: 48,
    showPackageConfirmDialog: false,
    showPackagePublishDialog: false,
    showPackagingAnimation: false,
    showSaveSuccessDialog: false,
    pendingPackageType: 'letter',
    pendingPackageLabel: POST_TYPE_META.letter.label,
    ornamentSwayDeg: 5,
    tasselSwingDeg: 14,
    ornamentSwayDuration: 2.8,
    sceneIntensity: 65,
    isSceneAutoMode: true,
    scenePerfLevel: 'normal',
    isSceneEntering: true,
    showSceneRestoreHint: false,
    sceneRestoreHintText: '',
    sceneRestoreHintScene: 'rainy',
    ambientTimeSlot: 'morning',
    writingLightEnabled: false,
    writingLightColorMode: 'warm',
    writingLightFromSide: 'right',
    writingLightIntensity: 86,
    writingLightAngle: 34,
    writingLightFocus: 38,
    writingLightBeamStyle: '',
    writingLightGlowStyle: '',
    companionState: 'idle',
    companionVisualType: 'cloud',
    companionBubbleText: '',
    showCompanionBubble: false,
    companionBubbleSide: 'right',
    companionBubbleVertical: 'middle',
    companionIsShy: false,
    companionTapFeedback: false,
    isCompanionLongPressTriggered: false,
    fabX: 0,
    fabY: 0,
    companionInNest: true,
    companionNestHighlighted: false,
    companionDragLevel: 0,
    companionTrailParticles: [],
    isBreathingActive: false,
    isBreathingLongPressTriggered: false,
    breathingPhase: 'idle',
    breathingGuideText: '',
    breathingCycleCount: 0,
    breathingDisplayRound: 1,
    breathingPerfLevel: 'normal',
    isWritingFocused: false,
    writingAmbientSubtitle: '慢慢写，不必着急。先把心放下来，再把话写出来。',
    isAmbientSubtitleAnimating: false,
    blindBoxEntryShaking: false,
    squareRefreshing: false,
    newPostCount: 0,
    
    // 我的页面相关
    profileActiveTab: 'topics',
    profileMyTopicsList: [],
    profileLikedList: [],
    profileFavoriteList: [],
    profileTopicsRefreshing: false,
    profileLikesRefreshing: false,
    profileFavoritesRefreshing: false,
    publicMyTopicsList: [],
    privateMyTopicsList: [],
    
    // 主题相关
    theme: THEMES[0], // 默认使用第一个主题
    textPalette: resolveSemanticTextPalette(THEMES[0]),
    paperDateLineBorderColor: THEMES[0].primaryColor,
    paperDateLineShadowColor: getColorWithAlpha(THEMES[0].primaryColor, 0.25),
    publishBtnBgColor: getColorWithAlpha(THEMES[0].primaryColor, 0.1),
    publishBtnTextColor: THEMES[0].primaryColor,
    companionSelectedShadow1: getColorWithAlpha(THEMES[0].primaryColor, 0.3),
    companionSelectedShadow2: getColorWithAlpha(THEMES[0].primaryColor, 0.6),
    companionSelectedShadow3: getColorWithAlpha(THEMES[0].primaryColor, 0.2),
    companionSelectedShadow1Pulse: getColorWithAlpha(THEMES[0].primaryColor, 0.4),
    companionSelectedShadow2Pulse: getColorWithAlpha(THEMES[0].primaryColor, 0.8),
    companionSelectedShadow3Pulse: getColorWithAlpha(THEMES[0].primaryColor, 0.25),
    isCompanionSelectedPulse: false,
    
    // 小精灵拖动状态
    isCompanionDragging: false,
    // 小精灵选中状态
    isCompanionSelected: false,
    // 小精灵移动状态
    isCompanionMoving: false,
    // 移动动画定时器
    companionMoveTimer: null
  },

  // 自定义背景相关
  onTapToolBackground() {
    this.openToolPanel('background', { anchorId: 'toolEntryBackground' });
  },

  onChooseBackground() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({ customBackground: tempFilePath });
        // 保存到本地存储
        try {
          wx.setStorageSync('customBackground', tempFilePath);
        } catch (e) {
          console.error('保存自定义背景失败:', e);
        }
        this.showToast({
          message: '背景已设置',
          icon: '✓',
          duration: 2000
        });
        // 关闭自定义背景弹窗
        this.closeToolPanel();
      }
    });
  },

  onClearBackground() {
    this.setData({ customBackground: '' });
    try {
      wx.removeStorageSync('customBackground');
    } catch (e) {
      console.error('清除自定义背景失败:', e);
    }
    this.showToast({
      message: '背景已清除',
      icon: '✓',
      duration: 2000
    });
  },

  restoreCustomBackground() {
    try {
      const storedBackground = wx.getStorageSync('customBackground');
      if (storedBackground) {
        this.setData({ customBackground: storedBackground });
      }
    } catch (e) {
      console.error('恢复自定义背景失败:', e);
    }
  },

  onLoad() {
    this.restoreCustomBackground();
    // 优先从全局数据读取，如果全局数据为空才从本地存储读取
    const app = getApp();
    
    // 同步用户信息
    if (app.globalData.userInfo) {
      this.setData({ userInfo: app.globalData.userInfo });
    }
    
    // 获取自定义弹窗组件实例
    this.customToast = null;
    
    let initialMyDiaryList = app.globalData.diaryList || [];
    
    if (initialMyDiaryList.length === 0) {
      try {
        initialMyDiaryList = wx.getStorageSync('myDiaryList') || [];
      } catch (e) {
        console.error('读取本地存储失败:', e);
      }
      if (initialMyDiaryList.length === 0) {
        initialMyDiaryList = this.getInitialMyDiaryList();
      }
    }
    
    // 从本地存储读取点赞和收藏状态
    let likedPostIds = [];
    let collectedPostIds = [];
    try {
      likedPostIds = wx.getStorageSync('likedPostIds') || [];
      collectedPostIds = wx.getStorageSync('collectedPostIds') || [];
    } catch (e) {
      console.error('读取交互状态失败:', e);
    }
    
    // 应用点赞和收藏状态到 myDiaryList
    initialMyDiaryList = initialMyDiaryList.map(item => ({
      ...item,
      isLiked: likedPostIds.includes(item.id),
      isCollected: collectedPostIds.includes(item.id)
    }));
    
    // 从 myDiaryList 中筛选公开内容作为广场数据，并确保状态一致
    const initialSquarePostList = initialMyDiaryList.filter(item => !item.isPrivate);
    
    this.setData({
      myDiaryList: initialMyDiaryList,
      squarePostList: initialSquarePostList
    });
    // 同步到全局数据
    app.globalData.diaryList = initialMyDiaryList;
    app.globalData.squarePostList = initialSquarePostList;
    this.initRainPerfProfile();
    this.initRainModeState();
    this.initScenePerfProfile();
    this.initImmersiveSceneState();
    this.restoreToolbarSettingsFromStorage();
    this.initBreathingPerfProfile();
    this.initDecoPositions();
    this.initMovableFab();
    this.syncThemeFromGlobal();
    this.syncAudioFromGlobal();
    this.updateNavigationBarColor();
    this.startSceneEntranceTransition();
    this.updateOrnamentWindMotion(this.data.sceneIntensity);
    this.setData({ writingDateText: this.getCurrentWritingDateText() });
    this.updateAmbientTimeSlot();
    this.updateWritingLightFxStyles();

    if (wx.onWindowResize) {
      this.handleWindowResize = () => {
        this.initMovableFab({ keepPosition: true });
        this.updateCompanionNestBounds();
      };
      wx.onWindowResize(this.handleWindowResize);
    }

    setTimeout(() => {
      this.updateCompanionNestBounds();
    }, 60);
  },

  onReady() {
    // 获取自定义弹窗组件实例
    this.customToast = this.selectComponent('#customToast');
  },

  getTimeOfDay(hour) {
    if (hour >= 5 && hour < 9) return '凌晨';
    if (hour >= 9 && hour < 12) return '上午';
    if (hour >= 12 && hour < 14) return '中午';
    if (hour >= 14 && hour < 18) return '下午';
    if (hour >= 18 && hour < 21) return '傍晚';
    return '深夜';
  },

  getCurrentWritingDateText() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const timeOfDay = this.getTimeOfDay(now.getHours());
    return `${year}.${month}.${day} ${timeOfDay} ${hour}:${minute}`;
  },

  startWritingDateLoop() {
    this.stopWritingDateLoop();
    this.writingDateTimer = setInterval(() => {
      this.setData({ writingDateText: this.getCurrentWritingDateText() });
    }, 60000);
  },

  stopWritingDateLoop() {
    if (this.writingDateTimer) {
      clearInterval(this.writingDateTimer);
      this.writingDateTimer = null;
    }
  },

  // 自定义弹窗方法
  showToast(options = {}) {
    if (this.customToast) {
      this.customToast.show(options);
    } else {
      // 降级到系统弹窗
      wx.showToast(options);
    }
  },

  getToolbarSettingsSnapshot() {
    const {
      activePostType,
      writingLightEnabled,
      writingLightColorMode,
      writingLightFromSide,
      writingLightIntensity,
      writingLightAngle,
      writingLightFocus,
      selectedHangingOrnament
    } = this.data;

    return {
      activePostType,
      writingLightEnabled,
      writingLightColorMode,
      writingLightIntensity,
      writingLightAngle,
      writingLightFocus,
      selectedHangingOrnament
    };
  },

  persistToolbarSettings(patch = {}) {
    try {
      const next = {
        ...this.getToolbarSettingsSnapshot(),
        ...(patch || {})
      };
      wx.setStorageSync(HOME_TOOLBAR_SETTINGS_KEY, next);
    } catch (e) {
      console.error('保存工具栏设置失败:', e);
    }
  },

  restoreToolbarSettingsFromStorage() {
    try {
      const stored = wx.getStorageSync(HOME_TOOLBAR_SETTINGS_KEY) || {};
      if (!stored || typeof stored !== 'object') {
        return;
      }

      const nextData = {};

      if (POST_TYPE_META[stored.activePostType]) {
        nextData.activePostType = stored.activePostType;
        nextData.postPlaceholder = this.getPostTypeMeta(stored.activePostType).placeholder;
        nextData.packageActionLabel = this.getPostActionMeta(stored.activePostType).cta;
      }

      if (typeof stored.writingLightEnabled === 'boolean') {
        nextData.writingLightEnabled = stored.writingLightEnabled;
      }

      if (WRITING_LIGHT_COLOR_META[stored.writingLightColorMode]) {
        nextData.writingLightColorMode = stored.writingLightColorMode;
      }

      const safeIntensity = Number(stored.writingLightIntensity);
      if (Number.isFinite(safeIntensity)) {
        nextData.writingLightIntensity = Math.max(0, Math.min(100, Math.round(safeIntensity)));
      }

      const safeAngle = Number(stored.writingLightAngle);
      if (Number.isFinite(safeAngle)) {
        nextData.writingLightAngle = Math.max(0, Math.min(65, Math.round(safeAngle)));
      }

      const safeFocus = Number(stored.writingLightFocus);
      if (Number.isFinite(safeFocus)) {
        nextData.writingLightFocus = Math.max(20, Math.min(100, Math.round(safeFocus)));
      }

      if (HANGING_ORNAMENT_META[stored.selectedHangingOrnament]) {
        const meta = this.getHangingOrnamentMeta(stored.selectedHangingOrnament);
        nextData.selectedHangingOrnament = stored.selectedHangingOrnament;
        nextData.pendingHangingOrnament = stored.selectedHangingOrnament;
        nextData.hangingOrnamentLabel = meta.label;
        nextData.hangingOrnamentSymbol = meta.symbol;
      }

      if (Object.keys(nextData).length) {
        this.setData(nextData, () => {
          this.updateWritingLightFxStyles();
        });
      }
    } catch (e) {
      console.error('恢复工具栏设置失败:', e);
    }
  },

  resolveAmbientTimeSlot() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 16 && hour < 20) return 'dusk';
    return 'night';
  },

  updateAmbientTimeSlot() {
    const ambientTimeSlot = this.resolveAmbientTimeSlot();
    if (ambientTimeSlot !== this.data.ambientTimeSlot) {
      this.setData({ ambientTimeSlot });
    }
  },

  startAmbientTimeSlotLoop(interval = 60000) {
    this.stopAmbientTimeSlotLoop();
    this.ambientTimeSlotTimer = setInterval(() => {
      this.updateAmbientTimeSlot();
    }, interval);
  },

  stopAmbientTimeSlotLoop() {
    if (this.ambientTimeSlotTimer) {
      clearInterval(this.ambientTimeSlotTimer);
      this.ambientTimeSlotTimer = null;
    }
  },

  startSceneEntranceTransition(duration = 2400) {
    this.setData({ isSceneEntering: true });
    clearTimeout(this.sceneEnterTimer);
    this.sceneEnterTimer = setTimeout(() => {
      this.setData({ isSceneEntering: false });
    }, duration);
  },

  initMovableFab(options = {}) {
    const { keepPosition = false } = options;
    try {
      const info = wx.getSystemInfoSync ? wx.getSystemInfoSync() : {};
      const width = Number(info.windowWidth || 375);
      const height = Number(info.windowHeight || 667);
      const rpxToPx = width / 750;
      const fabSize = Math.round((width <= 360 ? 108 : 72) * rpxToPx);
      const bottomReserve = Math.round(120 * rpxToPx);
      const yMax = Math.max(0, height - fabSize - bottomReserve);

      this.viewportInfo = {
        width,
        height,
        fabSize,
        yMax
      };

      const defaultX = Math.max(0, Math.round(100 * rpxToPx));
      const defaultY = Math.max(0, Math.round(yMax));
      const nextX = keepPosition ? Number(this.data.fabX) : defaultX;
      const nextY = keepPosition ? Number(this.data.fabY) : defaultY;
      const { x: fabX, y: fabY } = this.clampFabPosition(nextX, nextY);

      this.setData({ fabX, fabY });
      this.updateCompanionBubbleLayout(fabX, fabY);
    } catch (e) {
      this.setData({ fabX: 100, fabY: 640 });
    }
  },

  clampFabPosition(x = 0, y = 0) {
    const viewport = this.viewportInfo || {};
    const width = Number(viewport.width || 375);
    const height = Number(viewport.height || 667);
    const fabSize = Number(viewport.fabSize || Math.round((width / 750) * 72));
    const maxX = Math.max(0, width - fabSize);
    const maxY = Number.isFinite(viewport.yMax)
      ? Math.max(0, viewport.yMax)
      : Math.max(0, height - fabSize - Math.round((width / 750) * 120));

    return {
      x: Math.max(0, Math.min(maxX, Math.round(Number(x) || 0))),
      y: Math.max(0, Math.min(maxY, Math.round(Number(y) || 0)))
    };
  },

  updateCompanionBubbleLayout(x = this.data.fabX, y = this.data.fabY) {
    const viewport = this.viewportInfo || {};
    const width = Number(viewport.width || 375);
    const height = Number(viewport.height || 667);
    
    let side = this.data.companionBubbleSide || 'right';
    let vertical = this.data.companionBubbleVertical || 'middle';
    
    if (Number(x) > width * 0.65) {
      side = 'right';
    } else if (Number(x) < width * 0.35) {
      side = 'left';
    }
    
    if (Number(y) < height * 0.25) {
      vertical = 'bottom';
    } else if (Number(y) > height * 0.75) {
      vertical = 'top';
    }

    if (
      side !== this.data.companionBubbleSide ||
      vertical !== this.data.companionBubbleVertical
    ) {
      this.setData({
        companionBubbleSide: side,
        companionBubbleVertical: vertical
      });
    }
  },

  updateCompanionNestBounds() {
    const query = this.createSelectorQuery && this.createSelectorQuery();
    if (!query) return;
    query.select('#companionNestSlot').boundingClientRect((rect) => {
      if (!rect) return;
      this.companionNestBounds = rect;
    }).exec();
  },

  isPointInCompanionNest(point = {}, options = {}) {
    const bounds = this.companionNestBounds;
    if (!bounds) return false;
    const x = Number(point.x || 0);
    const y = Number(point.y || 0);
    const padding = Number(options.padding);
    const safePadding = Number.isFinite(padding) ? padding : 10;
    return (
      x >= bounds.left - safePadding &&
      x <= bounds.right + safePadding &&
      y >= bounds.top - safePadding &&
      y <= bounds.bottom + safePadding
    );
  },

  onTapCompanionNest() {
    if (!this.data.companionInNest) {
      this.dockCompanionToNest();
      return;
    }

    this.setData({
      companionInNest: false,
      companionNestHighlighted: false,
      companionState: 'happy'
    }, () => {
      this.initMovableFab({ keepPosition: true });
      this.showCompanionBubble('我出来啦，想让我陪你做什么？', 1300);
      this.startCompanionAmbientLoop();
    });
  },

  dockCompanionToNest() {
    this.clearCompanionBubbleTimer();
    this.stopBreathingGuide({ silent: true });
    this.stopCompanionAmbientLoop();
    this.stopCompanionSelectedPulse();
    this.setData({
      companionInNest: true,
      companionNestHighlighted: false,
      showCompanionBubble: false,
      companionBubbleText: '',
      companionDragLevel: 0,
      isCompanionDragging: false,
      isCompanionSelected: false,
      isCompanionMoving: false,
      companionTrailParticles: [],
      companionState: 'idle'
    });
  },

  initRainPerfProfile() {
    try {
      const info = wx.getSystemInfoSync ? wx.getSystemInfoSync() : {};
      const rainPerfLevel = resolvePerfLevelByBenchmark(info.benchmarkLevel);
      this.setData({ rainPerfLevel });
    } catch (e) {
      this.setData({ rainPerfLevel: 'normal' });
    }
  },

  initRainModeState() {
    let isRainModeEnabled = false;
    try {
      isRainModeEnabled = !!wx.getStorageSync('homeRainModeEnabled');
    } catch (e) {
      isRainModeEnabled = false;
    }

    this.setData({
      isRainModeEnabled,
      rainDrops: isRainModeEnabled ? this.buildRainDrops() : []
    });
  },

  initScenePerfProfile() {
    try {
      const info = wx.getSystemInfoSync ? wx.getSystemInfoSync() : {};
      const scenePerfLevel = resolvePerfLevelByBenchmark(info.benchmarkLevel);
      this.setData({ scenePerfLevel });
    } catch (e) {
      this.setData({ scenePerfLevel: 'normal' });
    }
  },

  resolveAutoSceneByTime() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'sunny';
    if (hour >= 11 && hour < 16) return 'windy';
    if (hour >= 16 && hour < 19) return 'cloudy';
    if (hour >= 19 && hour < 23) return 'rainy';
    return 'snowy';
  },

  initImmersiveSceneState() {
    let activeScene = 'rainy';
    let isSceneAutoMode = true;
    let sceneIntensity = 65;
    try {
      const storedScene = wx.getStorageSync('homeActiveScene');
      const storedAutoMode = wx.getStorageSync('homeSceneAutoMode');
      const storedIntensity = Number(wx.getStorageSync('homeSceneIntensity'));
      if (IMMERSIVE_SCENE_META[storedScene]) {
        activeScene = storedScene;
      }
      if (typeof storedAutoMode === 'boolean') {
        isSceneAutoMode = storedAutoMode;
      }
      if (Number.isFinite(storedIntensity)) {
        sceneIntensity = Math.max(20, Math.min(100, Math.round(storedIntensity)));
      }
    } catch (e) {
      // ignore
    }

    this.setData({ sceneIntensity });

    if (isSceneAutoMode) {
      activeScene = this.resolveAutoSceneByTime();
    }

    this.applyImmersiveScene(activeScene, {
      persist: true,
      silent: true,
      updateAutoMode: isSceneAutoMode
    });
  },

  buildSceneParticles(sceneKey = 'rainy') {
    const isLowPerf = this.data.scenePerfLevel === 'low';
    const intensityFactor = Math.max(0.2, Math.min(1, Number(this.data.sceneIntensity || 65) / 100));
    const profileMap = {
      sunny: {
        kinds: ['sun', 'sun', 'cloud'],
        baseCount: isLowPerf ? 5 : 9,
        baseSize: isLowPerf ? 14 : 18,
        sizeRange: isLowPerf ? 12 : 20,
        opacityMin: 0.4,
        opacityRange: 0.5,
        durationBase: isLowPerf ? 4200 : 3200,
        durationRange: 1800,
        driftXRange: 40,
        driftYBase: 30,
        driftYRange: 60
      },
      cloudy: {
        kinds: ['cloud', 'cloud', 'wind'],
        baseCount: isLowPerf ? 5 : 9,
        baseSize: isLowPerf ? 14 : 18,
        sizeRange: isLowPerf ? 14 : 24,
        opacityMin: 0.4,
        opacityRange: 0.5,
        durationBase: isLowPerf ? 5600 : 4600,
        durationRange: 2400,
        driftXRange: 72,
        driftYBase: 22,
        driftYRange: 44
      },
      rainy: {
        kinds: ['rain', 'rain', 'cloud'],
        baseCount: isLowPerf ? 7 : 14,
        baseSize: isLowPerf ? 11 : 14,
        sizeRange: isLowPerf ? 12 : 18,
        opacityMin: 0.45,
        opacityRange: 0.45,
        durationBase: isLowPerf ? 3600 : 2800,
        durationRange: 1400,
        driftXRange: 26,
        driftYBase: 62,
        driftYRange: 90
      },
      windy: {
        kinds: ['wind', 'leaf', 'cloud'],
        baseCount: isLowPerf ? 6 : 11,
        baseSize: isLowPerf ? 12 : 16,
        sizeRange: isLowPerf ? 14 : 22,
        opacityMin: 0.4,
        opacityRange: 0.5,
        durationBase: isLowPerf ? 4200 : 3400,
        durationRange: 1800,
        driftXRange: 110,
        driftYBase: 28,
        driftYRange: 52
      },
      snowy: {
        kinds: ['snow', 'snow', 'cloud'],
        baseCount: isLowPerf ? 6 : 13,
        baseSize: isLowPerf ? 12 : 16,
        sizeRange: isLowPerf ? 12 : 22,
        opacityMin: 0.5,
        opacityRange: 0.4,
        durationBase: isLowPerf ? 6200 : 5200,
        durationRange: 2800,
        driftXRange: 48,
        driftYBase: 18,
        driftYRange: 40
      },
      stream: {
        kinds: ['leaf', 'wind', 'cloud'],
        baseCount: isLowPerf ? 6 : 10,
        baseSize: isLowPerf ? 12 : 16,
        sizeRange: isLowPerf ? 14 : 22,
        opacityMin: 0.4,
        opacityRange: 0.5,
        durationBase: isLowPerf ? 5000 : 3800,
        durationRange: 1900,
        driftXRange: 84,
        driftYBase: 34,
        driftYRange: 64
      }
    };
    const profile = profileMap[sceneKey] || profileMap.rainy;
    const count = Math.max(4, Math.round(profile.baseCount * (0.5 + intensityFactor * 0.7)));

    return Array.from({ length: count }, (_, idx) => ({
      id: `scene-${sceneKey}-${idx}`,
      kind: profile.kinds[idx % profile.kinds.length],
      left: Math.round(Math.random() * 100),
      top: Math.round(Math.random() * 100),
      size: Math.round(profile.baseSize + Math.random() * profile.sizeRange),
      opacity: Number((profile.opacityMin + Math.random() * profile.opacityRange).toFixed(2)),
      duration: Math.round(profile.durationBase + Math.random() * profile.durationRange),
      delay: Math.round(Math.random() * 1800),
      driftX: Math.round((Math.random() - 0.5) * profile.driftXRange),
      driftY: Math.round(profile.driftYBase + Math.random() * profile.driftYRange)
    }));
  },

  applyImmersiveScene(sceneKey = 'rainy', options = {}) {
    const { persist = true, silent = false, updateAutoMode } = options;
    const key = IMMERSIVE_SCENE_META[sceneKey] ? sceneKey : 'rainy';
    const meta = IMMERSIVE_SCENE_META[key];
    const nextAutoMode = typeof updateAutoMode === 'boolean' ? updateAutoMode : this.data.isSceneAutoMode;

    this.setData({
      activeScene: key,
      sceneLabel: meta.label,
      sceneDescription: meta.desc,
      sceneSoundLabel: meta.soundLabel,
      sceneParticles: this.buildSceneParticles(key),
      isRainModeEnabled: key === 'rainy',
      rainDrops: key === 'rainy' ? this.buildRainDrops() : [],
      isSceneAutoMode: nextAutoMode
    });

    try {
      const app = getApp();
      if (app.setSceneSoundscape) {
        app.setSceneSoundscape(key, {
          intensity: Number(this.data.sceneIntensity || 65) / 100,
          autoPlay: true,
          enabled: true
        });
      }
    } catch (e) {
      console.error('同步场景分轨音频失败:', e);
    }

    if (persist) {
      try {
        wx.setStorageSync('homeActiveScene', key);
        wx.setStorageSync('homeSceneAutoMode', nextAutoMode);
      } catch (e) {
        // ignore
      }
    }

    if (!silent) {
      this.triggerCompanionMoment({
        state: 'happy',
        text: `切到${meta.label}场景：${meta.desc}`,
        duration: 1600
      });
    }
  },

  onSceneChange(e) {
    const scene = e.currentTarget.dataset.scene;
    if (!IMMERSIVE_SCENE_META[scene]) {
      return;
    }
    this.applyImmersiveScene(scene, {
      persist: true,
      silent: false,
      updateAutoMode: false
    });
  },

  onSceneAutoModeChange(e) {
    const enabled = !!(e && e.detail && e.detail.value);
    if (enabled) {
      this.applyImmersiveScene(this.resolveAutoSceneByTime(), {
        persist: true,
        silent: false,
        updateAutoMode: true
      });
      return;
    }

    this.setData({ isSceneAutoMode: false });
    try {
      wx.setStorageSync('homeSceneAutoMode', false);
    } catch (e) {
      // ignore
    }
  },

  buildRainDrops() {
    const isLowPerf = this.data.rainPerfLevel === 'low';
    const intensityFactor = Math.max(0.2, Math.min(1, Number(this.data.sceneIntensity || 65) / 100));
    const baseCount = isLowPerf ? 14 : 28;
    const count = Math.max(8, Math.round(baseCount * (0.65 + intensityFactor * 0.9)));
    return Array.from({ length: count }, (_, idx) => ({
      id: `rain-${idx}`,
      left: Math.round(Math.random() * 100),
      height: Math.round((isLowPerf ? 22 : 28) + Math.random() * (isLowPerf ? 18 : 28)),
      duration: Math.round((isLowPerf ? 1400 : 1150) + Math.random() * 900),
      delay: Math.round(Math.random() * 1600),
      opacity: Number((isLowPerf ? 0.45 : 0.55) + Math.random() * 0.35).toFixed(2)
    }));
  },

  initBreathingPerfProfile() {
    try {
      const info = wx.getSystemInfoSync ? wx.getSystemInfoSync() : {};
      const breathingPerfLevel = resolvePerfLevelByBenchmark(info.benchmarkLevel);
      this.setData({ breathingPerfLevel });
    } catch (e) {
      this.setData({ breathingPerfLevel: 'normal' });
    }
  },

  getInitialMyDiaryList() {
    // 不返回任何模拟数据，只返回空数组
    return [];
  },

  getInitialSquarePostList() {
    // 不返回任何模拟数据，只返回空数组
    return [];
  },

  getPostTypeMeta(type = 'diary') {
    return POST_TYPE_META[type] || POST_TYPE_META.diary;
  },

  getPostActionMeta(type = 'letter') {
    return POST_ACTION_META[type] || POST_ACTION_META.letter;
  },

  formatTimeAgo(timestamp) {
    if (!timestamp) return '刚刚';
    
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) {
      return '刚刚';
    } else if (minutes < 60) {
      return `${minutes}分钟前`;
    } else if (hours < 24) {
      return `${hours}小时前`;
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },

  createTypedPostItem({
    id,
    content = '',
    time = '刚刚',
    scenePackage = null,
    nickname = '',
    title = '',
    location = '',
    blindBoxQuote = '',
    likeCount = 0,
    collectCount = 0,
    isLiked = false,
    isCollected = false,
    customBackground = '',
    writingTime,
    writingTimeText,
    publishTime,
    publishTimeText,
    isPrivate = false
  } = {}) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const defaultWritingTimeText = `${year}年${month}月${day}日 ${hour}:${minute}`;
    const defaultTime = now.getTime();

    return {
      id: id || `post-${Date.now()}`,
      scenePackage,
      content,
      time,
      nickname,
      title,
      location,
      blindBoxQuote,
      likeCount,
      collectCount,
      isLiked,
      isCollected,
      customBackground,
      writingTime: writingTime || defaultTime,
      writingTimeText: writingTimeText || defaultWritingTimeText,
      publishTime: publishTime || defaultTime,
      publishTimeText: publishTimeText || defaultWritingTimeText,
      isPrivate
    };
  },

  buildScenePackageSnapshot() {
    const {
      activeScene,
      sceneIntensity,
      theme,
      activeThemeType,
      selectedHangingOrnament,
      writingLightEnabled,
      writingLightColorMode,
      writingLightFromSide,
      writingLightIntensity,
      writingLightAngle,
      writingLightFocus,
      customBackground,
      isPostPrivate
    } = this.data;

    const safeIntensity = Math.max(20, Math.min(100, Number(sceneIntensity) || 65));

    return {
      sceneKey: activeScene || 'rainy',
      sceneIntensity: safeIntensity,
      themeId: Number(theme && theme.id),
      activeThemeType,
      selectedHangingOrnament,
      writingLightEnabled,
      writingLightColorMode,
      writingLightFromSide,
      writingLightIntensity,
      writingLightAngle,
      writingLightFocus,
      customBackground,
      isPostPrivate,
      capturedAt: Date.now()
    };
  },

  restoreScenePackage(scenePackage = {}, options = {}) {
    const { persist = false } = options; // 新增参数：是否持久化设置
    const sceneKey = IMMERSIVE_SCENE_META[scenePackage.sceneKey] ? scenePackage.sceneKey : 'rainy';
    const intensity = Math.max(20, Math.min(100, Number(scenePackage.sceneIntensity) || 65));
    const themeId = Number(scenePackage.themeId);

    // 还原主题
    if (Number.isFinite(themeId)) {
      try {
        const app = getApp();
        const nextThemeState = app.switchTheme ? app.switchTheme(themeId) : null;
        if (nextThemeState) {
          this.applyThemeState(nextThemeState);
        }
      } catch (e) {
        console.error('还原主题失败:', e);
      }
    }

    // 准备需要设置的数据
    const dataToSet = {
      sceneIntensity: intensity
    };

    // 还原挂件
    if (scenePackage.selectedHangingOrnament) {
      dataToSet.selectedHangingOrnament = scenePackage.selectedHangingOrnament;
      if (HANGING_ORNAMENT_META[scenePackage.selectedHangingOrnament]) {
        dataToSet.hangingOrnamentLabel = HANGING_ORNAMENT_META[scenePackage.selectedHangingOrnament].label;
        dataToSet.hangingOrnamentSymbol = HANGING_ORNAMENT_META[scenePackage.selectedHangingOrnament].symbol;
      }
    }

    // 还原灯光设置
    if (scenePackage.writingLightEnabled !== undefined) {
      dataToSet.writingLightEnabled = scenePackage.writingLightEnabled;
    }
    if (scenePackage.writingLightColorMode) {
      dataToSet.writingLightColorMode = scenePackage.writingLightColorMode;
    }
    if (scenePackage.writingLightFromSide) {
      dataToSet.writingLightFromSide = scenePackage.writingLightFromSide;
    }
    if (scenePackage.writingLightIntensity !== undefined) {
      dataToSet.writingLightIntensity = scenePackage.writingLightIntensity;
    }
    if (scenePackage.writingLightAngle !== undefined) {
      dataToSet.writingLightAngle = scenePackage.writingLightAngle;
    }
    if (scenePackage.writingLightFocus !== undefined) {
      dataToSet.writingLightFocus = scenePackage.writingLightFocus;
    }

    // 还原自定义背景
    if (scenePackage.customBackground !== undefined) {
      dataToSet.customBackground = scenePackage.customBackground;
    }

    // 还原隐私设置（仅用于编辑时）
    if (scenePackage.isPostPrivate !== undefined) {
      dataToSet.isPostPrivate = scenePackage.isPostPrivate;
    }

    // 设置数据
    this.setData(dataToSet);

    // 应用场景
    this.applyImmersiveScene(sceneKey, {
      persist: persist,
      silent: true,
      updateAutoMode: false
    });

    try {
      const app = getApp();
      if (app.setSceneSoundscape) {
        app.setSceneSoundscape(sceneKey, {
          intensity: intensity / 100,
          autoPlay: true,
          enabled: true
        });
      }
      if (persist) {
        wx.setStorageSync('homeSceneIntensity', intensity);
      }
    } catch (e) {
      console.error('还原场景包失败:', e);
    }

    return {
      sceneKey,
      intensity
    };
  },

  switchPostType(e) {
    const type = e.currentTarget.dataset.type;
    if (!POST_TYPE_META[type] || type === this.data.activePostType) {
      return;
    }

    this.setData({
      activePostType: type,
      postPlaceholder: this.getPostTypeMeta(type).placeholder,
      packageActionLabel: this.getPostActionMeta(type).cta
    });
    this.persistToolbarSettings({ activePostType: type });

    this.maybeTriggerCompanionActionInteraction('switchPostType');
  },

  onSelectThemeStyle(e) {
    const key = e.currentTarget.dataset.key;
    if (!THEME_STYLE_META[key] || key === this.data.activeThemeStyle) {
      return;
    }

    const styleMeta = THEME_STYLE_META[key];
    this.setData({
      activeThemeStyle: key
    });
    this.applyThemeStyle(key);
    this.persistToolbarSettings({ activeThemeStyle: key });
  },

  onSelectMoodStyle(e) {
    const key = e.currentTarget.dataset.key;
    if (!MOOD_STYLE_META[key] || key === this.data.activeMoodStyle) {
      return;
    }

    this.setData({
      activeMoodStyle: key
    });
    this.applyMoodStyle(key);
    this.persistToolbarSettings({ activeMoodStyle: key });
  },

  applyThemeStyle(key) {
    const styleMeta = THEME_STYLE_META[key];
    if (!styleMeta) return;

    const textPalette = {
      title: styleMeta.textColor,
      body: styleMeta.textColor,
      subtitle: styleMeta.subtextColor,
      tertiary: styleMeta.subtextColor,
      inverse: '#ffffff'
    };

    const theme = {
      ...this.data.theme,
      bgColor: styleMeta.bgColor,
      cardColor: styleMeta.cardColor,
      primaryColor: styleMeta.primaryColor
    };

    this.setData({
      textPalette,
      theme
    });
  },

  applyMoodStyle(key) {
    const styleMeta = MOOD_STYLE_META[key];
    if (!styleMeta) return;
    
    this.initDecoPositions();
    this.startDecoRefreshTimer();
  },

  initDecoPositions() {
    const positions = {};
    const opacity = {};
    const elements = [
      'flower-1', 'flower-2', 'flower-3',
      'leaf-1', 'leaf-2',
      'bamboo-1',
      'ink-1', 'ink-2',
      'circle-1', 'circle-2',
      'star-1', 'star-2', 'star-3',
      'cloud-1', 'cloud-2',
      'grass-1', 'grass-2',
      'brush-1', 'brush-2',
      'splash-1', 'splash-2'
    ];
    
    elements.forEach(el => {
      positions[el] = this.getRandomPosition();
      opacity[el] = 1;
    });
    
    this.setData({ decoPositions: positions, decoOpacity: opacity });
  },

  getRandomPosition() {
    const top = Math.floor(Math.random() * 70) + 10;
    const left = Math.floor(Math.random() * 60) + 10;
    return { top: `${top}%`, left: `${left}%` };
  },

  startDecoRefreshTimer() {
    if (this.decoRefreshTimer) {
      clearInterval(this.decoRefreshTimer);
    }
    
    this.decoRefreshTimer = setInterval(() => {
      this.refreshRandomDeco();
    }, 30000);
  },

  refreshRandomDeco() {
    const elements = Object.keys(this.data.decoPositions);
    if (elements.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * elements.length);
    const elementToRefresh = elements[randomIndex];
    
    // 第一步：淡出
    const fadeOutOpacity = { ...this.data.decoOpacity };
    fadeOutOpacity[elementToRefresh] = 0;
    
    this.setData({ decoOpacity: fadeOutOpacity }, () => {
      setTimeout(() => {
        // 第二步：更新位置（此时元素已隐藏，不会看到位置变化）
        const newPositions = { ...this.data.decoPositions };
        newPositions[elementToRefresh] = this.getRandomPosition();
        
        this.setData({ decoPositions: newPositions }, () => {
          // 第三步：淡入
          setTimeout(() => {
            const fadeInOpacity = { ...this.data.decoOpacity };
            fadeInOpacity[elementToRefresh] = 1;
            this.setData({ decoOpacity: fadeInOpacity });
          }, 100);
        });
      }, 800);
    });
  },

  stopDecoRefreshTimer() {
    if (this.decoRefreshTimer) {
      clearInterval(this.decoRefreshTimer);
      this.decoRefreshTimer = null;
    }
  },

  getHangingOrnamentMeta(key = 'knot') {
    return HANGING_ORNAMENT_META[key] || HANGING_ORNAMENT_META.knot;
  },

  getRpxToPxRatio() {
    const width = Number((this.viewportInfo && this.viewportInfo.width) || 0);
    if (width > 0) return width / 750;
    try {
      const info = wx.getSystemInfoSync ? wx.getSystemInfoSync() : {};
      return Number(info.windowWidth || 375) / 750;
    } catch (e) {
      return 375 / 750;
    }
  },

  getPanelEstimatedHeightPx(panel = '') {
    const rpxRatio = this.getRpxToPxRatio();
    const heightRpxMap = {
      theme: 360,
      blindbox: 320,
      package: 300,
      ornament: 420,
      template: 330,
      volume: 180,
      scene: 300,
      intensity: 180,
      light: 470,
      background: 380
    };
    return Math.round((heightRpxMap[panel] || 300) * rpxRatio);
  },

  updateMiniToolTopByAnchor(anchorId = '', panel = '') {
    return new Promise((resolve) => {
      if (!anchorId || !this.createSelectorQuery) {
        console.log('弹窗定位: 缺少anchorId或createSelectorQuery');
        // 设置一个默认值
        this.setData({ miniToolTopPx: 200 }, resolve);
        return;
      }
      const query = this.createSelectorQuery().in(this);
      query.select(`#${anchorId}`).boundingClientRect();
      query.selectViewport().boundingClientRect();
      query.exec((res) => {
        console.log('弹窗定位查询结果:', res);
        if (!res || !res[0] || !res[1]) {
          console.log('弹窗定位查询失败，使用默认值');
          // 查询失败时设置一个默认值
          this.setData({ miniToolTopPx: 200 }, resolve);
          return;
        }
        const anchorRect = res[0];
        const viewportRect = res[1];
        const panelHeightPx = this.getPanelEstimatedHeightPx(panel);
        const rpxRatio = this.getRpxToPxRatio();
        const bottomReserve = Math.round((104 + 20 + 40) * rpxRatio);
        const topReserve = Math.round(8);
        
        // 让弹窗的顶部对齐按钮的顶部
        let panelTop = anchorRect.top;
        
        // 确保弹窗在可视区域内
        const maxTop = Math.max(topReserve, viewportRect.height - panelHeightPx - bottomReserve);
        panelTop = Math.max(topReserve, Math.min(maxTop, Math.round(panelTop)));
        
        console.log('弹窗定位计算:', {
          anchorId,
          anchorTop: anchorRect.top,
          anchorHeight: anchorRect.height,
          panelHeightPx,
          panelTop,
          viewportHeight: viewportRect.height
        });
        
        this.setData({ miniToolTopPx: panelTop }, resolve);
      });
    });
  },

  openToolPanel(panel = '', options = {}) {
    const { anchorId = '' } = options || {};
    const isSameMiniPanel = this.data.activeToolPanel === panel;
    if (isSameMiniPanel) {
      this.closeToolPanel();
      return;
    }

    this.clearToolPanelAutoCloseTimer();
    
    // 先计算位置，再显示弹窗，避免抖动
    this.updateMiniToolTopByAnchor(anchorId, panel).then(() => {
      this.setData({
        activeToolPanel: panel
      }, () => {
        this.startToolPanelAutoCloseTimer(panel);
        this.updateCompanionNestBounds();
      });
    });
  },

  closeToolPanel() {
    this.clearToolPanelAutoCloseTimer();
    this.resetOrnamentDrag();
    this.setData({
      activeToolPanel: ''
    });
  },

  startToolPanelAutoCloseTimer(panel = '') {
    this.clearToolPanelAutoCloseTimer();
    if (!panel) return;

    this.toolPanelAutoCloseTimer = setTimeout(() => {
      if (this.data.activeToolPanel === panel) {
        this.closeToolPanel();
      }
    }, TOOL_PANEL_AUTO_CLOSE_MS);
  },

  clearToolPanelAutoCloseTimer() {
    if (this.toolPanelAutoCloseTimer) {
      clearTimeout(this.toolPanelAutoCloseTimer);
      this.toolPanelAutoCloseTimer = null;
    }
  },

  onTapToolPanelBody() {},

  onTapToolTheme() {
    this.openToolPanel('theme', { anchorId: 'toolEntryTheme' });
  },

  onTapToolAmbience() {
    this.openToolPanel('scene', { anchorId: 'toolEntryScene' });
  },

  onTapToolScene() {
    this.openToolPanel('scene', { anchorId: 'toolEntryScene' });
  },

  onTapToolVolume() {
    this.openToolPanel('volume', { anchorId: 'toolEntryAudio' });
  },

  onTapToolIntensity() {
    this.openToolPanel('intensity', { anchorId: 'toolEntryIntensity' });
  },

  onTapToolLight() {
    this.openToolPanel('light', { anchorId: 'toolEntryLight' });
  },

  onTapToolTemplate() {
    this.openToolPanel('template', { anchorId: 'toolEntryTemplate' });
  },

  getWritingLightPalette(mode = 'warm') {
    return WRITING_LIGHT_COLOR_META[mode] || WRITING_LIGHT_COLOR_META.warm;
  },

  updateWritingLightFxStyles() {
    const {
      writingLightEnabled,
      writingLightColorMode,
      writingLightIntensity,
      writingLightAngle,
      writingLightFocus
    } = this.data;

    if (!writingLightEnabled) {
      this.setData({
        writingLightBeamStyle: '',
        writingLightGlowStyle: ''
      });
      return;
    }

    const palette = this.getWritingLightPalette(writingLightColorMode);
    const intensityRatio = Math.max(0, Math.min(1, Number(writingLightIntensity || 0) / 100));
    const focusRatio = Math.max(0.2, Math.min(1, Number(writingLightFocus || 0) / 100));

    const beamOpacity = '0.2';
    const edgeOpacity = '0.2';
    const tailOpacity = '0.2';
    const beamWidth = Math.round(96 + (1 - focusRatio) * 104);
    const beamBlur = Math.round(14 + (1 - focusRatio) * 28);

    const glowOpacity = '0.2';
    const glowSize = Math.round(360 + intensityRatio * 420);

    const writingLightBeamStyle = [
      `opacity: ${beamOpacity};`,
      `filter: blur(${beamBlur}rpx);`,
      `background: rgba(${palette.beamCore}, ${beamOpacity});`
    ].join(' ');

    const writingLightGlowStyle = [
      `opacity: ${glowOpacity};`,
      `background: rgba(${palette.glow}, ${glowOpacity});`
    ].join(' ');

    this.setData({
      writingLightBeamStyle,
      writingLightGlowStyle
    });
  },

  onSwitchWritingLightColor(e) {
    const mode = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.mode;
    if (!WRITING_LIGHT_COLOR_META[mode]) return;
    this.setData({ writingLightColorMode: mode }, () => {
      this.updateWritingLightFxStyles();
      this.persistToolbarSettings({ writingLightColorMode: mode });
    });
  },

  onWritingLightEnableChange(e) {
    const enabled = !!(e && e.detail && e.detail.value);
    this.setData({ writingLightEnabled: enabled }, () => {
      this.updateWritingLightFxStyles();
      this.persistToolbarSettings({ writingLightEnabled: enabled });
    });
  },



  onWritingLightIntensityChange(e) {
    const value = Number(e && e.detail && e.detail.value);
    const nextValue = Number.isFinite(value) ? value : this.data.writingLightIntensity;
    this.setData({
      writingLightIntensity: nextValue
    }, () => {
      this.updateWritingLightFxStyles();
      this.persistToolbarSettings({ writingLightIntensity: nextValue });
    });
  },

  onWritingLightAngleChange(e) {
    const value = Number(e && e.detail && e.detail.value);
    const nextValue = Number.isFinite(value) ? value : this.data.writingLightAngle;
    this.setData({
      writingLightAngle: nextValue
    }, () => {
      this.updateWritingLightFxStyles();
      this.persistToolbarSettings({ writingLightAngle: nextValue });
    });
  },

  onWritingLightFocusChange(e) {
    const value = Number(e && e.detail && e.detail.value);
    const nextValue = Number.isFinite(value) ? value : this.data.writingLightFocus;
    this.setData({
      writingLightFocus: nextValue
    }, () => {
      this.updateWritingLightFxStyles();
      this.persistToolbarSettings({ writingLightFocus: nextValue });
    });
  },

  onTapToolPackage() {
    this.openToolPanel('package', { anchorId: 'toolEntryPackage' });
  },

  onSelectPackageType(e) {
    const type = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.type;
    if (!POST_TYPE_META[type]) {
      return;
    }

    this.setData({
      activePostType: type,
      pendingPackageType: type,
      pendingPackageLabel: this.getPostTypeMeta(type).label,
      postPlaceholder: this.getPostTypeMeta(type).placeholder,
      packageActionLabel: this.getPostActionMeta(type).cta,
      activeToolPanel: '',
      showPackageConfirmDialog: true
    });
    this.persistToolbarSettings({ activePostType: type });
  },

  closePackageConfirmDialog() {
    this.setData({ showPackageConfirmDialog: false });
  },

  onSaveDraftPackage() {
    this.setData({ showPackageConfirmDialog: false });
    this.showToast({
      message: '已存草稿',
      icon: '✓',
      duration: 2000
    });
    this.triggerCompanionMoment({
      state: 'happy',
      text: '草稿收好啦，随时继续写。',
      duration: 1200
    });
  },

  onConfirmPackageStart() {
    if (!String(this.data.postContent || '').trim()) {
      this.showToast({
        message: '先写一点内容再封装',
        icon: '⚠️',
        duration: 2000
      });
      return;
    }

    this.setData({
      showPackageConfirmDialog: false,
      showPackagingAnimation: true
    });

    clearTimeout(this.packageAnimationTimer);
    this.packageAnimationTimer = setTimeout(() => {
      this.setData({
        showPackagingAnimation: false,
        showPackagePublishDialog: true
      });
      this.packageAnimationTimer = null;
    }, 1200);
  },

  closePackagePublishDialog() {
    this.setData({ showPackagePublishDialog: false });
  },

  // 关闭保存成功弹窗
  closeSaveSuccessDialog() {
    this.setData({ showSaveSuccessDialog: false });
  },

  // 去查看私密作品
  onGoToPrivatePosts() {
    this.setData({ showSaveSuccessDialog: false });
    wx.navigateTo({
      url: '/pages/private/index'
    });
  },

  onPublishPackagedPost() {
    this.setData({ showPackagePublishDialog: false });
    this.publishPost({ visibility: 'public' });
  },

  onSavePackagedLocal() {
    this.setData({ showPackagePublishDialog: false });
    this.publishPost({ visibility: 'private' });
  },

  updateOrnamentWindMotion(intensity = 65) {
    const safe = Math.max(20, Math.min(100, Number(intensity) || 65));
    const ratio = (safe - 20) / 80;
    this.setData({
      ornamentSwayDeg: Number((3 + ratio * 8).toFixed(1)),
      tasselSwingDeg: Number((10 + ratio * 14).toFixed(1)),
      ornamentSwayDuration: Number((3.4 - ratio * 1.5).toFixed(2))
    });
  },

  onSelectHangingOrnament() {
    this.resetOrnamentDrag();
    this.openToolPanel('ornament', { anchorId: 'toolEntryOrnament' });
    this.setData({ pendingHangingOrnament: this.data.selectedHangingOrnament || 'knot' });
  },

  onChooseHangingOrnament(e) {
    const key = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.key;
    if (!HANGING_ORNAMENT_META[key]) {
      return;
    }
    this.applyHangingOrnament(key, { closePanel: true });
  },

  onConfirmHangingOrnament() {
    const key = this.data.pendingHangingOrnament;
    this.applyHangingOrnament(key, { closePanel: true });
  },

  applyHangingOrnament(key, options = {}) {
    if (!HANGING_ORNAMENT_META[key]) {
      return;
    }
    const { closePanel = false } = options;
    const meta = this.getHangingOrnamentMeta(key);
    const nextState = {
      selectedHangingOrnament: key,
      pendingHangingOrnament: key,
      hangingOrnamentLabel: meta.label,
      hangingOrnamentSymbol: meta.symbol
    };
    if (closePanel) {
      nextState.showToolPanel = false;
      nextState.activeToolPanel = '';
    }
    this.setData(nextState);
    this.persistToolbarSettings({ selectedHangingOrnament: key });
    this.triggerCompanionMoment({
      state: 'happy',
      text: `挂上了${meta.label}，风也变温柔了。`,
      duration: 1400
    });
  },

  getOrnamentDropZoneBounds() {
    const width = Number((this.viewportInfo && this.viewportInfo.width) || 375);
    const left = Math.round(width - 170);
    const right = Math.round(width - 8);
    const top = 28;
    const bottom = 260;
    return { left, right, top, bottom };
  },

  isPointInOrnamentDropZone(point = {}) {
    const x = Number(point.x);
    const y = Number(point.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
    const bounds = this.getOrnamentDropZoneBounds();
    return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
  },

  updateOrnamentDragVisual(point = {}) {
    const x = Number(point.x || 0);
    const y = Number(point.y || 0);
    const insideHook = this.isPointInOrnamentDropZone({ x, y });
    const ornamentDragStyle = `left:${Math.round(x - 34)}px;top:${Math.round(y - 34)}px;`;
    this.setData({
      ornamentDragStyle,
      isOrnamentHookHighlighted: insideHook
    });
    return insideHook;
  },

  onOrnamentOptionLongPress(e) {
    const key = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.key;
    if (!HANGING_ORNAMENT_META[key]) {
      return;
    }
    const touch = (e && e.changedTouches && e.changedTouches[0]) || (e && e.touches && e.touches[0]) || {};
    const point = { x: Number(touch.pageX || 0), y: Number(touch.pageY || 0) };
    const ornamentDragStyle = `left:${Math.round(point.x - 34)}px;top:${Math.round(point.y - 34)}px;`;
    const meta = this.getHangingOrnamentMeta(key);
    this.setData({
      isOrnamentDragging: true,
      ornamentDraggingKey: key,
      ornamentDraggingSymbol: meta.symbol,
      pendingHangingOrnament: key,
      ornamentDragStyle,
      isOrnamentHookHighlighted: this.isPointInOrnamentDropZone(point)
    });
  },

  onOrnamentOptionTouchMove(e) {
    if (!this.data.isOrnamentDragging) {
      return;
    }
    const touch = (e && e.touches && e.touches[0]) || {};
    this.updateOrnamentDragVisual({
      x: Number(touch.pageX || 0),
      y: Number(touch.pageY || 0)
    });
  },

  onOrnamentOptionTouchEnd(e) {
    if (!this.data.isOrnamentDragging) {
      return;
    }
    const touch = (e && e.changedTouches && e.changedTouches[0]) || (e && e.touches && e.touches[0]) || {};
    const point = { x: Number(touch.pageX || 0), y: Number(touch.pageY || 0) };
    const isDropSuccess = this.isPointInOrnamentDropZone(point);
    const dragKey = this.data.ornamentDraggingKey;
    this.resetOrnamentDrag();
    if (isDropSuccess && HANGING_ORNAMENT_META[dragKey]) {
      this.applyHangingOrnament(dragKey, { closePanel: true });
    }
  },

  onOrnamentOptionTouchCancel() {
    this.resetOrnamentDrag();
  },

  resetOrnamentDrag() {
    if (
      !this.data.isOrnamentDragging &&
      !this.data.isOrnamentHookHighlighted &&
      !this.data.ornamentDragStyle
    ) {
      return;
    }
    this.setData({
      isOrnamentDragging: false,
      ornamentDragStyle: '',
      ornamentDraggingKey: '',
      ornamentDraggingSymbol: '',
      isOrnamentHookHighlighted: false
    });
  },

  onTapToolBlindBox() {
    this.openToolPanel('blindbox', { anchorId: 'toolEntryBlindbox' });
  },

  onOpenBlindBoxFromPanel() {
    this.openBlindBox();
  },

  clearBlindBoxTimers() {
    this.isBlindBoxAnimating = false;
    if (this.blindBoxEntryShakeTimer) {
      clearTimeout(this.blindBoxEntryShakeTimer);
      this.blindBoxEntryShakeTimer = null;
    }
    this.setData({ blindBoxEntryShaking: false });
    if (this.blindBoxRevealTimer) {
      clearTimeout(this.blindBoxRevealTimer);
      this.blindBoxRevealTimer = null;
    }
    if (this.blindBoxOverlayTimer) {
      clearTimeout(this.blindBoxOverlayTimer);
      this.blindBoxOverlayTimer = null;
    }
    if (this.ambientSubtitleAnimTimer) {
      clearTimeout(this.ambientSubtitleAnimTimer);
      this.ambientSubtitleAnimTimer = null;
    }
  },

  onShow() {
    this.syncThemeFromGlobal();
    this.syncAudioFromGlobal();
    
    // 同步用户信息
    const app = getApp();
    if (app.globalData.userInfo) {
      this.setData({ userInfo: app.globalData.userInfo });
      
      // 重新加载列表数据，确保用户信息同步更新
      this.loadProfileMyTopics();
      this.loadProfileFavorites();
      this.loadProfileLiked();
      
      // 优先从本地存储加载数据，确保数据完整性
      this.loadDataFromStorage();
    }
    
    this.restoreToolbarSettingsFromStorage();
    this.updateAmbientTimeSlot();
    this.startAmbientTimeSlotLoop();
    this.setData({ writingDateText: this.getCurrentWritingDateText() });
    this.startWritingDateLoop();
    if (this.data.isSceneAutoMode) {
      this.applyImmersiveScene(this.resolveAutoSceneByTime(), {
        persist: true,
        silent: true,
        updateAutoMode: true
      });
    }
    this.initMovableFab({ keepPosition: true });
    this.startDecoRefreshTimer();
    // 重新计算精灵窝边界，确保使用最新位置
    setTimeout(() => {
      this.updateCompanionNestBounds();
    }, 100);
    this.maybeTriggerCompanionWhisper();
    this.startCompanionAmbientLoop();
    
    // 从本地存储重新加载点赞和收藏状态，确保与详情页同步
    this.loadInteractionsFromStorage();
    
    // 如果精灵是选中状态，重新启动脉冲效果
    if (this.data.isCompanionSelected && !this.data.companionInNest) {
      this.startCompanionSelectedPulse();
    }
    
    // 检查是否有正在编辑的帖子
    if (app.globalData.editingPost) {
      const target = app.globalData.editingPost;
      
      // 设置编辑内容到写点页面
      this.setData({
        currentPage: 0,
        postTitle: target.title || '',
        postContent: target.content || '',
        postLocation: target.location || '',
        activePostType: target.type || 'diary',
        isPostPrivate: target.isPrivate || false,
        editingPostId: target.id // 标记当前正在编辑的帖子ID
      });
      
      // 如果有场景包，还原场景（编辑时不持久化）
      if (target.scenePackage) {
        this.restoreScenePackage(target.scenePackage, { persist: false });
      }
      
      // 清除全局数据中的编辑帖子
      app.globalData.editingPost = null;
    }
  },

  onHide() {
    this.stopBreathingGuide({ silent: true });
    this.clearCompanionBubbleTimer();
    this.clearCompanionLongPressTimer();
    this.clearCompanionDragSettleTimer();
    clearTimeout(this.companionTapFeedbackTimer);
    this.stopDecoRefreshTimer();
    this.companionTapFeedbackTimer = null;
    clearTimeout(this.clearSuppressedTapTimer);
    this.clearSuppressedTapTimer = null;
    this.shouldSuppressNextPublishTap = false;
    this.companionTouchStartPoint = null;
    this.clearToolPanelAutoCloseTimer();
    this.clearBlindBoxTimers();
    this.stopCompanionAmbientLoop();
    this.stopCompanionSelectedPulse();
    clearTimeout(this.packageAnimationTimer);
    this.packageAnimationTimer = null;
    this.setData({
      showPackageConfirmDialog: false,
      showPackagePublishDialog: false,
      showPackagingAnimation: false
    });
    this.persistCompanionLastActiveAt();
    clearTimeout(this.sceneEnterTimer);
    clearTimeout(this.sceneRestoreHintTimer);
    this.stopAmbientTimeSlotLoop();
    this.stopWritingDateLoop();
  },

  onUnload() {
    this.stopBreathingGuide({ silent: true });
    this.clearCompanionBubbleTimer();
    this.clearCompanionLongPressTimer();
    this.clearCompanionDragSettleTimer();
    this.stopDecoRefreshTimer();
    clearTimeout(this.companionTapFeedbackTimer);
    this.companionTapFeedbackTimer = null;
    clearTimeout(this.clearSuppressedTapTimer);
    this.clearSuppressedTapTimer = null;
    this.shouldSuppressNextPublishTap = false;
    this.companionTouchStartPoint = null;
    this.clearToolPanelAutoCloseTimer();
    this.clearBlindBoxTimers();
    this.stopCompanionAmbientLoop();
    this.stopCompanionSelectedPulse();
    clearTimeout(this.packageAnimationTimer);
    this.packageAnimationTimer = null;
    this.persistCompanionLastActiveAt();
    clearTimeout(this.sceneEnterTimer);
    clearTimeout(this.sceneRestoreHintTimer);
    this.stopAmbientTimeSlotLoop();
    this.stopWritingDateLoop();

    if (this.handleWindowResize && wx.offWindowResize) {
      wx.offWindowResize(this.handleWindowResize);
      this.handleWindowResize = null;
    }
  },

  persistCompanionLastActiveAt() {
    try {
      wx.setStorageSync('homeCompanionLastActiveAt', Date.now());
    } catch (e) {
      // ignore
    }
  },

  maybeTriggerCompanionWhisper() {
    if (this.data.companionInNest) {
      return;
    }
    try {
      const now = Date.now();
      const last = Number(wx.getStorageSync('homeCompanionLastActiveAt')) || 0;
      const hour = new Date(now).getHours();
      const isNight = hour >= 23 || hour <= 5;
      const longGap = last > 0 && now - last > 1000 * 60 * 60 * 3;

      if (isNight) {
        this.showCompanionBubble('还没睡吗？今天辛苦啦', 2600);
      } else if (longGap) {
        this.showCompanionBubble('欢迎回来，我一直都在。', 2200);
      }

      wx.setStorageSync('homeCompanionLastActiveAt', now);
    } catch (e) {
      // ignore
    }
  },

  getCompanionTimeSlot() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 17) return 'noon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  },

  maybeTriggerCompanionAmbientInteraction(reason = 'timer') {
    if (this.data.companionInNest || this.data.isBreathingActive || this.data.isCompanionDragging || this.data.showCompanionBubble) {
      return;
    }

    const now = Date.now();
    if (now - (this.lastCompanionAmbientAt || 0) < 24000) {
      return;
    }

    const chance = reason === 'resume' ? 0.52 : 0.34;
    if (Math.random() > chance) {
      return;
    }

    const sceneKey = this.data.activeScene || 'rainy';
    const sceneLines = COMPANION_SCENE_RANDOM_LINES[sceneKey] || COMPANION_SCENE_RANDOM_LINES.rainy;
    const timeLines = COMPANION_TIME_RANDOM_LINES[this.getCompanionTimeSlot()] || [];
    const text = pickRandom([...sceneLines, ...timeLines]);
    if (!text) {
      return;
    }

    this.lastCompanionAmbientAt = now;
    this.triggerCompanionMoment({
      state: sceneKey === 'rainy' || sceneKey === 'snowy' ? 'idle' : 'happy',
      text,
      duration: 1600,
      restoreAfter: true
    });
  },

  scheduleNextCompanionAmbientTick() {
    clearTimeout(this.companionAmbientTimer);
    const delay = 28000 + Math.round(Math.random() * 24000);
    this.companionAmbientTimer = setTimeout(() => {
      this.maybeTriggerCompanionAmbientInteraction('timer');
      this.scheduleNextCompanionAmbientTick();
    }, delay);
  },

  startCompanionAmbientLoop() {
    this.stopCompanionAmbientLoop();
    this.maybeTriggerCompanionAmbientInteraction('resume');
    this.scheduleNextCompanionAmbientTick();
  },

  stopCompanionAmbientLoop() {
    if (this.companionAmbientTimer) {
      clearTimeout(this.companionAmbientTimer);
      this.companionAmbientTimer = null;
    }
  },

  maybeTriggerCompanionActionInteraction(actionKey = 'generic', options = {}) {
    if (this.data.companionInNest || this.data.isBreathingActive || this.data.isCompanionDragging || this.data.showCompanionBubble) {
      return;
    }

    const chanceMap = {
      switchPostType: 0.52,
      focusInput: 0.3,
      blurInput: 0.18,
      theme: 0.45,
      sceneIntensity: 0.2,
      volume: 0.2,
      generic: 0.16
    };

    const now = Date.now();
    const cooldown = Number(options.cooldown || 7000);
    if (now - (this.lastCompanionActionAt || 0) < cooldown) {
      return;
    }

    const chance = typeof options.chance === 'number'
      ? options.chance
      : (chanceMap[actionKey] || chanceMap.generic);
    if (Math.random() > chance) {
      return;
    }

    const text = pickRandom(COMPANION_ACTION_RANDOM_LINES[actionKey] || COMPANION_ACTION_RANDOM_LINES.generic);
    if (!text) {
      return;
    }

    this.lastCompanionActionAt = now;
    this.triggerCompanionMoment({
      state: 'happy',
      text,
      duration: 1100,
      restoreAfter: true
    });
  },

  syncAudioFromGlobal() {
    try {
      const app = getApp();
      const audioState = app.getAudioState
        ? app.getAudioState()
        : {
            isAudioPlaying: false,
            audioVolume: 0.5
          };

      const sceneAudioState = app.getSceneAudioState
        ? app.getSceneAudioState()
        : { sceneIntensity: Number(wx.getStorageSync('homeSceneIntensity') || 65) / 100 };

      this.setData({
        isAudioPlaying: !!audioState.isAudioPlaying,
        audioVolume: Math.round((Number(audioState.audioVolume) || 0.5) * 100),
        sceneIntensity: Math.round((Number(sceneAudioState.sceneIntensity) || 0.65) * 100)
      });
    } catch (e) {
      console.error('同步全局音频状态失败:', e);
    }
  },

  applyThemeState(themeState = {}) {
    const {
      theme = THEMES[0],
      activeThemeType = THEME_STYLE_TYPES.FEMALE
    } = themeState;

    const resolvedType = theme && typeof theme.id === 'number'
      ? getThemeTypeById(theme.id)
      : activeThemeType;

    this.setData({
      theme: theme,
      textPalette: resolveSemanticTextPalette(theme),
      activeThemeType: resolvedType,
      filteredThemes: getThemesByType(resolvedType),
      companionVisualType: resolvedType === THEME_STYLE_TYPES.MALE ? 'core' : 'cloud',
      paperDateLineBorderColor: theme.primaryColor,
      paperDateLineShadowColor: getColorWithAlpha(theme.primaryColor, 0.25),
      publishBtnBgColor: getColorWithAlpha(theme.primaryColor, 0.1),
      publishBtnTextColor: theme.primaryColor,
      companionSelectedShadow1: getColorWithAlpha(theme.primaryColor, 0.3),
      companionSelectedShadow2: getColorWithAlpha(theme.primaryColor, 0.6),
      companionSelectedShadow3: getColorWithAlpha(theme.primaryColor, 0.2),
      companionSelectedShadow1Pulse: getColorWithAlpha(theme.primaryColor, 0.4),
      companionSelectedShadow2Pulse: getColorWithAlpha(theme.primaryColor, 0.8),
      companionSelectedShadow3Pulse: getColorWithAlpha(theme.primaryColor, 0.25)
    });

    this.updateNavigationBarColor();
  },

  syncThemeFromGlobal() {
    try {
      const app = getApp();
      const themeState = app.getThemeState
        ? app.getThemeState()
        : {
            theme: app.globalData.theme || THEMES[0],
            activeThemeType: getThemeTypeById((app.globalData.theme || THEMES[0]).id)
          };

      this.applyThemeState(themeState);
    } catch (e) {
      console.error('同步全局主题失败:', e);
      this.applyThemeState({
        theme: THEMES[0],
        activeThemeType: THEME_STYLE_TYPES.FEMALE
      });
    }
  },

  updateNavigationBarColor() {
    const { theme } = this.data;
    if (theme && theme.bgColor) {
      const rgb = (() => {
        const value = String(theme.bgColor || '').trim();
        if (value.startsWith('#')) {
          const hex = value.slice(1);
          if (hex.length === 3) {
            return {
              r: parseInt(hex[0] + hex[0], 16),
              g: parseInt(hex[1] + hex[1], 16),
              b: parseInt(hex[2] + hex[2], 16)
            };
          }
          if (hex.length >= 6) {
            return {
              r: parseInt(hex.slice(0, 2), 16),
              g: parseInt(hex.slice(2, 4), 16),
              b: parseInt(hex.slice(4, 6), 16)
            };
          }
        }
        const rgbMatch = value.match(/rgba?\(([^)]+)\)/i);
        if (!rgbMatch) return null;
        const [r, g, b] = rgbMatch[1].split(',').map((item) => Number(item.trim()));
        if (![r, g, b].every(Number.isFinite)) return null;
        return { r, g, b };
      })();
      const isDarkBg = rgb
        ? ((0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255) < 0.52
        : false;

      wx.setNavigationBarColor({
        frontColor: isDarkBg ? '#ffffff' : '#000000',
        backgroundColor: theme.bgColor
      });
    }
  },
  // 切换页面
  switchPage(e) {
    const page = parseInt(e.currentTarget.dataset.page);
    this.setData({ currentPage: page });
    this.initMovableFab({ keepPosition: true });
    
    // 如果切换到「动态」页面，从 myDiaryList 中刷新广场数据，并应用点赞收藏状态
    if (page === 1) {
      const myDiaryList = this.data.myDiaryList || [];
      let squarePostList = myDiaryList.filter(item => !item.isPrivate);
      
      // 从本地存储读取最新的点赞和收藏状态并应用，同时格式化时间
      try {
        const likedPostIds = wx.getStorageSync('likedPostIds') || [];
        const collectedPostIds = wx.getStorageSync('collectedPostIds') || [];
        squarePostList = squarePostList.map(item => ({
          ...item,
          isLiked: likedPostIds.includes(item.id),
          isCollected: collectedPostIds.includes(item.id),
          time: this.formatTimeAgo(item.publishTime || item.writingTime)
        }));
      } catch (e) {
        console.error('应用交互状态失败:', e);
      }
      
      this.setData({ squarePostList });
    }
    
    // 如果切换到「我的」页面，加载数据
    if (page === 2) {
      this.loadProfileMyTopics();
      this.loadProfileLiked();
      this.loadProfileFavorites();
    }
  },
  
  // 下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新动态页');
    if (this.data.currentPage === 1) {
      this.refreshCloudPosts();
    } else {
      wx.stopPullDownRefresh();
    }
  },
  
  // 上拉加载更多
  onReachBottom() {
    console.log('上拉加载更多');
    if (this.data.currentPage === 1 && this.data.hasMoreCloudPosts && !this.data.isLoadingCloudPosts) {
      this.loadMoreCloudPosts();
    }
  },
  
  // 刷新云端数据
  refreshCloudPosts() {
    this.setData({
      cloudPage: 1,
      hasMoreCloudPosts: true,
      isLoadingCloudPosts: true
    });
    
    this.loadCloudPosts(true);
  },
  
  // 加载更多云端数据
  loadMoreCloudPosts() {
    if (this.data.isLoadingCloudPosts || !this.data.hasMoreCloudPosts) {
      return;
    }
    
    this.setData({
      isLoadingCloudPosts: true,
      cloudPage: this.data.cloudPage + 1
    });
    
    this.loadCloudPosts(false);
  },
  
  // 加载云端数据
  loadCloudPosts(isRefresh) {
    wx.cloud.callFunction({
      name: 'getPosts',
      data: {
        page: this.data.cloudPage,
        limit: this.data.cloudPageSize
      },
      success: (res) => {
        console.log('获取云端数据成功:', res.result);
        if (res.result && res.result.success) {
          const cloudPosts = res.result.posts || [];
          const hasMore = cloudPosts.length >= this.data.cloudPageSize;
          
          // 应用点赞和收藏状态
          try {
            const likedPostIds = wx.getStorageSync('likedPostIds') || [];
            const collectedPostIds = wx.getStorageSync('collectedPostIds') || [];
            
            const processedPosts = cloudPosts.map(post => ({
              ...post,
              id: post._id, // 统一ID字段
              isLiked: likedPostIds.includes(post._id),
              isCollected: collectedPostIds.includes(post._id),
              time: this.formatTimeAgo(post.createdAt || post.publishTime)
            }));
            
            let finalPosts = [];
            if (isRefresh) {
              finalPosts = processedPosts;
            } else {
              finalPosts = [...this.data.cloudPosts, ...processedPosts];
            }
            
            this.setData({
              cloudPosts: finalPosts,
              squarePostList: finalPosts, // 更新动态列表显示
              hasMoreCloudPosts: hasMore,
              isLoadingCloudPosts: false
            });
          } catch (e) {
            console.error('应用交互状态失败:', e);
            this.setData({
              isLoadingCloudPosts: false
            });
          }
        } else {
          console.error('获取云端数据失败:', res.result?.message);
          this.setData({
            isLoadingCloudPosts: false
          });
        }
        
        // 停止下拉刷新
        wx.stopPullDownRefresh();
      },
      fail: (err) => {
        console.error('调用云函数失败:', err);
        this.setData({
          isLoadingCloudPosts: false
        });
        wx.stopPullDownRefresh();
      }
    });
  },

  // 点赞功能
  onToggleLike(e) {
    const id = e.currentTarget.dataset.id;
    
    // 更新 myDiaryList
    const myDiaryList = this.data.myDiaryList.map((item) => {
      if (item.id === id) {
        const newIsLiked = !item.isLiked;
        const newLikeCount = newIsLiked ? (item.likeCount || 0) + 1 : Math.max(0, (item.likeCount || 0) - 1);
        return {
          ...item,
          isLiked: newIsLiked,
          likeCount: newLikeCount
        };
      }
      return item;
    });
    
    // 更新 squarePostList
    const squarePostList = this.data.squarePostList.map((item) => {
      if (item.id === id) {
        const newIsLiked = !item.isLiked;
        const newLikeCount = newIsLiked ? (item.likeCount || 0) + 1 : Math.max(0, (item.likeCount || 0) - 1);
        return {
          ...item,
          isLiked: newIsLiked,
          likeCount: newLikeCount
        };
      }
      return item;
    });
    
    this.setData({ myDiaryList, squarePostList });
    
    // 同步到全局数据
    const app = getApp();
    app.globalData.diaryList = myDiaryList;
    app.globalData.squarePostList = squarePostList;

    // 保存点赞状态到本地存储
    this.saveLikedPostsToStorage();
    
    // 刷新我的点赞列表
    this.loadProfileLiked();

    // 同步到云端（仅公开内容，后台异步执行，不影响本地显示）
    const post = myDiaryList.find(item => item.id === id) || squarePostList.find(item => item.id === id);
    if (post && !post.isPrivate) {
      setTimeout(() => {
        wx.cloud.callFunction({
          name: 'toggleLike',
          data: {
            userId: app.globalData.userInfo.nickname,
            postId: id,
            action: post.isLiked ? 'add' : 'remove',
            nickname: app.globalData.userInfo.nickname
          },
          success: (res) => {
            console.log('点赞同步到云端成功:', res);
          },
          fail: (err) => {
            console.error('点赞同步到云端失败:', err);
          }
        });
      }, 0);
    }
  },

  // 收藏功能
  onToggleCollect(e) {
    const id = e.currentTarget.dataset.id;
    
    // 更新 myDiaryList
    const myDiaryList = this.data.myDiaryList.map((item) => {
      if (item.id === id) {
        const newIsCollected = !item.isCollected;
        const newCollectCount = newIsCollected ? (item.collectCount || 0) + 1 : Math.max(0, (item.collectCount || 0) - 1);
        return {
          ...item,
          isCollected: newIsCollected,
          collectCount: newCollectCount
        };
      }
      return item;
    });
    
    // 更新 squarePostList
    const squarePostList = this.data.squarePostList.map((item) => {
      if (item.id === id) {
        const newIsCollected = !item.isCollected;
        const newCollectCount = newIsCollected ? (item.collectCount || 0) + 1 : Math.max(0, (item.collectCount || 0) - 1);
        return {
          ...item,
          isCollected: newIsCollected,
          collectCount: newCollectCount
        };
      }
      return item;
    });
    
    this.setData({ myDiaryList, squarePostList });
    
    // 同步到全局数据
    const app = getApp();
    app.globalData.diaryList = myDiaryList;
    app.globalData.squarePostList = squarePostList;

    // 保存收藏状态到本地存储
    this.saveCollectedPostsToStorage();
    
    // 刷新我的收藏列表
    this.loadProfileFavorites();

    // 同步到云端（仅公开内容，后台异步执行，不影响本地显示）
    const post = myDiaryList.find(item => item.id === id) || squarePostList.find(item => item.id === id);
    if (post && !post.isPrivate) {
      setTimeout(() => {
        wx.cloud.callFunction({
          name: 'toggleFavorite',
          data: {
            userId: app.globalData.userInfo.nickname,
            postId: id,
            action: post.isCollected ? 'add' : 'remove',
            nickname: app.globalData.userInfo.nickname
          },
          success: (res) => {
            console.log('收藏同步到云端成功:', res);
          },
          fail: (err) => {
            console.error('收藏同步到云端失败:', err);
          }
        });
      }, 0);
    }
  },

  // 保存点赞帖子到本地存储
  saveLikedPostsToStorage() {
    // 从所有帖子列表中收集已点赞的帖子ID
    const allPosts = [...this.data.myDiaryList, ...this.data.squarePostList];
    const likedPostSet = new Set();
    
    allPosts.forEach(item => {
      if (item.isLiked) {
        likedPostSet.add(item.id);
      }
    });
    
    wx.setStorageSync('likedPostIds', Array.from(likedPostSet));
  },

  // 保存收藏帖子到本地存储
  saveCollectedPostsToStorage() {
    // 从所有帖子列表中收集已收藏的帖子ID
    const allPosts = [...this.data.myDiaryList, ...this.data.squarePostList];
    const collectedPostSet = new Set();
    
    allPosts.forEach(item => {
      if (item.isCollected) {
        collectedPostSet.add(item.id);
      }
    });
    
    wx.setStorageSync('collectedPostIds', Array.from(collectedPostSet));
  },

  // 从本地存储加载完整数据
  loadDataFromStorage() {
    try {
      // 优先从本地存储加载 myDiaryList
      let myDiaryList = wx.getStorageSync('myDiaryList') || [];
      
      // 如果本地存储没有数据，才使用全局数据
      if (myDiaryList.length === 0) {
        const app = getApp();
        myDiaryList = app.globalData.diaryList || [];
      }
      
      // 从 myDiaryList 中筛选公开内容作为广场数据
      const squarePostList = myDiaryList.filter(item => !item.isPrivate);
      
      // 从本地存储读取点赞和收藏状态并应用
      const likedPostIds = wx.getStorageSync('likedPostIds') || [];
      const collectedPostIds = wx.getStorageSync('collectedPostIds') || [];
      
      // 应用点赞和收藏状态
      myDiaryList = myDiaryList.map(item => ({
        ...item,
        isLiked: likedPostIds.includes(item.id),
        isCollected: collectedPostIds.includes(item.id),
        time: this.formatTimeAgo(item.publishTime || item.writingTime)
      }));
      
      squarePostList = squarePostList.map(item => ({
        ...item,
        isLiked: likedPostIds.includes(item.id),
        isCollected: collectedPostIds.includes(item.id),
        time: this.formatTimeAgo(item.publishTime || item.writingTime)
      }));
      
      this.setData({ myDiaryList, squarePostList });
      
      // 同步到全局数据
      const app = getApp();
      app.globalData.diaryList = myDiaryList;
      app.globalData.squarePostList = squarePostList;
      
    } catch (e) {
      console.error('从本地存储加载数据失败:', e);
    }
  },

  // 从本地存储读取点赞和收藏状态并同步到所有列表
  loadInteractionsFromStorage() {
    try {
      const likedPostIds = wx.getStorageSync('likedPostIds') || [];
      const collectedPostIds = wx.getStorageSync('collectedPostIds') || [];
      
      // 同步所有帖子列表（myDiaryList 和 squarePostList）
      const myDiaryList = this.data.myDiaryList.map(item => ({
        ...item,
        isLiked: likedPostIds.includes(item.id),
        isCollected: collectedPostIds.includes(item.id)
      }));
      
      const squarePostList = this.data.squarePostList.map(item => ({
        ...item,
        isLiked: likedPostIds.includes(item.id),
        isCollected: collectedPostIds.includes(item.id)
      }));
      
      this.setData({ myDiaryList, squarePostList });
      
      // 同步到全局数据
      const app = getApp();
      app.globalData.diaryList = myDiaryList;
      app.globalData.squarePostList = squarePostList;
      
      // 同步我的收藏和点赞列表
      this.loadProfileLiked();
      this.loadProfileFavorites();
    } catch (e) {
      console.error('读取交互状态失败:', e);
    }
  },

  // 广场页面下拉刷新
  onSquareRefresh() {
    this.setData({ squareRefreshing: true });
    
    setTimeout(() => {
      // 从 myDiaryList 中刷新广场数据
      const myDiaryList = this.data.myDiaryList || [];
      let squarePostList = myDiaryList.filter(item => !item.isPrivate);
      
      // 从本地存储读取最新的点赞和收藏状态并应用
      try {
        const likedPostIds = wx.getStorageSync('likedPostIds') || [];
        const collectedPostIds = wx.getStorageSync('collectedPostIds') || [];
        squarePostList = squarePostList.map(item => ({
          ...item,
          time: this.formatTimeAgo(item.publishTime || item.writingTime),
          isLiked: likedPostIds.includes(item.id),
          isCollected: collectedPostIds.includes(item.id)
        }));
      } catch (e) {
        console.error('应用交互状态失败:', e);
      }
      
      this.setData({ 
        squarePostList,
        squareRefreshing: false 
      });
    }, 500);
  },

  // 模拟新内容提示
  simulateNewPosts() {
    this.setData({ newPostCount: 2 });
  },

  // 打开帖子详情页
  onOpenPostDetail(e) {
    const id = e.currentTarget.dataset.id;
    const tab = e.currentTarget.dataset.tab;
    
    let postList;
    if (tab === 'square') {
      postList = this.data.squarePostList;
    } else {
      postList = this.data.myDiaryList;
    }
    
    const post = postList.find(item => item.id === id);
    if (!post) return;
    
    try {
      const payload = encodeURIComponent(JSON.stringify(post));
      wx.navigateTo({
        url: `/pages/detail/index?payload=${payload}`
      });
    } catch (e) {
      console.error('跳转详情页失败:', e);
    }
  },



  clearBreathingLongPressTimer() {
    if (this.breathingLongPressTimer) {
      clearTimeout(this.breathingLongPressTimer);
      this.breathingLongPressTimer = null;
    }
  },

  clearBreathingPhaseTimer() {
    if (this.breathingPhaseTimer) {
      clearTimeout(this.breathingPhaseTimer);
      this.breathingPhaseTimer = null;
    }
  },

  getBreathingPhases() {
    return [
      { key: 'inhale', text: '吸气 4 秒', duration: 4000 },
      { key: 'hold', text: '屏息 7 秒', duration: 7000 },
      { key: 'exhale', text: '呼气 8 秒', duration: 8000 }
    ];
  },

  startBreathingGuide() {
    if (this.data.isBreathingActive) {
      return;
    }

    wx.vibrateShort();
    this.setData({
      isBreathingActive: true,
      showBreathingStartScreen: false,
      companionState: 'breathing',
      breathingCycleCount: 0,
      breathingDisplayRound: 1,
      breathingTimer: '00:00',
      phaseTimer: ''
    });

    this.showCompanionBubble('我陪你一起慢慢呼吸。', 1800);

    this.runBreathingPhase(0, 0);
    this.startBreathingTimer();
  },

  runBreathingPhase(phaseIndex = 0, cycleCount = 0) {
    const phases = this.getBreathingPhases();
    const phase = phases[phaseIndex];
    if (!phase || !this.data.isBreathingActive) {
      return;
    }

    this.setData({
      breathingPhase: phase.key,
      breathingGuideText: phase.text,
      breathingCycleCount: cycleCount,
      breathingDisplayRound: cycleCount + 1,
      phaseTimer: Math.floor(phase.duration / 1000).toString()
    });

    this.clearBreathingPhaseTimer();
    this.clearPhaseTimerInterval();
    
    // 启动阶段倒计时
    const phaseDuration = phase.duration;
    const startTime = Date.now();
    
    this.phaseTimerInterval = setInterval(() => {
      if (!this.data.isBreathingActive) {
        this.clearPhaseTimerInterval();
        return;
      }
      
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.floor((phaseDuration - elapsed) / 1000));
      
      this.setData({
        phaseTimer: remaining.toString()
      });
      
      if (remaining <= 0) {
        this.clearPhaseTimerInterval();
      }
    }, 1000);

    this.breathingPhaseTimer = setTimeout(() => {
      if (!this.data.isBreathingActive) {
        return;
      }

      const isLastPhase = phaseIndex === phases.length - 1;
      const nextCycleCount = isLastPhase ? cycleCount + 1 : cycleCount;

      if (isLastPhase && nextCycleCount >= 3) {
        this.stopBreathingGuide();
        return;
      }

      const nextPhaseIndex = isLastPhase ? 0 : phaseIndex + 1;
      
      // 添加过渡效果
      if (isLastPhase) {
        // 轮次切换过渡
        this.setData({
          breathingGuideText: `准备开始第${nextCycleCount + 1}轮`,
          phaseTimer: ''
        });
        
        setTimeout(() => {
          if (!this.data.isBreathingActive) {
            return;
          }
          this.runBreathingPhase(nextPhaseIndex, nextCycleCount);
        }, 3000); // 轮次切换过渡时间：3秒
      } else {
        // 呼吸阶段切换过渡
        this.setData({
          breathingGuideText: '准备切换呼吸',
          phaseTimer: ''
        });
        
        setTimeout(() => {
          if (!this.data.isBreathingActive) {
            return;
          }
          this.runBreathingPhase(nextPhaseIndex, nextCycleCount);
        }, 2000); // 阶段切换过渡时间：2秒
      }
    }, phase.duration);
  },

  startBreathingTimer() {
    this.breathingStartTime = Date.now();
    this.clearBreathingTimer();
    
    this.breathingTimerInterval = setInterval(() => {
      if (!this.data.isBreathingActive) {
        this.clearBreathingTimer();
        return;
      }
      
      const elapsed = Math.floor((Date.now() - this.breathingStartTime) / 1000);
      const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      
      this.setData({
        breathingTimer: `${minutes}:${seconds}`
      });
    }, 1000);
  },

  clearBreathingTimer() {
    if (this.breathingTimerInterval) {
      clearInterval(this.breathingTimerInterval);
      this.breathingTimerInterval = null;
    }
  },

  clearPhaseTimerInterval() {
    if (this.phaseTimerInterval) {
      clearInterval(this.phaseTimerInterval);
      this.phaseTimerInterval = null;
    }
  },

  stopBreathingGuide(options = {}) {
    const { silent = false } = options;
    const wasActive = this.data.isBreathingActive;

    this.clearBreathingLongPressTimer();
    this.clearBreathingPhaseTimer();
    this.clearBreathingTimer();
    this.clearPhaseTimerInterval();
    this.clearBreathingStartProgressInterval();

    this.setData({
      isBreathingActive: false,
      showBreathingStartScreen: false,
      breathingPhase: 'idle',
      breathingCycleCount: 0,
      breathingGuideText: '',
      breathingDisplayRound: 1,
      breathingTimer: '00:00',
      phaseTimer: '',
      breathingStartProgress: 0
    });

    this.restoreCompanionStateByInput();

    if (!silent && wasActive) {
      this.showToast({
        message: '呼吸引导已结束',
        icon: '✓',
        duration: 2000
      });
    }
  },

  toggleBreathingGuide() {
    if (this.data.isBreathingActive || this.data.showBreathingStartScreen) {
      this.stopBreathingGuide();
    } else {
      this.showBreathingStartScreen();
    }
  },

  showBreathingStartScreen() {
    this.setData({
      showBreathingStartScreen: true,
      breathingStartProgress: 0
    });
  },

  onTapBreathingIsland() {
    this.stopBreathingGuide();
  },

  onBreathingStartTouchStart() {
    this.breathingStartTouchStartTime = Date.now();
    this.breathingStartProgressInterval = setInterval(() => {
      const elapsed = Date.now() - this.breathingStartTouchStartTime;
      const progress = Math.min((elapsed / 2000) * 100, 100);
      
      this.setData({
        breathingStartProgress: progress
      });
      
      if (progress >= 100) {
        this.clearBreathingStartProgressInterval();
        this.startBreathingGuide();
      }
    }, 50);
  },

  onBreathingStartTouchEnd() {
    this.clearBreathingStartProgressInterval();
    this.setData({
      breathingStartProgress: 0,
      showBreathingStartScreen: false
    });
  },

  clearBreathingStartProgressInterval() {
    if (this.breathingStartProgressInterval) {
      clearInterval(this.breathingStartProgressInterval);
      this.breathingStartProgressInterval = null;
    }
  },

  // 发布页面相关方法
  // 取消发布
  cancelPost() {
    this.setData({ 
      postContent: '',
      currentPage: 0
    });
    this.restoreCompanionStateByInput();
  },

  onPostPrivateChange(e) {
    const isPrivate = !!(e && e.detail && e.detail.value);
    this.setData({ isPostPrivate: isPrivate });
  },

  onPackagePost() {
    if (!this.data.postContent.trim()) {
      this.showToast({
        message: '先写点内容再保存吧',
        icon: '⚠️',
        duration: 2000
      });
      return;
    }

    const visibility = this.data.isPostPrivate ? 'private' : 'public';
    this.publishPost({ visibility });
  },

  onPackageAction(e) {
    const action = e.currentTarget.dataset.action;
    if (!action) return;

    this.closeToolPanel();

    if (action === 'save') {
      this.publishPost({ visibility: 'private' });
    } else if (action === 'publish') {
      this.publishPost({ visibility: 'public' });
    }
  },

  // 发布内容
  publishPost(options = {}) {
    console.log('publishPost 被调用，options:', options);
    const { visibility = 'private' } = options;
    const {
      postContent,
      postTitle,
      postLocation,
      myDiaryList,
      squarePostList,
      activeScene,
      sceneIntensity,
      theme,
      activeThemeType,
      customBackground,
      writingAmbientSubtitle,
      editingPostId
    } = this.data;
    
    if (!postContent.trim()) {
      this.showToast({
        message: '请输入内容',
        icon: '⚠️',
        duration: 2000
      });
      return;
    }
    
    const now = new Date();
    
    // 格式化写作时间显示文本 (年-月-日 时:分)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const writingTimeText = `${year}年${month}月${day}日 ${hour}:${minute}`;
    
    // 发布时间（和写作时间一样，因为是第一次发布）
    const publishTimeText = writingTimeText;
    
    const app = getApp();
    let updatedDiaryList = [...myDiaryList];
    let updatedSquareList = [...squarePostList];
    let updatedGlobalDiaryList = app.globalData.diaryList || [];
    
    // 检查是否为编辑模式
    if (editingPostId) {
      console.log('编辑模式，更新现有条目:', editingPostId);
      
      // 检查用户是否抽取了盲盒（默认值表示未抽取）
      const DEFAULT_SUBTITLE = '慢慢写，不必着急。先把心放下来，再把话写出来。';
      let finalBlindBoxQuote = writingAmbientSubtitle;
      
      if (writingAmbientSubtitle === DEFAULT_SUBTITLE) {
        // 用户没有抽取盲盒，随机生成一个
        const quotes = [
          '每一个清晨都是新的开始，愿你今天充满阳光。',
          '生活不是等待暴风雨过去，而是学会在雨中跳舞。',
          '你不必完美，你已经足够好。',
          '今天的你，比昨天更勇敢。',
          '每一个小确幸，都是生活的礼物。',
          '相信自己，你比想象中更强大。',
          '慢慢来，一切都会好起来的。',
          '你值得被爱，值得拥有所有美好。'
        ];
        finalBlindBoxQuote = quotes[Math.floor(Math.random() * quotes.length)];
      }
      
      // 更新日记列表中的条目
      const updatedItem = this.createTypedPostItem({
        id: editingPostId,
        content: postContent.trim(),
        title: postTitle,
        location: postLocation,
        time: '刚刚',
        nickname: this.data.userInfo.nickname,
        writingTime: now.getTime(),
        writingTimeText: writingTimeText,
        publishTime: now.getTime(),
        publishTimeText: publishTimeText,
        isPrivate: visibility !== 'public',
        blindBoxQuote: finalBlindBoxQuote,
        customBackground,
        scenePackage: {
          ...this.buildScenePackageSnapshot(),
          sceneKey: activeScene,
          sceneIntensity,
          themeId: Number(theme && theme.id),
          activeThemeType
        }
      });
      
      // 更新本地日记列表
      updatedDiaryList = updatedDiaryList.map(item => 
        item.id === editingPostId ? updatedItem : item
      );
      
      // 更新全局日记列表
      updatedGlobalDiaryList = updatedGlobalDiaryList.map(item => 
        item.id === editingPostId ? updatedItem : item
      );
      
      // 如果从私密变为公开，添加到广场列表
      if (visibility === 'public') {
        // 检查广场列表中是否已有该条目
        const existsInSquare = updatedSquareList.some(item => item.id === editingPostId);
        if (!existsInSquare) {
          updatedSquareList = [updatedItem, ...updatedSquareList];
        } else {
          updatedSquareList = updatedSquareList.map(item => 
            item.id === editingPostId ? updatedItem : item
          );
        }
      } else {
        // 如果从公开变为私密，从广场列表中移除
        updatedSquareList = updatedSquareList.filter(item => item.id !== editingPostId);
      }
      
      console.log('更新完成，updatedItem:', updatedItem);
      console.log('更新后的日记列表长度:', updatedDiaryList.length);
      console.log('更新后的广场列表长度:', updatedSquareList.length);
      
    } else {
      console.log('新建模式，创建新条目');
      
      // 创建新条目
      // 检查用户是否抽取了盲盒（默认值表示未抽取）
    const DEFAULT_SUBTITLE = '慢慢写，不必着急。先把心放下来，再把话写出来。';
    let finalBlindBoxQuote = writingAmbientSubtitle;
    
    if (writingAmbientSubtitle === DEFAULT_SUBTITLE) {
      // 用户没有抽取盲盒，随机生成一个
      const quotes = [
        '每一个清晨都是新的开始，愿你今天充满阳光。',
        '生活不是等待暴风雨过去，而是学会在雨中跳舞。',
        '你不必完美，你已经足够好。',
        '今天的你，比昨天更勇敢。',
        '每一个小确幸，都是生活的礼物。',
        '相信自己，你比想象中更强大。',
        '慢慢来，一切都会好起来的。',
        '你值得被爱，值得拥有所有美好。'
      ];
      finalBlindBoxQuote = quotes[Math.floor(Math.random() * quotes.length)];
    }
    
    const newItem = this.createTypedPostItem({
      id: `my-${Date.now()}`,
      content: postContent.trim(),
      title: postTitle,
      location: postLocation,
      time: '刚刚',
      nickname: this.data.userInfo.nickname,
      writingTime: now.getTime(),
      writingTimeText: writingTimeText,
      publishTime: now.getTime(),
      publishTimeText: publishTimeText,
      isPrivate: visibility !== 'public',
      blindBoxQuote: finalBlindBoxQuote,
      customBackground,
      scenePackage: {
        ...this.buildScenePackageSnapshot(),
        sceneKey: activeScene,
        sceneIntensity,
        themeId: Number(theme && theme.id),
        activeThemeType
      }
    });
      
      updatedDiaryList = [newItem, ...updatedDiaryList];
      updatedGlobalDiaryList = [newItem, ...updatedGlobalDiaryList];
      
      if (visibility === 'public') {
        updatedSquareList = [newItem, ...updatedSquareList];
      }
      
      console.log('新建条目完成:', newItem);
      console.log('新建后的日记列表长度:', updatedDiaryList.length);
      console.log('新建后的广场列表长度:', updatedSquareList.length);
      
      // 保存newItem到作用域，以便回调函数访问
      this.setData({ tempNewItem: newItem });
    }
    
    // 保存到全局数据
    app.globalData.diaryList = updatedGlobalDiaryList;
    
    // 保存到本地存储
    try {
      wx.setStorageSync('myDiaryList', updatedGlobalDiaryList);
      console.log('保存到本地存储成功');
      
      // 清除自定义背景的本地存储
      wx.removeStorageSync('customBackground');
      console.log('清除自定义背景本地存储成功');
      
      // 立即验证是否保存成功
      const verifyData = wx.getStorageSync('myDiaryList');
      console.log('验证本地存储 - 读取到的数据:', verifyData);
      console.log('验证本地存储 - 数据条数:', verifyData ? verifyData.length : 0);
    } catch (e) {
      console.error('保存到本地存储失败:', e);
    }
    
    // 调用云函数上传到云端（后台异步执行，不影响本地显示）
    if (visibility === 'public') {
      const postData = {
        content: postContent.trim(),
        title: postTitle,
        location: postLocation,
        userId: app.globalData.userInfo.nickname,
        nickname: app.globalData.userInfo.nickname,
        isPrivate: false,
        scenePackage: {
          ...this.buildScenePackageSnapshot(),
          sceneKey: activeScene,
          sceneIntensity,
          themeId: Number(theme && theme.id),
          activeThemeType
        }
      };
      
      // 后台异步执行云端操作，不影响本地显示
      setTimeout(() => {
        if (editingPostId) {
          // 编辑模式：先检查云端是否存在该动态
          wx.cloud.callFunction({
            name: 'getPosts',
            data: {
              postId: editingPostId
            },
            success: (res) => {
              if (res.result.success && res.result.posts && res.result.posts.length > 0) {
                // 云端存在，调用updatePost
                wx.cloud.callFunction({
                  name: 'updatePost',
                  data: {
                    post: {
                      postId: editingPostId,
                      ...postData
                    }
                  },
                  success: (res) => {
                    console.log('云函数调用成功: updatePost', res.result);
                  },
                  fail: (err) => {
                    console.error('云函数调用失败: updatePost', err);
                  }
                });
              } else {
                // 云端不存在，调用createPost创建新动态
                wx.cloud.callFunction({
                  name: 'createPost',
                  data: {
                    post: postData
                  },
                  success: (res) => {
                    console.log('云函数调用成功: createPost', res.result);
                  },
                  fail: (err) => {
                    console.error('云函数调用失败: createPost', err);
                  }
                });
              }
            },
            fail: (err) => {
              console.error('检查云端动态失败:', err);
              // 检查失败时，尝试直接更新
              wx.cloud.callFunction({
                name: 'updatePost',
                data: {
                  post: {
                    postId: editingPostId,
                    ...postData
                  }
                },
                success: (res) => {
                  console.log('云函数调用成功: updatePost', res.result);
                },
                fail: (err) => {
                  console.error('云函数调用失败: updatePost', err);
                }
              });
            }
          });
        } else {
          // 新建模式，直接调用createPost
          wx.cloud.callFunction({
            name: 'createPost',
            data: {
              post: postData
            },
            success: (res) => {
              console.log('云函数调用成功: createPost', res.result);
            },
            fail: (err) => {
              console.error('云函数调用失败: createPost', err);
            }
          });
        }
      }, 0); // 立即在后台执行
    }
    
    // 公开发布时，直接准备好动态列表数据
    let finalSquareList = updatedSquareList;
    if (visibility === 'public') {
      // 从本地存储读取最新的点赞和收藏状态并应用，同时格式化时间
      try {
        const likedPostIds = wx.getStorageSync('likedPostIds') || [];
        const collectedPostIds = wx.getStorageSync('collectedPostIds') || [];
        finalSquareList = finalSquareList.map(item => ({
          ...item,
          isLiked: likedPostIds.includes(item.id),
          isCollected: collectedPostIds.includes(item.id),
          time: this.formatTimeAgo(item.publishTime || item.writingTime)
        }));
      } catch (e) {
        console.error('应用交互状态失败:', e);
      }
    }
    
    const nextData = {
      postContent: '',
      postTitle: '',
      postLocation: '',
      currentPage: visibility === 'public' ? 1 : 0, // 公开发布直接跳转到动态页
      isAmbientControlExpanded: false,
      showAudioPanel: false,
      isAnonymous: visibility !== 'public',
      customBackground: '',
      editingPostId: '', // 清除编辑状态
      myDiaryList: updatedDiaryList,
      squarePostList: finalSquareList
    };
    
    this.setData(nextData, () => {
      // 刷新我的发布列表
      console.log('刷新我的发布列表');
      this.loadProfileMyTopics();
    });
    this.restoreCompanionStateByInput();

    // 根据发布类型显示不同的提示
    if (visibility === 'public') {
      // 公开发布：显示成功提示
      this.showToast({
        message: editingPostId ? '更新成功' : '发布成功',
        icon: '✓',
        duration: 2000
      });
    } else {
      // 保存私密：显示弹窗
      this.setData({ showSaveSuccessDialog: true });
    }

    this.triggerCompanionMoment({
      state: 'happy',
      text: `${editingPostId ? '更新完成' : visibility === 'public' ? '发布完成。大家也能看见这份心情了。' : '保存完成。我会替你把它悄悄收好。'}`,
      duration: 1500
    });
  },

  // 处理输入事件
  onPostInput(e) {
    const postContent = e.detail.value;
    this.setData({ postContent });
    this.updateCompanionEmotionByInput(postContent);
    this.maybeUpdateAmbientSubtitleByInput(postContent);
  },

  onPostTitleInput(e) {
    const postTitle = e.detail.value;
    this.setData({ postTitle });
  },

  onPostLocationInput(e) {
    const postLocation = e.detail.value;
    this.setData({ postLocation });
  },

  maybeUpdateAmbientSubtitleByInput(content = '') {
    const text = String(content || '').trim();
    if (text.length < 8 || this.isBlindBoxAnimating) {
      return;
    }

    const now = Date.now();
    const cooldown = 6000;
    if (this.lastAmbientInputHintAt && now - this.lastAmbientInputHintAt < cooldown) {
      return;
    }

    const mood = resolveCompanionStateByText(text);
    const candidateList = WRITING_AMBIENT_INPUT_HINTS[mood] || WRITING_AMBIENT_INPUT_HINTS.idle;
    const nextHint = pickRandom(candidateList) || WRITING_AMBIENT_INPUT_HINTS.idle[0];
    if (!nextHint || nextHint === this.data.writingAmbientSubtitle) {
      return;
    }

    this.lastAmbientInputHintAt = now;
    if (this.ambientSubtitleAnimTimer) {
      clearTimeout(this.ambientSubtitleAnimTimer);
      this.ambientSubtitleAnimTimer = null;
    }

    this.setData({
      isAmbientSubtitleAnimating: true,
      writingAmbientSubtitle: nextHint
    });

    this.ambientSubtitleAnimTimer = setTimeout(() => {
      this.setData({ isAmbientSubtitleAnimating: false });
      this.ambientSubtitleAnimTimer = null;
    }, 520);
  },

  onPostFocus() {
    this.setData({ isWritingFocused: true });
    this.maybeTriggerCompanionActionInteraction('focusInput');
  },

  onPostBlur() {
    this.setData({ isWritingFocused: false });
    this.maybeTriggerCompanionActionInteraction('blurInput', { cooldown: 12000 });
  },





  updateCompanionEmotionByInput(content = '') {
    if (this.data.isBreathingActive) {
      return;
    }

    const nextState = resolveCompanionStateByText(content);
    if (nextState === this.data.companionState) {
      return;
    }

    this.setData({ companionState: nextState });

    if (nextState === 'sad') {
      this.showCompanionBubble('我在这儿，慢慢说。', 1800);
    } else if (nextState === 'happy') {
      this.showCompanionBubble('听起来是件好事呀 ✨', 1600);
    }
  },

  restoreCompanionStateByInput() {
    const nextState = resolveCompanionStateByText(this.data.postContent);
    this.setData({ companionState: nextState });
  },

  onCompanionTap() {
    if (this.data.companionInNest) {
      return;
    }
    if (this.shouldSuppressNextPublishTap) {
      this.shouldSuppressNextPublishTap = false;
      return;
    }

    if (this.isFabDragging) {
      return;
    }

    if (this.data.isBreathingActive) {
      return;
    }

    try {
      wx.vibrateShort && wx.vibrateShort({ type: 'light' });
    } catch (e) {
      // ignore
    }

    this.setData({
      companionIsShy: true,
      companionTapFeedback: true
    });
    this.showCompanionBubble('收到你的戳戳啦～我在这儿。', 1400);

    clearTimeout(this.companionTapFeedbackTimer);
    this.companionTapFeedbackTimer = setTimeout(() => {
      this.setData({ companionTapFeedback: false });
      this.companionTapFeedbackTimer = null;
    }, 220);

    setTimeout(() => {
      this.setData({ companionIsShy: false });
    }, 280);
  },

  onCompanionTouchStart(e) {
    if (this.data.companionInNest) {
      return;
    }
    this.clearCompanionLongPressTimer();
    this.clearCompanionDragSettleTimer();
    this.isFabDragging = false;
    this.prevFabDragPoint = null;
    this.shouldSuppressNextPublishTap = false;
    this.dragFeedbackShown = false;

    const touch = (e && e.touches && e.touches[0]) || null;
    this.companionTouchStartPoint = touch
      ? { x: Number(touch.pageX || 0), y: Number(touch.pageY || 0) }
      : null;

    this.setData({ isCompanionLongPressTriggered: false });
  },

  onCompanionTouchMove(e) {
    if (this.data.companionInNest) {
      return;
    }
    const touch = (e && e.touches && e.touches[0]) || null;
    if (!touch || !this.companionTouchStartPoint) {
      return;
    }
    const moveDistance = Math.hypot(
      touch.pageX - this.companionTouchStartPoint.x,
      touch.pageY - this.companionTouchStartPoint.y
    );
    if (moveDistance >= 3) {
      this.isFabDragging = true;
    }
  },

  onCompanionTouchEnd(e) {
    if (this.data.companionInNest) {
      return;
    }
    this.clearCompanionLongPressTimer();

    const touch = (e && e.changedTouches && e.changedTouches[0]) || null;
    const endPoint = touch
      ? { x: Number(touch.pageX || 0), y: Number(touch.pageY || 0) }
      : null;
    const startPoint = this.companionTouchStartPoint;
    const moveDistance = startPoint && endPoint
      ? Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y)
      : 0;
    const hasMoved = moveDistance >= 6;

    this.companionTouchStartPoint = null;

    if (this.isFabDragging || hasMoved) {
      const viewport = this.viewportInfo || {};
      const fabSize = Number(viewport.fabSize || 46);
      const releasePoint = endPoint
        ? { x: endPoint.x, y: endPoint.y }
        : {
            x: Number(this.data.fabX || 0) + fabSize / 2,
            y: Number(this.data.fabY || 0) + fabSize / 2
          };
      const shouldDockToNest = this.isPointInCompanionNest(releasePoint, { padding: 2 });

      if (shouldDockToNest) {
        this.dockCompanionToNest();
        this.shouldSuppressNextPublishTap = true;
        return;
      }
      try {
        wx.vibrateShort && wx.vibrateShort({ type: 'light' });
      } catch (e) {
        // ignore
      }

      this.showCompanionBubble('好啦，新位置记住了。', 900);
      this.shouldSuppressNextPublishTap = true;
      clearTimeout(this.clearSuppressedTapTimer);
      this.clearSuppressedTapTimer = setTimeout(() => {
        this.shouldSuppressNextPublishTap = false;
        this.clearSuppressedTapTimer = null;
      }, 320);

      this.isFabDragging = false;
      this.prevFabDragPoint = null;
      this.setData({ isCompanionLongPressTriggered: false });
      return;
    }

    
  },

  onCompanionTouchCancel() {
    if (this.data.companionInNest) {
      return;
    }
    this.clearCompanionLongPressTimer();
    this.companionTouchStartPoint = null;
    this.prevFabDragPoint = null;
    this.isFabDragging = false;
    this.stopBreathingGuide({ silent: true });
    this.setData({ isCompanionLongPressTriggered: false });
  },

  clearCompanionLongPressTimer() {
    if (this.companionLongPressTimer) {
      clearTimeout(this.companionLongPressTimer);
      this.companionLongPressTimer = null;
    }
  },

  showCompanionBubble(text = '', duration = 2000) {
    if (!text || this.data.companionInNest) return;
    this.updateCompanionBubbleLayout(this.data.fabX, this.data.fabY);
    this.clearCompanionBubbleTimer();
    this.setData({
      companionBubbleText: text,
      showCompanionBubble: true
    });

    this.companionBubbleTimer = setTimeout(() => {
      this.setData({ showCompanionBubble: false });
      this.companionBubbleTimer = null;
    }, duration);
  },

  clearCompanionBubbleTimer() {
    if (this.companionBubbleTimer) {
      clearTimeout(this.companionBubbleTimer);
      this.companionBubbleTimer = null;
    }
  },

  clearCompanionDragSettleTimer() {
    if (this.companionDragSettleTimer) {
      clearTimeout(this.companionDragSettleTimer);
      this.companionDragSettleTimer = null;
    }
  },

  startCompanionSelectedPulse() {
    this.stopCompanionSelectedPulse();
    this.companionSelectedPulseTimer = setInterval(() => {
      this.setData({
        isCompanionSelectedPulse: !this.data.isCompanionSelectedPulse
      });
    }, 600);
  },

  stopCompanionSelectedPulse() {
    if (this.companionSelectedPulseTimer) {
      clearInterval(this.companionSelectedPulseTimer);
      this.companionSelectedPulseTimer = null;
    }
    this.setData({
      isCompanionSelectedPulse: false
    });
  },

  onTapCompanion(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (this.data.companionInNest) {
      return;
    }
    
    // 如果正在移动，停止移动
    if (this.data.isCompanionMoving) {
      this.stopCompanionMove();
      this.setData({
        isCompanionSelected: true,
        isCompanionMoving: false
      });
      this.startCompanionSelectedPulse();
      return;
    }
    
    // 切换选中状态
    const newSelectedState = !this.data.isCompanionSelected;
    this.setData({
      isCompanionSelected: newSelectedState
    });
    
    if (newSelectedState) {
      this.startCompanionSelectedPulse();
    } else {
      this.stopCompanionSelectedPulse();
    }
  },

  onTapScreenForCompanionMove(e) {
    if (this.data.companionInNest || !this.data.isCompanionSelected) {
      return;
    }
    
    // 直接使用点击事件的坐标（相对于视口）
    const targetX = e.detail.x;
    const targetY = e.detail.y;
    
    this.moveCompanionTo(targetX, targetY);
  },

  moveCompanionTo(targetX, targetY) {
    // 检查目标位置是否在窝的区域内
    const centerPoint = {
      x: targetX,
      y: targetY
    };
    
    const isOverNest = this.isPointInCompanionNest(centerPoint, { padding: 20 });
    
    if (isOverNest) {
      this.dockCompanionToNest();
      return;
    }
    
    const startX = this.data.fabX;
    const startY = this.data.fabY;
    const distanceX = targetX - startX;
    const distanceY = targetY - startY;
    
    // 计算移动距离
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // 根据距离调整移动时间
    const baseDuration = 1000; // 基础时间（毫秒）
    const maxDuration = 2000; // 最大时间（毫秒）
    const minDuration = 500; // 最小时间（毫秒）
    
    // 距离越远，时间越长，但不超过最大时间
    const duration = Math.min(maxDuration, Math.max(minDuration, baseDuration + distance * 2));
    
    const steps = 60; // 动画步数
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    this.stopCompanionMove();
    this.setData({ isCompanionMoving: true });
    
    this.companionMoveTimer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      const easeProgress = this.easeOutQuad(progress);
      
      const currentX = startX + distanceX * easeProgress;
      const currentY = startY + distanceY * easeProgress;
      
      const clampedPoint = this.clampFabPosition(currentX, currentY);
      
      this.setData({
        fabX: clampedPoint.x,
        fabY: clampedPoint.y
      });
      
      this.updateCompanionBubbleLayout(clampedPoint.x, clampedPoint.y);
      
      if (currentStep >= steps) {
        this.stopCompanionMove();
        this.setData({
          isCompanionSelected: false,
          isCompanionMoving: false
        });
      }
    }, stepDuration);
  },

  stopCompanionMove() {
    if (this.companionMoveTimer) {
      clearInterval(this.companionMoveTimer);
      this.companionMoveTimer = null;
    }
  },

  easeOutQuad(t) {
    return t * (2 - t);
  },

  onFabDragChange(e) {
    // 拖动功能已移除，保留此函数以兼容旧代码
  },

  emitCompanionTrailParticle(x, y, speed = 0) {
    const now = Date.now();
    const maxSize = speed > 1 ? 14 : 10;
    const particle = {
      id: `trail-${now}-${Math.round(Math.random() * 9999)}`,
      x: x + 28,
      y: y + 28,
      size: maxSize,
      opacity: speed > 1 ? 0.6 : 0.42
    };

    const next = [particle, ...(this.data.companionTrailParticles || [])].slice(0, 10);
    this.setData({ companionTrailParticles: next });

    setTimeout(() => {
      this.setData({
        companionTrailParticles: (this.data.companionTrailParticles || []).filter((item) => item.id !== particle.id)
      });
    }, 320);
  },

  triggerCompanionMoment({
    state,
    text = '',
    duration = 1200,
    restoreAfter = true
  } = {}) {
    if (this.data.companionInNest) {
      return;
    }
    if (state && !this.data.isBreathingActive) {
      this.setData({ companionState: state });
    }

    if (text) {
      this.showCompanionBubble(text, duration);
    }

    if (restoreAfter && !this.data.isBreathingActive) {
      setTimeout(() => {
        if (!this.data.isBreathingActive) {
          this.restoreCompanionStateByInput();
        }
      }, duration + 120);
    }
  },

  // 粉碎内容
  async shatter() {
    if (this.data.isPostShattering) {
      return;
    }

    const { postContent } = this.data;
    
    if (!postContent.trim()) {
      this.showToast({
        message: '请输入内容',
        icon: '⚠️',
        duration: 2000
      });
      return;
    }
    
    const app = getApp();
    this.triggerShatterFeedback();
    this.setData({ isPostShattering: true });

    const animPromise = this.runShredForSelector('#homePostInputField', 220);

    await app.deleteContentItem({ id: 'draft-post', type: 'draft' });
    await animPromise;

    setTimeout(() => {
      this.setData({
        postContent: '',
        currentPage: 0,
        isPostShattering: false
      });
      this.restoreCompanionStateByInput();

      this.showToast({
        message: '已粉碎，不入流',
        icon: '✓',
        duration: 2000
      });
    }, 420);
  },

  triggerShatterFeedback() {
    wx.vibrateShort();
    const app = getApp();
    if (app.playShatterSfx) {
      app.playShatterSfx('/raining.mp3');
    }

    this.triggerCompanionMoment({
      state: 'happy',
      text: '呼——烦恼都被吹散啦。',
      duration: 1200
    });
  },

  async runShredForSelector(targetSelector, particleCount = 180) {
    await homeShredHelper.shred(this, {
      targetSelector,
      particleCount
    });
  },

  getListKeyByTab(tab) {
    const map = {
      writing: 'myDiaryList',
      recommend: 'squarePostList',
      my: 'myDiaryList',
      square: 'squarePostList'
    };
    return map[tab] || 'myDiaryList';
  },

  navigateToPostDetail(post = {}, sourceTab = 'square') {
    if (!post || !post.id) {
      return;
    }
    const payload = encodeURIComponent(JSON.stringify({
      ...post,
      sourceTab,
      isOwner: false
    }));
    wx.navigateTo({
      url: `/pages/detail/index?payload=${payload}`
    });
  },

  onOpenSquarePostDetail(e) {
    const { id, tab = 'square' } = e.currentTarget.dataset || {};
    if (!id) {
      return;
    }
    const listKey = this.getListKeyByTab(tab);
    const target = (this.data[listKey] || []).find((item) => item.id === id);
    if (!target) {
      return;
    }
    this.navigateToPostDetail(target, tab);
  },

  async onShatterCard(e) {
    const { id, tab } = e.currentTarget.dataset;
    if (!id || this.data.shatteringCardIds.includes(id)) {
      return;
    }

    const listKey = this.getListKeyByTab(tab);
    const app = getApp();

    this.triggerShatterFeedback();
    this.setData({
      shatteringCardIds: [...this.data.shatteringCardIds, id]
    });

    const animPromise = this.runShredForSelector(`#home-card-${id}`, 150);

    await app.deleteContentItem({ id, type: tab });
    await animPromise;

    setTimeout(() => {
      const nextList = (this.data[listKey] || []).filter((item) => item.id !== id);
      this.setData({
        [listKey]: nextList,
        shatteringCardIds: this.data.shatteringCardIds.filter((cardId) => cardId !== id)
      });

      this.showToast({
        message: '删除成功',
        icon: '✓',
        duration: 2000
      });
    }, 360);
  },

  async onSetPrivate(e) {
    const { id, tab } = e.currentTarget.dataset;
    if (!id) {
      return;
    }

    const app = getApp();

    // 从广场列表中移除该内容
    const nextSquareList = (this.data.squarePostList || []).filter((item) => item.id !== id);
    
    this.setData({
      squarePostList: nextSquareList
    });

    this.showToast({
      message: '已设置为私密',
      icon: '✓',
      duration: 2000
    });

    this.triggerCompanionMoment({
      state: 'happy',
      text: '已将内容设为本地私密。',
      duration: 1500
    });
  },

  onRestoreSceneFromPost(e) {
    const { id, tab } = e.currentTarget.dataset;
    if (!id) {
      return;
    }

    const listKey = this.getListKeyByTab(tab);
    const target = (this.data[listKey] || []).find((item) => item.id === id);

    if (!target || !target.scenePackage) {
      wx.showToast({
        title: '该内容暂无场景包',
        icon: 'none'
      });
      return;
    }

    const restored = this.restoreScenePackage(target.scenePackage, { persist: true });

    this.setData({
      currentPage: 0,
      isAmbientControlExpanded: false,
      showAudioPanel: false
    });

    const sceneMeta = IMMERSIVE_SCENE_META[restored.sceneKey] || IMMERSIVE_SCENE_META.rainy;
    clearTimeout(this.sceneRestoreHintTimer);
    this.setData({
      showSceneRestoreHint: true,
      sceneRestoreHintText: `已回到 ${sceneMeta.label} · 强度 ${restored.intensity}%`,
      sceneRestoreHintScene: restored.sceneKey
    });
    this.startSceneEntranceTransition(1200);
    this.sceneRestoreHintTimer = setTimeout(() => {
      this.setData({ showSceneRestoreHint: false });
    }, 1800);

    this.triggerCompanionMoment({
      state: 'happy',
      text: `已切回「${sceneMeta.label}」氛围。`,
      duration: 1500
    });
  },

  // 切换隐私设置
  togglePrivacy() {
    this.setData({ isAnonymous: !this.data.isAnonymous });
  },

  // 我的页面相关方法
  // 切换主题类型
  switchThemeType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      activeThemeType: type,
      filteredThemes: getThemesByType(type)
    });
  },

  // 选择主题
  selectTheme(e) {
    const theme = e.currentTarget.dataset.theme;
    const app = getApp();
    const themeState = app.switchTheme(theme.id);
    this.applyThemeState(themeState);
    this.syncAudioFromGlobal();
    this.maybeTriggerCompanionActionInteraction('theme');
  },

  toggleAudioPlay() {
    const app = getApp();
    const isAudioPlaying = app.toggleAudio();
    this.setData({ isAudioPlaying });

    if (isAudioPlaying) {
      this.openToolPanel('volume', { anchorId: 'toolEntryAudio' });
    }

    this.triggerCompanionMoment({
      state: isAudioPlaying ? 'happy' : 'idle',
      text: isAudioPlaying ? '我把白噪音开好了。' : '先安静一下也很好。',
      duration: 1400,
      restoreAfter: isAudioPlaying
    });
  },

  toggleAudioPanel() {
    this.setData({ showAudioPanel: !this.data.showAudioPanel });
  },

  toggleAmbientControlPanel() {
    const next = !this.data.isAmbientControlExpanded;
    this.setData({
      isAmbientControlExpanded: next,
      showAudioPanel: next ? this.data.showAudioPanel : false
    });
  },

  onRainModeChange(e) {
    const next = !!(e && e.detail && e.detail.value);
    this.setRainMode(next);
  },

  toggleRainMode() {
    this.setRainMode(!this.data.isRainModeEnabled);
  },

  setRainMode(enabled) {
    this.setData({
      isRainModeEnabled: enabled,
      rainDrops: enabled ? this.buildRainDrops() : []
    });

    try {
      wx.setStorageSync('homeRainModeEnabled', enabled);
    } catch (e) {
      console.error('保存雨天模式状态失败:', e);
    }

    wx.showToast({
      title: enabled ? '雨天模式已开启' : '雨天模式已关闭',
      icon: 'none'
    });

    this.triggerCompanionMoment({
      state: enabled ? 'happy' : 'idle',
      text: enabled ? '下雨啦，我会陪你一起听雨。' : '雨停啦，天色慢慢亮起来。',
      duration: 1600,
      restoreAfter: enabled
    });
  },

  onSceneIntensityChange(e) {
    const value = Number(e.detail.value);
    const safe = Number.isFinite(value) ? Math.max(20, Math.min(100, value)) : 65;
    const activeScene = this.data.activeScene || 'rainy';

    this.setData({
      sceneIntensity: safe,
      sceneParticles: this.buildSceneParticles(activeScene),
      rainDrops: activeScene === 'rainy' ? this.buildRainDrops() : []
    });
    this.updateOrnamentWindMotion(safe);
    this.maybeTriggerCompanionActionInteraction('sceneIntensity', { cooldown: 9000 });

    try {
      wx.setStorageSync('homeSceneIntensity', safe);
    } catch (e) {
      // ignore
    }

    try {
      const app = getApp();
      if (app.setSceneSoundscape) {
        app.setSceneSoundscape(activeScene, {
          intensity: safe / 100,
          autoPlay: true,
          enabled: true
        });
      } else if (app.setSceneIntensity) {
        app.setSceneIntensity(safe / 100, { persist: true });
      }
    } catch (e) {
      console.error('更新场景强度失败:', e);
    }
  },

  onAudioVolumeChange(e) {
    const value = Number(e.detail.value);
    const app = getApp();
    app.setAudioVolume(value / 100);
    this.setData({ audioVolume: value });
    this.maybeTriggerCompanionActionInteraction('volume', { cooldown: 9000 });
  },

  // 跳转到我的发布
  goToMyPosts() {
    wx.showToast({
      title: '我的发布',
      icon: 'none'
    });
  },

  // 跳转到我的收藏
  goToMyFavorites() {
    wx.showToast({
      title: '我的收藏',
      icon: 'none'
    });
  },

  // 跳转到解忧记录
  goToReliefRecords() {
    wx.showToast({
      title: '解忧记录',
      icon: 'none'
    });
  },

  // 打开解忧盲盒
  openBlindBox() {
    if (this.isBlindBoxAnimating) {
      return;
    }
    this.isBlindBoxAnimating = true;
    this.clearBlindBoxTimers();
    this.isBlindBoxAnimating = true;

    // 触发震动
    wx.vibrateShort();

    const quotes = [
      '每一个清晨都是新的开始，愿你今天充满阳光。',
      '生活不是等待暴风雨过去，而是学会在雨中跳舞。',
      '你不必完美，你已经足够好。',
      '今天的你，比昨天更勇敢。',
      '每一个小确幸，都是生活的礼物。',
      '相信自己，你比想象中更强大。',
      '慢慢来，一切都会好起来的。',
      '你值得被爱，值得拥有所有美好。',
      '时光会温柔对待每一个认真生活的人。',
      '你走过的每一步，都算数。',
      '保持热爱，奔赴山海。',
      '愿你眼中有光，心中有爱。',
      '生活明朗，万物可爱。',
      '今天的努力，明天的美好。',
      '不辜负每一个当下，不放弃每一个梦想。',
      '你比自己想象中更坚强。',
      '温暖的话语，治愈的力量。',
      '心存美好，所见皆美好。',
      '愿你被世界温柔以待。',
      '相信美好，美好就会发生。',
      '每一次坚持，都是成长。',
      '慢慢来，时光会给你答案。',
      '你值得拥有更好的一切。',
      '保持善良，心怀希望。',
      '生活需要仪式感，也需要温暖。',
      '愿你既有勇气，又有温柔。',
      '每一个平凡的日子，都值得珍惜。',
      '相信自己，未来可期。',
      '生活不只是眼前的苟且，还有诗和远方。',
      '愿你的每一天，都充满阳光和希望。',
      '你是独一无二的存在。',
      '保持初心，砥砺前行。',
      '愿你在困境中看到希望，在迷茫中找到方向。',
      '每一个努力的人，都值得被尊重。',
      '生活需要一点浪漫，也需要一点勇气。',
      '愿你成为自己想成为的样子。',
      '保持热爱，保持善良。',
      '每一个梦想，都值得追逐。',
      '愿你在平凡的日子里，发现不平凡的美好。',
      '相信自己，你能行。',
      '生活需要一点仪式感，也需要一点温暖。',
      '愿你既有能力，又有运气。',
      '每一个坚持，都是胜利。',
      '愿你在风雨中学会坚强，在阳光下学会感恩。',
      '相信美好，美好就会发生。',
      '生活需要一点勇气，也需要一点智慧。',
      '愿你成为更好的自己。',
      '保持初心，保持热爱。',
      '每一个平凡的人，都有不平凡的故事。',
      '愿你在生活中找到属于自己的光。'
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    // 先设置基础状态
    this.setData({
      showQuote: false,
      currentQuote: randomQuote,
      isAmbientSubtitleAnimating: false,
      activeToolPanel: 'blindbox'
    });

    this.triggerCompanionMoment({
      state: 'happy',
      text: '我来帮你拆开这份礼物。',
      duration: 1000,
      restoreAfter: false
    });

    // 触发抖动动画
    this.setData({
      blindBoxEntryShaking: true
    });
    this.blindBoxEntryShakeTimer = setTimeout(() => {
      this.setData({ blindBoxEntryShaking: false });
      this.blindBoxEntryShakeTimer = null;
      
      // 抖动动画结束后，执行翻转动画
      this.setData({ isFlipping: true });
      
      // 翻转后展示结果
      this.blindBoxRevealTimer = setTimeout(() => {
        this.setData({
          showQuote: true
        });

        this.triggerCompanionMoment({
          state: 'happy',
          text: '收下这句温柔吧 ✨',
          duration: 1600,
          restoreAfter: true
        });

        // 结果展示 1.5 秒后，收束到挂件下方副标题
        this.blindBoxOverlayTimer = setTimeout(() => {
          this.setData({
            isAmbientSubtitleAnimating: true,
            writingAmbientSubtitle: randomQuote
          });

          this.ambientSubtitleAnimTimer = setTimeout(() => {
            this.setData({
              isAmbientSubtitleAnimating: false,
              isFlipping: false
            });
            this.closeToolPanel();
            this.ambientSubtitleAnimTimer = null;
            this.isBlindBoxAnimating = false;
          }, 700);

          this.blindBoxOverlayTimer = null;
        }, 1500);

        this.blindBoxRevealTimer = null;
      }, 450);
    }, 800);
  },

  // ==================== 我的页面相关函数 ====================
  
  onProfileLoad() {
    this.loadProfileMyTopics();
    this.loadProfileLiked();
    this.loadProfileFavorites();
  },

  onProfileShow() {
    this.loadProfileMyTopics();
    this.loadProfileLiked();
    this.loadProfileFavorites();
  },

  onProfileSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ profileActiveTab: tab });
  },

  onProfileSwiperChange(e) {
    const currentIndex = e.detail.current;
    this.setData({
      profileActiveTab: currentIndex === 0 ? 'topics' : 'favorites'
    });
  },

  loadProfileMyTopics() {
    try {
      console.log('loadProfileMyTopics 被调用');
      const app = getApp();
      
      // 优先从本地存储读取，确保数据最新
      let myDiaryList = [];
      try {
        myDiaryList = wx.getStorageSync('myDiaryList') || [];
        console.log('从本地存储读取到:', myDiaryList.length, '条');
        // 同步到全局数据
        app.globalData.diaryList = myDiaryList;
        console.log('已同步到全局数据');
      } catch (e) {
        console.error('从本地存储读取失败:', e);
        // 本地存储读取失败，再从全局数据读取
        myDiaryList = app.globalData.diaryList || [];
        console.log('从全局数据获取 - diaryList:', myDiaryList.length, '条');
      }
      
      const myPostList = app.globalData.myPostList || [];
      console.log('从全局数据获取 - myPostList:', myPostList.length, '条');
      
      const merged = [...myDiaryList, ...myPostList].map(item => ({
        ...item,
        time: this.formatTimeAgo(item.publishTime || item.writingTime)
      }));
      const publicList = merged.filter(item => !item.isPrivate);
      const privateList = merged.filter(item => item.isPrivate);
      
      console.log('合并后的数据:', merged.length, '条');
      console.log('公开内容:', publicList.length, '条');
      console.log('本地私密:', privateList.length, '条');
      
      this.setData({ 
        profileMyTopicsList: merged,
        publicMyTopicsList: publicList,
        privateMyTopicsList: privateList,
        privateContentCount: privateList.length
      });
    } catch (e) {
      console.error('加载我的话题失败:', e);
    }
  },

  onOpenPrivatePosts() {
    wx.navigateTo({
      url: '/pages/private/index'
    });
  },

  onEditUserInfo() {
    wx.navigateTo({
      url: '/pages/profile-edit/index'
    });
  },

  onEditMyPost(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    
    // 从我的发布列表中找到要编辑的内容
    const target = this.data.publicMyTopicsList.find(item => item.id === id);
    if (!target) return;
    
    // 设置编辑内容到写点页面
    this.setData({
      currentPage: 0,
      postTitle: target.title || '',
      postContent: target.content || '',
      postLocation: target.location || '',
      activePostType: target.type || 'diary',
      isPostPrivate: target.isPrivate || false,
      editingPostId: id // 标记当前正在编辑的帖子ID
    });
    
    // 如果有场景包，还原场景
    if (target.scenePackage) {
      this.restoreScenePackage(target.scenePackage);
    }
  },

  onDeleteMyPost(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条内容吗？',
      success: (res) => {
        if (res.confirm) {
          this.deleteMyPost(id);
        }
      }
    });
  },

  updateLocalPostId(oldId, newId) {
    try {
      console.log('更新本地post ID:', oldId, '->', newId);
      
      const app = getApp();
      let myDiaryList = app.globalData.diaryList || [];
      let squarePostList = app.globalData.squarePostList || [];
      
      // 更新日记列表中的ID
      myDiaryList = myDiaryList.map(item => {
        if (item.id === oldId) {
          return { ...item, id: newId };
        }
        return item;
      });
      
      // 更新广场列表中的ID
      squarePostList = squarePostList.map(item => {
        if (item.id === oldId) {
          return { ...item, id: newId };
        }
        return item;
      });
      
      // 更新全局数据
      app.globalData.diaryList = myDiaryList;
      app.globalData.squarePostList = squarePostList;
      
      // 更新本地存储
      try {
        wx.setStorageSync('myDiaryList', myDiaryList);
        console.log('本地存储ID更新成功');
      } catch (e) {
        console.error('保存到本地存储失败:', e);
      }
      
      // 更新页面数据
      this.setData({
        myDiaryList,
        squarePostList
      });
      
      // 刷新我的发布列表
      this.loadProfileMyTopics();
      
      console.log('ID更新完成');
    } catch (e) {
      console.error('更新本地post ID失败:', e);
    }
  },
  
  deleteMyPost(id) {
    try {
      const app = getApp();
      const userId = app.globalData.userInfo?.nickname;
      
      console.log('开始删除，ID:', id);
      console.log('用户ID:', userId);
      
      if (!userId) {
        this.showToast({
        message: '用户未登录',
        icon: '⚠️',
        duration: 2000
      });
        return;
      }
      
      // 检查是否是本地日记（ID以"my-"开头）
      const isLocalDiary = id.startsWith('my-');
      console.log('是否本地日记:', isLocalDiary);
      
      let myDiaryList = app.globalData.diaryList || [];
      let squarePostList = app.globalData.squarePostList || [];
      
      myDiaryList = myDiaryList.filter(item => item.id !== id);
      squarePostList = squarePostList.filter(item => item.id !== id);
      
      app.globalData.diaryList = myDiaryList;
      app.globalData.squarePostList = squarePostList;
      
      // 保存到本地存储
      try {
        wx.setStorageSync('myDiaryList', myDiaryList);
      } catch (e) {
        console.error('保存到本地存储失败:', e);
      }
      
      // 只有非本地日记才调用云函数删除云端数据（后台异步执行，不影响本地显示）
      if (!isLocalDiary) {
        setTimeout(() => {
          console.log('调用云函数删除云端数据，ID:', id);
          wx.cloud.callFunction({
            name: 'deletePost',
            data: {
              postId: id,
              userId: userId
            },
            success: (res) => {
              console.log('云函数调用成功:', res);
              if (res.result && res.result.success) {
                console.log('云端删除成功:', res.result);
              } else {
                console.error('云端删除失败:', res.result?.message);
              }
            },
            fail: (err) => {
              console.error('调用云函数失败:', err);
            }
          });
        }, 0);
      } else {
        console.log('本地日记，不调用云函数');
      }
      
      this.setData({ 
        myDiaryList, 
        squarePostList 
      });
      
      this.loadProfileMyTopics();
      
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      });
    } catch (e) {
      console.error('删除失败:', e);
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      });
    }
  },

  loadProfileLiked() {
    try {
      const likedPostIds = wx.getStorageSync('likedPostIds') || [];
      const collectedPostIds = wx.getStorageSync('collectedPostIds') || [];
      const app = getApp();
      const squarePostList = app.globalData.squarePostList || [];
      
      const likedList = squarePostList
        .filter(item => likedPostIds.includes(item.id))
        .map(item => ({
          ...item,
          isLiked: true,
          isCollected: collectedPostIds.includes(item.id)
        }));
      
      this.setData({ profileLikedList: likedList });
    } catch (e) {
      console.error('加载点赞列表失败:', e);
    }
  },

  loadProfileFavorites() {
    try {
      const likedPostIds = wx.getStorageSync('likedPostIds') || [];
      const collectedPostIds = wx.getStorageSync('collectedPostIds') || [];
      const app = getApp();
      const squarePostList = app.globalData.squarePostList || [];
      
      const favoriteList = squarePostList
        .filter(item => collectedPostIds.includes(item.id))
        .map(item => ({
          ...item,
          time: this.formatTimeAgo(item.publishTime || item.writingTime),
          isCollected: true,
          isLiked: likedPostIds.includes(item.id)
        }))
        .sort((a, b) => {
          // 按收藏顺序倒序排列（最新的在顶部）
          const indexA = collectedPostIds.indexOf(a.id);
          const indexB = collectedPostIds.indexOf(b.id);
          return indexB - indexA;
        });
      
      this.setData({ profileFavoriteList: favoriteList });
    } catch (e) {
      console.error('加载收藏列表失败:', e);
    }
  },

  goToHomeWrite() {
    this.setData({ currentPage: 0 });
  },

  goToHomeSquare() {
    this.setData({ currentPage: 1 });
  },

  onProfileOpenPostDetail(e) {
    const { id, type = 'topic' } = e.currentTarget.dataset || {};
    if (!id) return;
    
    const target = this.data.profileMyTopicsList.find(item => item.id === id);
    if (!target) return;
    
    const payload = encodeURIComponent(JSON.stringify({
      ...target,
      sourceTab: type,
      isOwner: true
    }));
    
    wx.navigateTo({
      url: `/pages/detail/index?payload=${payload}`
    });
  },

  onProfileOpenSquarePostDetail(e) {
    const { id } = e.currentTarget.dataset;
    if (!id) return;
    
    const app = getApp();
    const squarePostList = app.globalData.squarePostList || [];
    const target = squarePostList.find(item => item.id === id);
    if (!target) return;
    
    const payload = encodeURIComponent(JSON.stringify({
      ...target,
      sourceTab: 'square',
      isOwner: false
    }));
    
    wx.navigateTo({
      url: `/pages/detail/index?payload=${payload}`
    });
  },

  onProfileNotificationTap() {
    wx.showToast({
      title: '暂无新通知',
      icon: 'none'
    });
  },

  onProfileTopicsRefresh() {
    this.setData({ profileTopicsRefreshing: true });
    
    setTimeout(() => {
      this.loadProfileMyTopics();
      this.setData({ profileTopicsRefreshing: false });
      this.showToast({
        message: '刷新成功',
        icon: '✓',
        duration: 2000
      });
    }, 1500);
  },

  onProfileLikesRefresh() {
    this.setData({ profileLikesRefreshing: true });
    
    setTimeout(() => {
      this.loadProfileLiked();
      this.setData({ profileLikesRefreshing: false });
      this.showToast({
        message: '刷新成功',
        icon: '✓',
        duration: 2000
      });
    }, 1500);
  },

  onProfileFavoritesRefresh() {
    this.setData({ profileFavoritesRefreshing: true });
    
    setTimeout(() => {
      this.loadProfileFavorites();
      this.setData({ profileFavoritesRefreshing: false });
      this.showToast({
        message: '刷新成功',
        icon: '✓',
        duration: 2000
      });
    }, 1500);
  }
});
