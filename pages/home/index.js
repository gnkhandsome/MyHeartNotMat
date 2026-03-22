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
  letter: {
    label: '写信',
    icon: '✉️',
    placeholder: '慢慢写一封信，寄给此刻最需要被安慰的你。',
    tagline: '把心事写成会被认真阅读的信'
  },
  postcard: {
    label: '明信片',
    icon: '🖼️',
    placeholder: '写下一帧风景与心情，像寄出一张明信片。',
    tagline: '一段风景，一句问候'
  },
  diary: {
    label: '日记',
    icon: '📔',
    placeholder: '记录今天的细节，允许情绪自然流动。',
    tagline: '把一天写进页角'
  },
  vlog: {
    label: 'Vlog',
    icon: '🎬',
    placeholder: '用镜头感描述今天，像在给生活做旁白。',
    tagline: '镜头语气，生活片段'
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
  },
  vlog: {
    cta: '发出片段',
    done: '片段已整理好'
  }
};

const POST_TYPES = Object.keys(POST_TYPE_META).map((key) => ({
  key,
  ...POST_TYPE_META[key]
}));

const DEFAULT_VLOG_SCRIPT_TEMPLATE = [
  '镜头1｜环境：3秒氛围空镜（天空/街道/窗边）',
  '镜头2｜主叙事：10秒记录当下动作与感受',
  '镜头3｜收束：5秒总结一句今天的话'
].join('\n');

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

const LOW_PERF_BENCHMARK_THRESHOLD = 20;

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

Page({
  data: {
    // 页面相关
    currentPage: 0, // 当前页面索引：0-首页，1-我的
    
    // 首页顶部 Tab 相关
    activeTab: 'writing',
    currentTab: 0, // 首页内部 tab：0-写作场景，1-推荐
    
    // 发布页面相关
    postContent: '',
    activePostType: 'letter',
    postTypes: POST_TYPES,
    postPlaceholder: POST_TYPE_META.letter.placeholder,
    packageActionLabel: POST_ACTION_META.letter.cta,
    letterSalutation: '亲爱的自己',
    letterSignature: '—— 今天也在慢慢变好的我',
    postcardLocation: '上海 · 黄昏街角',
    diaryWeather: '多云',
    diaryMoodScore: 7,
    vlogScriptTemplate: DEFAULT_VLOG_SCRIPT_TEMPLATE,
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
    hangingOrnamentOptions: HANGING_ORNAMENT_OPTIONS,
    hangingOrnamentLabel: HANGING_ORNAMENT_META.knot.label,
    hangingOrnamentSymbol: HANGING_ORNAMENT_META.knot.symbol,
    showToolPanel: false,
    activeToolPanel: '',
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
    companionState: 'idle',
    companionVisualType: 'cloud',
    companionBubbleText: '',
    showCompanionBubble: false,
    companionIsShy: false,
    isCompanionLongPressTriggered: false,
    fabX: 0,
    fabY: 0,
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
    
    // 主题相关
    theme: THEMES[0] // 默认使用第一个主题
  },

  onLoad() {
    this.shouldSuppressNextPublishTap = false;
    this.setData({
      myDiaryList: this.getInitialMyDiaryList(),
      squarePostList: this.getInitialSquarePostList()
    });
    this.initRainPerfProfile();
    this.initRainModeState();
    this.initScenePerfProfile();
    this.initImmersiveSceneState();
    this.initBreathingPerfProfile();
    this.initMovableFab();
    this.syncThemeFromGlobal();
    this.syncAudioFromGlobal();
    this.startSceneEntranceTransition();
    this.updateOrnamentWindMotion(this.data.sceneIntensity);
  },

  startSceneEntranceTransition(duration = 2400) {
    this.setData({ isSceneEntering: true });
    clearTimeout(this.sceneEnterTimer);
    this.sceneEnterTimer = setTimeout(() => {
      this.setData({ isSceneEntering: false });
    }, duration);
  },

  initMovableFab() {
    try {
      const info = wx.getSystemInfoSync ? wx.getSystemInfoSync() : {};
      const width = Number(info.windowWidth || 375);
      const height = Number(info.windowHeight || 667);

      const fabX = Math.max(0, Math.round(width / 2 - 28));
      const fabY = Math.max(0, Math.round(height - 156));

      this.setData({ fabX, fabY });
    } catch (e) {
      this.setData({ fabX: 160, fabY: 520 });
    }
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
      this.createTypedPostItem({ id: 'square-3', type: 'vlog', content: '今天天气很好，出去散步了，感觉心情舒畅了很多。', time: '1小时前', vlogScriptTemplate: '镜头1｜公园树影\n镜头2｜步伐与呼吸\n镜头3｜抬头看天收尾' }),
      this.createTypedPostItem({ id: 'square-4', type: 'letter', content: '今天和朋友一起吃饭，聊了很多，感觉很开心。', time: '2小时前', letterSalutation: '亲爱的你', letterSignature: '—— 今晚很满足的我' }),
      this.createTypedPostItem({ id: 'square-5', type: 'vlog', content: '工作上遇到了一些挑战，但是我相信自己可以克服。', time: '3小时前', vlogScriptTemplate: '镜头1｜工位与文件\n镜头2｜难点拆解过程\n镜头3｜完成后微笑' })
    ];
  },

  getPostTypeMeta(type = 'diary') {
    return POST_TYPE_META[type] || POST_TYPE_META.diary;
  },

  getPostActionMeta(type = 'letter') {
    return POST_ACTION_META[type] || POST_ACTION_META.letter;
  },

  buildVlogShots(template = '') {
    return String(template || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 4);
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
    vlogScriptTemplate = '',
    scenePackage = null
  } = {}) {
    const meta = this.getPostTypeMeta(type);
    const safeMood = Number(diaryMoodScore);
    const moodScore = Number.isFinite(safeMood) ? Math.max(1, Math.min(10, Math.round(safeMood))) : null;
    const safeScriptTemplate = (vlogScriptTemplate || DEFAULT_VLOG_SCRIPT_TEMPLATE).trim();

    return {
      id: id || `post-${Date.now()}`,
      type,
      typeLabel: meta.label,
      typeIcon: meta.icon,
      typeTagline: meta.tagline,
      vlogDuration: type === 'vlog' ? `0${Math.floor(Math.random() * 3) + 1}:${Math.floor(Math.random() * 50 + 10)}` : '',
      letterSalutation: type === 'letter' ? (letterSalutation || '亲爱的你') : '',
      letterSignature: type === 'letter' ? (letterSignature || '—— 今晚的你') : '',
      postcardLocation: type === 'postcard' ? (postcardLocation || '未署名地点') : '',
      diaryWeather: type === 'diary' ? (diaryWeather || '天气未记录') : '',
      diaryMoodScore: type === 'diary' ? moodScore : null,
      vlogScriptTemplate: type === 'vlog' ? safeScriptTemplate : '',
      vlogShots: type === 'vlog' ? this.buildVlogShots(safeScriptTemplate) : [],
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
  },

  getHangingOrnamentMeta(key = 'knot') {
    return HANGING_ORNAMENT_META[key] || HANGING_ORNAMENT_META.knot;
  },

  openToolPanel(panel = '') {
    this.setData({
      showToolPanel: true,
      activeToolPanel: panel
    });
  },

  closeToolPanel() {
    this.setData({
      showToolPanel: false,
      activeToolPanel: ''
    });
  },

  onTapToolPanelBody() {},

  onTapToolTheme() {
    this.openToolPanel('theme');
  },

  onTapToolAmbience() {
    this.openToolPanel('ambience');
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
    this.openToolPanel('ornament');
  },

  onChooseHangingOrnament(e) {
    const key = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.key;
    if (!HANGING_ORNAMENT_META[key]) {
      return;
    }
    const meta = this.getHangingOrnamentMeta(key);
    this.setData({
      selectedHangingOrnament: key,
      hangingOrnamentLabel: meta.label,
      hangingOrnamentSymbol: meta.symbol,
      showToolPanel: false,
      activeToolPanel: ''
    });
    this.triggerCompanionMoment({
      state: 'happy',
      text: `挂上了${meta.label}，风也变温柔了。`,
      duration: 1400
    });
  },

  onTapToolBlindBox() {
    this.openToolPanel('blindbox');
  },

  onOpenBlindBoxFromPanel() {
    this.closeToolPanel();
    this.openBlindBox();
  },

  onShow() {
    this.syncThemeFromGlobal();
    this.syncAudioFromGlobal();
    if (this.data.isSceneAutoMode) {
      this.applyImmersiveScene(this.resolveAutoSceneByTime(), {
        persist: true,
        silent: true,
        updateAutoMode: true
      });
    }
    this.maybeTriggerCompanionWhisper();
  },

  onHide() {
    this.stopBreathingGuide({ silent: true });
    this.clearCompanionBubbleTimer();
    this.clearCompanionLongPressTimer();
    this.clearCompanionDragSettleTimer();
    this.isFabDragging = false;
    this.prevFabDragPoint = null;
    this.persistCompanionLastActiveAt();
    clearTimeout(this.sceneEnterTimer);
    clearTimeout(this.sceneRestoreHintTimer);
  },

  onUnload() {
    this.stopBreathingGuide({ silent: true });
    this.clearCompanionBubbleTimer();
    this.clearCompanionLongPressTimer();
    this.clearCompanionDragSettleTimer();
    this.isFabDragging = false;
    this.prevFabDragPoint = null;
    this.persistCompanionLastActiveAt();
    clearTimeout(this.sceneEnterTimer);
    clearTimeout(this.sceneRestoreHintTimer);
  },

  persistCompanionLastActiveAt() {
    try {
      wx.setStorageSync('homeCompanionLastActiveAt', Date.now());
    } catch (e) {
      // ignore
    }
  },

  maybeTriggerCompanionWhisper() {
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
      theme,
      activeThemeType: resolvedType,
      filteredThemes: getThemesByType(resolvedType),
      companionVisualType: resolvedType === THEME_STYLE_TYPES.MALE ? 'core' : 'cloud'
    });
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

  // 切换顶部 Tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    const tabMap = {
      writing: 0,
      recommend: 1
    };

    if (typeof tabMap[tab] !== 'number') {
      return;
    }
    
    this.setData({
      activeTab: tab,
      currentTab: tabMap[tab],
      isAmbientControlExpanded: false,
      showAudioPanel: false
    });
  },

  // 处理首页顶部 swiper 滑动事件
  onSwiperChange(e) {
    const current = e.detail.current;
    const tabMap = ['writing', 'recommend'];
    
    this.setData({
      currentTab: current,
      activeTab: tabMap[current],
      isAmbientControlExpanded: false,
      showAudioPanel: false
    });
  },

  // 处理页面滑动事件
  onPageChange(e) {
    const current = e.detail.current;
    this.setData({ currentPage: current });
  },

  // 切换页面
  switchPage(e) {
    const page = parseInt(e.currentTarget.dataset.page);
    this.setData({ currentPage: page });
  },

  onPublishTap() {
    if (this.shouldSuppressNextPublishTap) {
      this.shouldSuppressNextPublishTap = false;
      return;
    }

    if (this.data.isBreathingActive || this.data.isBreathingLongPressTriggered) {
      return;
    }
    this.setData({
      currentPage: 0,
      activeTab: 'writing',
      currentTab: 0,
      isAmbientControlExpanded: false,
      showAudioPanel: false
    });
  },

  onPublishTouchStart() {
    this.clearBreathingLongPressTimer();
    this.shouldSuppressNextPublishTap = false;
    this.isFabDragging = false;
    this.prevFabDragPoint = null;
    this.setData({ isBreathingLongPressTriggered: false });

    this.breathingLongPressTimer = setTimeout(() => {
      this.shouldSuppressNextPublishTap = true;
      this.setData({ isBreathingLongPressTriggered: true });
      this.startBreathingGuide();
    }, 380);
  },

  onPublishTouchEnd() {
    this.clearBreathingLongPressTimer();

    if (this.isFabDragging) {
      this.shouldSuppressNextPublishTap = true;
      this.isFabDragging = false;
      this.setData({ isBreathingLongPressTriggered: false });
      return;
    }

    if (this.data.isBreathingLongPressTriggered) {
      this.shouldSuppressNextPublishTap = true;
      this.stopBreathingGuide();
      setTimeout(() => {
        this.setData({ isBreathingLongPressTriggered: false });
      }, 50);
      return;
    }
    this.setData({ isBreathingLongPressTriggered: false });
  },

  onPublishTouchCancel() {
    this.clearBreathingLongPressTimer();
    this.isFabDragging = false;
    this.shouldSuppressNextPublishTap = true;
    this.stopBreathingGuide({ silent: true });
    this.setData({ isBreathingLongPressTriggered: false });
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
      breathingGuideText: '',
      breathingCycleCount: 0,
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
      activeTab: 'writing',
      currentTab: 0,
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
  },

  onPostFocus() {
    this.setData({ isWritingFocused: true });
  },

  onPostBlur() {
    this.setData({ isWritingFocused: false });
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

  onVlogScriptTemplateInput(e) {
    this.setData({ vlogScriptTemplate: e.detail.value });
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
    if (this.data.isBreathingActive) {
      return;
    }

    this.setData({ companionIsShy: true });
    this.showCompanionBubble('嘿～我一直在你身边。', 1400);

    setTimeout(() => {
      this.setData({ companionIsShy: false });
    }, 280);
  },

  onCompanionTouchStart() {
    this.clearCompanionLongPressTimer();
    this.isFabDragging = false;
    this.prevFabDragPoint = null;
    this.setData({ isCompanionLongPressTriggered: false });

    this.companionLongPressTimer = setTimeout(() => {
      this.setData({ isCompanionLongPressTriggered: true });
      this.startBreathingGuide();
    }, 420);
  },

  onCompanionTouchEnd() {
    this.clearCompanionLongPressTimer();

    if (this.isFabDragging) {
      this.shouldSuppressNextPublishTap = true;
      this.isFabDragging = false;
      this.setData({ isCompanionLongPressTriggered: false });
      return;
    }

    if (this.data.isCompanionLongPressTriggered) {
      this.stopBreathingGuide({ silent: true });
      setTimeout(() => {
        this.setData({ isCompanionLongPressTriggered: false });
      }, 50);
    }
  },

  onCompanionTouchCancel() {
    this.clearCompanionLongPressTimer();
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
    if (!text) return;
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

  onFabDragChange(e) {
    const detail = e.detail || {};
    const { x = this.data.fabX, y = this.data.fabY, source = '' } = detail;

    if (source !== 'touch') {
      this.setData({ fabX: x, fabY: y });
      return;
    }

    this.isFabDragging = true;
    this.shouldSuppressNextPublishTap = true;
    this.clearBreathingLongPressTimer();
    this.clearCompanionLongPressTimer();

    if (this.data.isBreathingActive) {
      this.stopBreathingGuide({ silent: true });
    }

    if (this.data.isBreathingLongPressTriggered) {
      this.setData({ isBreathingLongPressTriggered: false });
    }

    if (this.data.isCompanionLongPressTriggered) {
      this.setData({ isCompanionLongPressTriggered: false });
    }

    const now = Date.now();
    const prev = this.prevFabDragPoint || { x, y, t: now };
    const dt = Math.max(16, now - prev.t);
    const dx = x - prev.x;
    const dy = y - prev.y;
    const speed = Math.sqrt(dx * dx + dy * dy) / dt;

    let companionDragLevel = 1;
    if (speed > 1.2) {
      companionDragLevel = 3;
    } else if (speed > 0.7) {
      companionDragLevel = 2;
    }

    this.prevFabDragPoint = { x, y, t: now };

    this.setData({
      fabX: x,
      fabY: y,
      companionDragLevel
    });

    this.emitCompanionTrailParticle(x, y, speed);

    this.clearCompanionDragSettleTimer();
    this.companionDragSettleTimer = setTimeout(() => {
      this.setData({ companionDragLevel: 0 });
      this.companionDragSettleTimer = null;
    }, 120);
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
      activeTab: 'writing',
      currentTab: 0,
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
    // 触发震动
    wx.vibrateShort();
    
    // 开始翻转动画
    this.setData({ isFlipping: true });
    this.triggerCompanionMoment({
      state: 'happy',
      text: '我来帮你拆开这份礼物。',
      duration: 1000,
      restoreAfter: false
    });
    
    // 1秒后显示文案
    setTimeout(() => {
      // 随机生成治愈文案
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
      
      this.setData({
        showQuote: true,
        currentQuote: randomQuote
      });

      this.triggerCompanionMoment({
        state: 'happy',
        text: '收下这句温柔吧 ✨',
        duration: 1600,
        restoreAfter: true
      });
    }, 600);
  }
});
