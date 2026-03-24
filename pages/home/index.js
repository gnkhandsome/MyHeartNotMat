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
    placeholder: '记录今天的心情与细节',
    tagline: '把一天写进页角'
  },
  letter: {
    label: '写信',
    icon: '✉️',
    placeholder: '写一封信给自己',
    tagline: '把心事写成一封信'
  },
  postcard: {
    label: '明信片',
    icon: '�️',
    placeholder: '记录此刻的风景与心情',
    tagline: '一段风景，一句问候'
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

function resolveSemanticTextPalette(theme = {}) {
  const parseColorToRgb = (color = '') => {
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
  };

  const isDarkColor = (color = '') => {
    const rgb = parseColorToRgb(color);
    if (!rgb) return false;
    const { r, g, b } = rgb;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.52;
  };

  const darkBg = isDarkColor(theme.bgColor);
  const darkPrimary = isDarkColor(theme.primaryColor);
  const body = theme.bodyTextColor || theme.textColor || (darkBg ? '#E5E7EB' : '#334155');
  return {
    title: theme.titleTextColor || theme.textColor || (darkBg ? '#F8FAFC' : '#1F2937'),
    body,
    subtitle: theme.subtitleTextColor || (darkBg ? '#CBD5E1' : '#64748B'),
    tertiary: theme.tertiaryTextColor || (darkBg ? '#94A3B8' : '#94A3B8'),
    inverse: theme.inverseTextColor || (darkPrimary ? '#FFFFFF' : '#0F172A')
  };
}

function pickRandom(list = []) {
  if (!Array.isArray(list) || !list.length) return '';
  return list[Math.floor(Math.random() * list.length)] || '';
}

Page({
  data: {
    // 页面相关
    currentPage: 0, // 当前页面索引：0-心语，1-广场，2-我的
    
    // 发布页面相关
    postContent: '',
    activePostType: 'diary',
    postTypes: POST_TYPES,
    postPlaceholder: POST_TYPE_META.diary.placeholder,
    packageActionLabel: POST_ACTION_META.diary.cta,
    letterSalutation: '亲爱的自己',
    letterSignature: '—— 今天也在慢慢变好的我',
    postcardLocation: '上海 · 黄昏街角',
    diaryWeather: '多云',
    diaryMoodScore: 7,
    writingDateText: '',
    isAnonymous: true,
    
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
    activeScene: 'rainy',
    sceneLabel: IMMERSIVE_SCENE_META.rainy.label,
    sceneOptions: IMMERSIVE_SCENES,
    sceneParticles: [],
    sceneDescription: IMMERSIVE_SCENE_META.rainy.desc,
    sceneSoundLabel: IMMERSIVE_SCENE_META.rainy.soundLabel,
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
    writingLightEnabled: true,
    writingLightColorMode: 'warm',
    writingLightFromSide: 'right',
    writingLightIntensity: 72,
    writingLightAngle: 26,
    writingLightFocus: 64,
    writingLightBeamStyle: '',
    writingLightGlowStyle: '',
    writingLightShadowStyle: '',
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
    
    // 主题相关
    theme: THEMES[0], // 默认使用第一个主题
    textPalette: resolveSemanticTextPalette(THEMES[0]),
    
    // 小精灵拖动状态
    isCompanionDragging: false,
    // 小精灵选中状态
    isCompanionSelected: false,
    // 小精灵移动状态
    isCompanionMoving: false,
    // 移动动画定时器
    companionMoveTimer: null
  },

  onLoad() {
    this.setData({
      myDiaryList: this.getInitialMyDiaryList(),
      squarePostList: this.getInitialSquarePostList()
    });
    this.initRainPerfProfile();
    this.initRainModeState();
    this.initScenePerfProfile();
    this.initImmersiveSceneState();
    this.restoreToolbarSettingsFromStorage();
    this.initBreathingPerfProfile();
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

  getCurrentWritingDateText() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year} 年 ${month} 月 ${day} 日`;
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
      writingLightFromSide,
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

      if (stored.writingLightFromSide === 'left' || stored.writingLightFromSide === 'right') {
        nextData.writingLightFromSide = stored.writingLightFromSide;
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
    const baseCount = isLowPerf ? 10 : 20;
    const count = Math.max(6, Math.round(baseCount * (0.62 + intensityFactor * 0.88)));
    const kindMap = {
      sunny: 'sun',
      cloudy: 'cloud',
      rainy: 'rain',
      windy: 'wind',
      snowy: 'snow',
      stream: 'leaf'
    };
    const kind = kindMap[sceneKey] || 'rain';

    return Array.from({ length: count }, (_, idx) => ({
      id: `scene-${sceneKey}-${idx}`,
      kind,
      left: Math.round(Math.random() * 100),
      top: Math.round(Math.random() * 100),
      size: Math.round((isLowPerf ? 10 : 12) + Math.random() * (isLowPerf ? 10 : 16)),
      opacity: Number((0.2 + Math.random() * 0.5).toFixed(2)),
      duration: Math.round((isLowPerf ? 5400 : 4200) + Math.random() * 2200),
      delay: Math.round(Math.random() * 1800),
      driftX: Math.round((Math.random() - 0.5) * 60),
      driftY: Math.round(40 + Math.random() * 80)
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
    const baseCount = isLowPerf ? 10 : 20;
    const count = Math.max(6, Math.round(baseCount * (0.58 + intensityFactor * 0.9)));
    return Array.from({ length: count }, (_, idx) => ({
      id: `rain-${idx}`,
      left: Math.round(Math.random() * 100),
      height: Math.round((isLowPerf ? 18 : 22) + Math.random() * (isLowPerf ? 14 : 22)),
      duration: Math.round((isLowPerf ? 1400 : 1150) + Math.random() * 900),
      delay: Math.round(Math.random() * 1600),
      opacity: Number((isLowPerf ? 0.2 : 0.28) + Math.random() * 0.24).toFixed(2)
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
    return [
      this.createTypedPostItem({
        id: 'my-1',
        type: 'letter',
        content: '亲爱的自己：今天也许不完美，但你已经很努力了。',
        time: '今天',
        letterSalutation: '亲爱的自己',
        letterSignature: '—— 来自今天的你'
      }),
      this.createTypedPostItem({
        id: 'my-2',
        type: 'diary',
        content: '记录我的心情变化，留下美好回忆。',
        time: '昨天',
        diaryWeather: '阴天',
        diaryMoodScore: 7
      }),
      this.createTypedPostItem({
        id: 'my-3',
        type: 'postcard',
        content: '窗外晚霞很温柔，想把这份平静寄给你。',
        time: '3天前',
        postcardLocation: '南京 · 玄武湖'
      })
    ];
  },

  getInitialSquarePostList() {
    return [
      this.createTypedPostItem({ id: 'square-1', type: 'diary', content: '今天心情有点低落，希望明天会更好。', time: '10分钟前', diaryWeather: '小雨', diaryMoodScore: 4 }),
      this.createTypedPostItem({ id: 'square-2', type: 'postcard', content: '分享一首喜欢的歌，希望大家都能感受到快乐。', time: '30分钟前', postcardLocation: '成都 · 春熙路' }),
      this.createTypedPostItem({ id: 'square-4', type: 'letter', content: '今天和朋友一起吃饭，聊了很多，感觉很开心。', time: '2小时前', letterSalutation: '亲爱的你', letterSignature: '—— 今晚很满足的我' })
    ];
  },

  getPostTypeMeta(type = 'diary') {
    return POST_TYPE_META[type] || POST_TYPE_META.diary;
  },

  getPostActionMeta(type = 'letter') {
    return POST_ACTION_META[type] || POST_ACTION_META.letter;
  },



  createTypedPostItem({
    id,
    type = 'diary',
    content = '',
    time = '刚刚',
    letterSalutation = '',
    letterSignature = '',
    postcardLocation = '',
    diaryWeather = '',
    diaryMoodScore,
    scenePackage = null
  } = {}) {
    const meta = this.getPostTypeMeta(type);
    const safeMood = Number(diaryMoodScore);
    const moodScore = Number.isFinite(safeMood) ? Math.max(1, Math.min(10, Math.round(safeMood))) : null;

    return {
      id: id || `post-${Date.now()}`,
      type,
      typeLabel: meta.label,
      typeIcon: meta.icon,
      typeTagline: meta.tagline,
      letterSalutation: type === 'letter' ? (letterSalutation || '亲爱的你') : '',
      letterSignature: type === 'letter' ? (letterSignature || '—— 今晚的你') : '',
      postcardLocation: type === 'postcard' ? (postcardLocation || '未署名地点') : '',
      diaryWeather: type === 'diary' ? (diaryWeather || '天气未记录') : '',
      diaryMoodScore: type === 'diary' ? moodScore : null,
      scenePackage,
      content,
      time
    };
  },

  buildScenePackageSnapshot() {
    const {
      activeScene,
      sceneIntensity,
      theme,
      activeThemeType
    } = this.data;

    const safeIntensity = Math.max(20, Math.min(100, Number(sceneIntensity) || 65));

    return {
      sceneKey: activeScene || 'rainy',
      sceneIntensity: safeIntensity,
      themeId: Number(theme && theme.id),
      activeThemeType,
      capturedAt: Date.now()
    };
  },

  restoreScenePackage(scenePackage = {}) {
    const sceneKey = IMMERSIVE_SCENE_META[scenePackage.sceneKey] ? scenePackage.sceneKey : 'rainy';
    const intensity = Math.max(20, Math.min(100, Number(scenePackage.sceneIntensity) || 65));
    const themeId = Number(scenePackage.themeId);

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

    this.setData({ sceneIntensity: intensity });

    this.applyImmersiveScene(sceneKey, {
      persist: true,
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
      wx.setStorageSync('homeSceneIntensity', intensity);
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
      light: 470
    };
    return Math.round((heightRpxMap[panel] || 300) * rpxRatio);
  },

  updateMiniToolTopByAnchor(anchorId = '', panel = '') {
    return new Promise((resolve) => {
      if (!anchorId || !this.createSelectorQuery) {
        resolve();
        return;
      }
      const query = this.createSelectorQuery();
      query.select('.writing-workspace').boundingClientRect();
      query.select(`#${anchorId}`).boundingClientRect();
      query.exec((res) => {
        if (!res || res.length < 2 || !res[0] || !res[1]) {
          console.log('弹窗定位查询失败:', res);
          resolve();
          return;
        }
        const workspaceRect = res[0];
        const anchorRect = res[1];
        console.log('弹窗定位信息:', {
          anchorId,
          workspaceTop: workspaceRect.top,
          anchorTop: anchorRect.top,
          relativeTop: anchorRect.top - workspaceRect.top
        });
        const panelHeightPx = this.getPanelEstimatedHeightPx(panel);
        let viewportHeight = Number((this.viewportInfo && this.viewportInfo.height) || 0);
        if (!viewportHeight) {
          try {
            const info = wx.getSystemInfoSync ? wx.getSystemInfoSync() : {};
            viewportHeight = Number(info.windowHeight || 667);
          } catch (e) {
            viewportHeight = 667;
          }
        }
        const rpxRatio = this.getRpxToPxRatio();
        const bottomReserve = Math.round((104 + 20 + 40) * rpxRatio);
        const minTop = 8;
        const maxTop = Math.max(minTop, viewportHeight - panelHeightPx - bottomReserve - workspaceRect.top);
        const anchorTopRelativeToWorkspace = Math.round(anchorRect.top - workspaceRect.top);
        const nextTop = Math.max(minTop, Math.min(maxTop, anchorTopRelativeToWorkspace));
        console.log('弹窗最终位置:', { nextTop, minTop, maxTop });
        this.setData({ miniToolTopPx: nextTop }, resolve);
      });
    });
  },

  openToolPanel(panel = '', options = {}) {
    const { anchorId = '' } = options || {};
    const isSameMiniPanel = this.data.activeToolPanel === panel && !this.data.showToolPanel;
    if (isSameMiniPanel) {
      this.setData({
        showToolPanel: false,
        activeToolPanel: ''
      });
      return;
    }
    this.setData({ activeToolPanel: '' }, () => {
      this.updateMiniToolTopByAnchor(anchorId, panel).then(() => {
        this.setData({
          showToolPanel: false,
          activeToolPanel: panel
        });
      });
    });
  },

  closeToolPanel() {
    this.resetOrnamentDrag();
    this.setData({
      showToolPanel: false,
      activeToolPanel: ''
    });
  },

  onTapToolPanelBody() {},

  onTapToolTheme() {
    this.openToolPanel('theme', { anchorId: 'toolEntryTheme' });
  },

  onTapToolAmbience() {
    this.openToolPanel('scene');
  },

  onTapToolScene() {
    this.openToolPanel('scene', { anchorId: 'toolEntryScene' });
  },

  onTapToolVolume() {
    this.openToolPanel('volume', { anchorId: 'toolEntryVolume' });
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
      writingLightFromSide,
      writingLightIntensity,
      writingLightAngle,
      writingLightFocus
    } = this.data;

    if (!writingLightEnabled) {
      this.setData({
        writingLightBeamStyle: '',
        writingLightGlowStyle: '',
        writingLightShadowStyle: ''
      });
      return;
    }

    const palette = this.getWritingLightPalette(writingLightColorMode);
    const intensityRatio = Math.max(0, Math.min(1, Number(writingLightIntensity || 0) / 100));
    const focusRatio = Math.max(0.2, Math.min(1, Number(writingLightFocus || 0) / 100));
    const direction = writingLightFromSide === 'right' ? -1 : 1;
    const safeAngle = Math.max(0, Math.min(65, Number(writingLightAngle) || 20));
    const rotateDeg = direction * safeAngle;

    const beamOpacity = (0.16 + intensityRatio * 0.42).toFixed(3);
    const edgeOpacity = (0.02 + intensityRatio * 0.14).toFixed(3);
    const beamWidth = Math.round(34 + (1 - focusRatio) * 58);
    const beamBlur = Math.round(8 + (1 - focusRatio) * 18);
    const beamX = writingLightFromSide === 'right' ? 'right: -16vw;' : 'left: -16vw;';

    const glowOpacity = (0.2 + intensityRatio * 0.4).toFixed(3);
    const glowSize = Math.round(180 + intensityRatio * 180);
    const glowX = writingLightFromSide === 'right' ? 'right: -6vw;' : 'left: -6vw;';

    const shadowOpacity = (0.14 + intensityRatio * 0.3).toFixed(3);
    const lightExit = writingLightFromSide === 'right' ? '20% 0%' : '80% 0%';

    const writingLightBeamStyle = [
      beamX,
      `width: ${beamWidth}vw;`,
      `opacity: ${beamOpacity};`,
      `filter: blur(${beamBlur}rpx);`,
      `transform: rotate(${rotateDeg}deg);`,
      `background: linear-gradient(to bottom, rgba(${palette.beamCore}, ${beamOpacity}), rgba(${palette.beamEdge}, ${edgeOpacity}));`
    ].join(' ');

    const writingLightGlowStyle = [
      glowX,
      `width: ${glowSize}rpx;`,
      `height: ${glowSize}rpx;`,
      `opacity: ${glowOpacity};`,
      `background: radial-gradient(circle, rgba(${palette.glow}, ${glowOpacity}), rgba(${palette.glow}, 0));`
    ].join(' ');

    const writingLightShadowStyle = '';

    this.setData({
      writingLightBeamStyle,
      writingLightGlowStyle,
      writingLightShadowStyle
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

  onSwitchWritingLightSide(e) {
    const side = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.side;
    if (side !== 'left' && side !== 'right') return;
    this.setData({ writingLightFromSide: side }, () => {
      this.updateWritingLightFxStyles();
      this.persistToolbarSettings({ writingLightFromSide: side });
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
    wx.showToast({ title: '已存草稿', icon: 'success' });
    this.triggerCompanionMoment({
      state: 'happy',
      text: '草稿收好啦，随时继续写。',
      duration: 1200
    });
  },

  onConfirmPackageStart() {
    if (!String(this.data.postContent || '').trim()) {
      wx.showToast({ title: '先写一点内容再封装', icon: 'none' });
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
    if (this.blindBoxEntryShakeTimer) {
      clearTimeout(this.blindBoxEntryShakeTimer);
      this.blindBoxEntryShakeTimer = null;
    }

    this.setData({
      blindBoxEntryShaking: true,
      isFlipping: false,
      showQuote: false
    });
    this.blindBoxEntryShakeTimer = setTimeout(() => {
      this.setData({ blindBoxEntryShaking: false });
      this.blindBoxEntryShakeTimer = null;
    }, 520);

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
    this.restoreToolbarSettingsFromStorage();
    this.updateAmbientTimeSlot();
    this.startAmbientTimeSlotLoop();
    if (this.data.isSceneAutoMode) {
      this.applyImmersiveScene(this.resolveAutoSceneByTime(), {
        persist: true,
        silent: true,
        updateAutoMode: true
      });
    }
    this.initMovableFab({ keepPosition: true });
    this.updateCompanionNestBounds();
    this.maybeTriggerCompanionWhisper();
    this.startCompanionAmbientLoop();
  },

  onHide() {
    this.stopBreathingGuide({ silent: true });
    this.clearCompanionBubbleTimer();
    this.clearCompanionLongPressTimer();
    this.clearCompanionDragSettleTimer();
    clearTimeout(this.companionTapFeedbackTimer);
    this.companionTapFeedbackTimer = null;
    clearTimeout(this.clearSuppressedTapTimer);
    this.clearSuppressedTapTimer = null;
    this.shouldSuppressNextPublishTap = false;
    this.companionTouchStartPoint = null;
    this.clearBlindBoxTimers();
    this.stopCompanionAmbientLoop();
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
  },

  onUnload() {
    this.stopBreathingGuide({ silent: true });
    this.clearCompanionBubbleTimer();
    this.clearCompanionLongPressTimer();
    this.clearCompanionDragSettleTimer();
    clearTimeout(this.companionTapFeedbackTimer);
    this.companionTapFeedbackTimer = null;
    clearTimeout(this.clearSuppressedTapTimer);
    this.clearSuppressedTapTimer = null;
    this.shouldSuppressNextPublishTap = false;
    this.companionTouchStartPoint = null;
    this.clearBlindBoxTimers();
    this.stopCompanionAmbientLoop();
    clearTimeout(this.packageAnimationTimer);
    this.packageAnimationTimer = null;
    this.persistCompanionLastActiveAt();
    clearTimeout(this.sceneEnterTimer);
    clearTimeout(this.sceneRestoreHintTimer);
    this.stopAmbientTimeSlotLoop();

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
      companionVisualType: resolvedType === THEME_STYLE_TYPES.MALE ? 'core' : 'cloud'
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



  // 处理页面滑动事件
  onPageChange(e) {
    const current = e.detail.current;
    this.setData({ currentPage: current });
    this.initMovableFab({ keepPosition: true });
  },

  // 切换页面
  switchPage(e) {
    const page = parseInt(e.currentTarget.dataset.page);
    this.setData({ currentPage: page });
    this.initMovableFab({ keepPosition: true });
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
      companionState: 'breathing',
      breathingCycleCount: 0,
      breathingDisplayRound: 1
    });

    this.showCompanionBubble('我陪你一起慢慢呼吸。', 1800);

    this.runBreathingPhase(0, 0);
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
      breathingDisplayRound: cycleCount + 1
    });

    this.clearBreathingPhaseTimer();
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
      this.runBreathingPhase(nextPhaseIndex, nextCycleCount);
    }, phase.duration);
  },

  stopBreathingGuide(options = {}) {
    const { silent = false } = options;
    const wasActive = this.data.isBreathingActive;

    this.clearBreathingLongPressTimer();
    this.clearBreathingPhaseTimer();

    this.setData({
      isBreathingActive: false,
      breathingPhase: 'idle',
      breathingCycleCount: 0,
      breathingGuideText: '',
      breathingDisplayRound: 1
    });

    this.restoreCompanionStateByInput();

    if (!silent && wasActive) {
      wx.showToast({
        title: '呼吸引导已结束',
        icon: 'none'
      });
    }
  },

  toggleBreathingGuide() {
    if (this.data.isBreathingActive) {
      this.stopBreathingGuide();
    } else {
      this.startBreathingGuide();
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

  onPackagePost() {
    if (!this.data.postContent.trim()) {
      wx.showToast({
        title: '先写点内容再封装吧',
        icon: 'none'
      });
      return;
    }

    wx.showActionSheet({
      itemList: ['仅自己可见（本地私密）', '发布到广场（公开）'],
      success: (res) => {
        const visibility = res.tapIndex === 1 ? 'public' : 'private';
        this.publishPost({ visibility });
      }
    });
  },

  // 发布内容
  publishPost(options = {}) {
    const { visibility = 'private' } = options;
    const {
      postContent,
      activePostType,
      myDiaryList,
      squarePostList,
      letterSalutation,
      letterSignature,
      postcardLocation,
      diaryWeather,
      diaryMoodScore,
      vlogScriptTemplate,
      activeScene,
      sceneIntensity,
      theme,
      activeThemeType
    } = this.data;
    
    if (!postContent.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }
    
    const newItem = this.createTypedPostItem({
      id: `my-${Date.now()}`,
      type: activePostType,
      content: postContent.trim(),
      time: '刚刚',
      letterSalutation,
      letterSignature,
      postcardLocation,
      diaryWeather,
      diaryMoodScore,
      vlogScriptTemplate,
      scenePackage: {
        ...this.buildScenePackageSnapshot(),
        sceneKey: activeScene,
        sceneIntensity,
        themeId: Number(theme && theme.id),
        activeThemeType
      }
    });

    const nextData = {
      postContent: '',
      currentPage: 0,
      isAmbientControlExpanded: false,
      showAudioPanel: false,
      isAnonymous: visibility !== 'public',
      myDiaryList: [newItem, ...myDiaryList]
    };

    if (visibility === 'public') {
      nextData.squarePostList = [newItem, ...squarePostList];
    }

    const actionMeta = this.getPostActionMeta(activePostType);
    const visibilityText = visibility === 'public' ? '并已公开到推荐' : '仅自己可见';

    wx.showToast({
      title: `${actionMeta.done}，${visibilityText}`,
      icon: 'none'
    });
    
    this.setData(nextData);
    this.restoreCompanionStateByInput();

    this.triggerCompanionMoment({
      state: 'happy',
      text: `${actionMeta.done}。${visibility === 'public' ? '大家也能看见这份心情了。' : '我会替你把它悄悄收好。'}`,
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

  onLetterSalutationInput(e) {
    this.setData({ letterSalutation: e.detail.value });
  },

  onLetterSignatureInput(e) {
    this.setData({ letterSignature: e.detail.value });
  },

  onPostcardLocationInput(e) {
    this.setData({ postcardLocation: e.detail.value });
  },

  onDiaryWeatherInput(e) {
    this.setData({ diaryWeather: e.detail.value });
  },

  onDiaryMoodScoreChange(e) {
    const value = Number(e.detail.value);
    this.setData({ diaryMoodScore: Number.isFinite(value) ? value : 5 });
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
      return;
    }
    
    // 切换选中状态
    this.setData({
      isCompanionSelected: !this.data.isCompanionSelected
    });
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
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
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

      wx.showToast({
        title: '已粉碎，不入流',
        icon: 'success'
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

      wx.showToast({
        title: '已粉碎删除',
        icon: 'success'
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

    wx.showToast({
      title: '已设置为私密',
      icon: 'success'
    });

    this.triggerCompanionMoment({
      state: 'happy',
      text: '已将内容设为私密，仅自己可见。',
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

    const restored = this.restoreScenePackage(target.scenePackage);

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
      '你值得被爱，值得拥有所有美好。'
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    // 在入口侧弹窗内完成开盒动画
    this.setData({
      isFlipping: true,
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

    // 先播放开盒，再展示结果（仍停留在入口弹窗内）
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
  }
});
