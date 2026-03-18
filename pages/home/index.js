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
    currentPage: 0, // 当前页面索引：0-首页，1-发布，2-我的
    
    // 首页顶部 Tab 相关
    activeTab: 'my',
    currentTab: 0, // swiper 当前索引
    
    // 发布页面相关
    postContent: '',
    isAnonymous: true,
    showLocation: false,
    
    // 我的页面相关
    userInfo: {
      nickname: '匿名用户',
      mood: '今天心情不错'
    },
    activeThemeType: THEME_STYLE_TYPES.FEMALE,
    themeStyleTypes: THEME_STYLE_TYPES,
    themes: THEMES,
    filteredThemes: getThemesByType(THEME_STYLE_TYPES.FEMALE),
    moodData: [],
    isFlipping: false,
    showQuote: false,
    currentQuote: '',
    myDiaryList: [],
    squarePostList: [],
    latestPostList: [],
    shatteringCardIds: [],
    isPostShattering: false,
    isShredCanvasVisible: false,
    isAudioPlaying: false,
    audioVolume: 50,
    showAudioPanel: false,
    isRainModeEnabled: false,
    rainDrops: [],
    rainPerfLevel: 'normal',
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
    
    // 主题相关
    theme: THEMES[0] // 默认使用第一个主题
  },

  onLoad() {
    this.shouldSuppressNextPublishTap = false;
    const moodData = this.generateMoodData();
    this.setData({
      moodData,
      myDiaryList: this.getInitialMyDiaryList(),
      squarePostList: this.getInitialSquarePostList(),
      latestPostList: this.getInitialLatestPostList()
    });
    this.initRainPerfProfile();
    this.initRainModeState();
    this.initBreathingPerfProfile();
    this.initMovableFab();
    this.syncThemeFromGlobal();
    this.syncAudioFromGlobal();
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
      const benchmarkLevel = Number(info.benchmarkLevel || 0);
      const rainPerfLevel = benchmarkLevel > 0 && benchmarkLevel <= 20 ? 'low' : 'normal';
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

  buildRainDrops() {
    const isLowPerf = this.data.rainPerfLevel === 'low';
    const count = isLowPerf ? 10 : 20;
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
      const benchmarkLevel = Number(info.benchmarkLevel || 0);
      const breathingPerfLevel = benchmarkLevel > 0 && benchmarkLevel <= 20 ? 'low' : 'normal';
      this.setData({ breathingPerfLevel });
    } catch (e) {
      this.setData({ breathingPerfLevel: 'normal' });
    }
  },

  getInitialMyDiaryList() {
    return [
      { id: 'my-1', content: '欢迎来到我的小屋！这里是我心灵的港湾。', time: '今天' },
      { id: 'my-2', content: '记录我的心情变化，留下美好回忆。', time: '昨天' },
      { id: 'my-3', content: '在这里，我可以自由表达自己的想法和感受。', time: '3天前' }
    ];
  },

  getInitialSquarePostList() {
    return [
      { id: 'square-1', content: '今天心情有点低落，希望明天会更好。', time: '10分钟前' },
      { id: 'square-2', content: '分享一首喜欢的歌，希望大家都能感受到快乐。', time: '30分钟前' },
      { id: 'square-3', content: '今天天气很好，出去散步了，感觉心情舒畅了很多。', time: '1小时前' },
      { id: 'square-4', content: '今天和朋友一起吃饭，聊了很多，感觉很开心。', time: '2小时前' },
      { id: 'square-5', content: '工作上遇到了一些挑战，但是我相信自己可以克服。', time: '3小时前' }
    ];
  },

  getInitialLatestPostList() {
    return [
      { id: 'latest-1', content: '刚发布的内容，新鲜出炉！', time: '1分钟前' },
      { id: 'latest-2', content: '今天的心情不错，分享一下！', time: '5分钟前' },
      { id: 'latest-3', content: '最近压力有点大，希望能找到缓解的方法。', time: '15分钟前' },
      { id: 'latest-4', content: '推荐一部好看的电影，大家可以去看看。', time: '25分钟前' },
      { id: 'latest-5', content: '今天学到了一个新技能，很开心！', time: '35分钟前' }
    ];
  },

  onShow() {
    this.syncThemeFromGlobal();
    this.syncAudioFromGlobal();
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
  },

  onUnload() {
    this.stopBreathingGuide({ silent: true });
    this.clearCompanionBubbleTimer();
    this.clearCompanionLongPressTimer();
    this.clearCompanionDragSettleTimer();
    this.isFabDragging = false;
    this.prevFabDragPoint = null;
    this.persistCompanionLastActiveAt();
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

      this.setData({
        isAudioPlaying: !!audioState.isAudioPlaying,
        audioVolume: Math.round((Number(audioState.audioVolume) || 0.5) * 100)
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

  // 生成情绪调色盘数据
  generateMoodData() {
    const moodData = [];
    const today = new Date();
    
    // 生成过去30天的数据
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // 随机生成情绪颜色
      const colors = ['#A3B18A', '#E5989B', '#BDB2FF', '#CB997E', '#84DCC6', '#FFB4A2', '#212529', '#003566'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      moodData.push({
        date: date.getDate(),
        color: randomColor
      });
    }
    
    return moodData;
  },

  // 切换顶部 Tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    const tabMap = {
      'my': 0,
      'square': 1,
      'latest': 2
    };
    
    this.setData({ 
      activeTab: tab,
      currentTab: tabMap[tab]
    });
  },

  // 处理首页顶部 swiper 滑动事件
  onSwiperChange(e) {
    const current = e.detail.current;
    const tabMap = ['my', 'square', 'latest'];
    
    this.setData({
      currentTab: current,
      activeTab: tabMap[current]
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
    this.setData({ currentPage: 1 });
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

  // 发布内容
  publishPost() {
    const { postContent } = this.data;
    
    if (!postContent.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }
    
    // 这里可以实现发布逻辑，暂时模拟发布成功
    wx.showToast({
      title: '发布成功',
      icon: 'success'
    });
    
    // 清空内容并返回首页
    this.setData({ 
      postContent: '',
      currentPage: 0
    });
    this.restoreCompanionStateByInput();
  },

  // 处理输入事件
  onPostInput(e) {
    const postContent = e.detail.value;
    this.setData({ postContent });
    this.updateCompanionEmotionByInput(postContent);
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
      my: 'myDiaryList',
      square: 'squarePostList',
      latest: 'latestPostList'
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

  // 切换隐私设置
  togglePrivacy() {
    this.setData({ isAnonymous: !this.data.isAnonymous });
  },

  // 切换位置显示
  toggleLocation() {
    this.setData({ showLocation: !this.data.showLocation });
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

  onAudioVolumeChange(e) {
    const value = Number(e.detail.value);
    const app = getApp();
    app.setAudioVolume(value / 100);
    this.setData({ audioVolume: value });
  },

  // 情绪调色盘点击事件 - 预览主题
  previewTheme(e) {
    const index = e.currentTarget.dataset.index;
    // 根据点击的日期索引选择对应的主题
    const themeIndex = index % THEMES.length;
    const theme = THEMES[themeIndex];
    
    // 预览主题（临时切换）
    this.setData({ theme });
    
    // 显示预览提示
    wx.showToast({
      title: `预览主题：${theme.name}`,
      icon: 'none'
    });
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
