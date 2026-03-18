import {
  THEMES,
  THEME_STYLE_TYPES,
  getThemeTypeById,
  getThemesByType
} from '../../theme.config.js';

Page({
  moodStorageKey: 'profileMoodCheckins',

  data: {
    userInfo: {
      nickname: '匿名用户',
      mood: '今天心情不错'
    },
    theme: THEMES[0], // 默认使用第一个主题
    activeThemeType: THEME_STYLE_TYPES.FEMALE,
    themeStyleTypes: THEME_STYLE_TYPES,
    themes: THEMES,
    filteredThemes: getThemesByType(THEME_STYLE_TYPES.FEMALE),
    moodData: [],
    moodRecordCount: 0,
    todayMoodRecorded: false,
    isFlipping: false,
    showQuote: false,
    currentQuote: '',
    blindBoxInput: '',
    isBlindBoxOpening: false,
    showBlindResult: false,
    blindBoxResult: '',
    blindBoxSparkles: [1, 2, 3, 4, 5, 6, 7, 8],
    activePage: 'profile' // 当前页面
  },

  blindBoxQuotes: [
    '你已经很努力了，允许自己慢一点也没关系。',
    '把今天过完，就是很了不起的一件事。',
    '你不需要证明自己值得被爱，你本来就值得。',
    '把心事放下这一刻，你已经在变轻。',
    '愿你今晚好眠，明天醒来仍有勇气向前。',
    '世界很吵，但你可以先听见自己的呼吸。',
    '别急，花会开的，答案会来的。',
    '谢谢你没有放弃自己，哪怕只是一点点。'
  ],

  onLoad() {
    this.syncThemeFromGlobal();
    this.initMoodPalette();
  },

  onShow() {
    this.syncThemeFromGlobal();
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
      filteredThemes: getThemesByType(resolvedType)
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

  getDateKey(date = new Date()) {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, '0');
    const d = `${date.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  loadMoodCheckins() {
    try {
      return wx.getStorageSync(this.moodStorageKey) || {};
    } catch (e) {
      console.error('读取心情记录失败:', e);
      return {};
    }
  },

  persistMoodCheckins(checkins = {}) {
    try {
      wx.setStorageSync(this.moodStorageKey, checkins);
    } catch (e) {
      console.error('保存心情记录失败:', e);
    }
  },

  // 生成情绪调色盘数据（过去30天）
  generateMoodData(checkins = {}) {
    const moodData = [];
    const today = new Date();
    const todayKey = this.getDateKey(today);
    
    // 生成过去30天的数据
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dateKey = this.getDateKey(date);
      const record = checkins[dateKey];
      
      moodData.push({
        key: dateKey,
        date: date.getDate(),
        color: (record && record.color) || '#E5E7EB',
        isRecorded: !!record,
        isToday: dateKey === todayKey,
        themeId: record && Number.isInteger(record.themeId) ? record.themeId : null
      });
    }
    
    return moodData;
  },

  initMoodPalette() {
    const checkins = this.loadMoodCheckins();
    const moodData = this.generateMoodData(checkins);
    const moodRecordCount = moodData.filter((item) => item.isRecorded).length;
    const todayMoodRecorded = moodData.some((item) => item.isToday && item.isRecorded);

    this.setData({
      moodData,
      moodRecordCount,
      todayMoodRecorded
    });
  },

  recordTodayMood() {
    const checkins = this.loadMoodCheckins();
    const todayKey = this.getDateKey(new Date());
    const { theme } = this.data;

    checkins[todayKey] = {
      color: theme.primaryColor,
      themeId: theme.id,
      updatedAt: Date.now()
    };

    this.persistMoodCheckins(checkins);
    this.initMoodPalette();

    wx.showToast({
      title: '今日心情已记录',
      icon: 'success'
    });
  },

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
  },

  onMoodDayTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.moodData[index];
    if (!item) return;

    if (item.isToday) {
      this.recordTodayMood();
      return;
    }

    if (Number.isInteger(item.themeId)) {
      const previewTheme = THEMES.find((theme) => theme.id === item.themeId) || THEMES[0];
      this.setData({ theme: previewTheme });
      wx.showToast({
        title: `回看：${previewTheme.name}`,
        icon: 'none'
      });
      return;
    }

    wx.showToast({
      title: '仅可记录今日心情',
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

  onBlindInput(e) {
    this.setData({
      blindBoxInput: e.detail.value
    });
  },

  getRandomBlindQuote() {
    const { blindBoxQuotes } = this;
    return blindBoxQuotes[Math.floor(Math.random() * blindBoxQuotes.length)];
  },

  buildBlindResult() {
    const quote = this.getRandomBlindQuote();
    const input = (this.data.blindBoxInput || '').trim();
    if (!input) return quote;
    return `你放下了：「${input}」\n\n${quote}`;
  },

  // 打开解忧盲盒
  openBlindBox() {
    if (this.data.isBlindBoxOpening) {
      return;
    }

    // 触发震动
    wx.vibrateShort();
    
    // 开始拆盒动画
    this.setData({
      isBlindBoxOpening: true,
      isFlipping: true,
      showQuote: false,
      showBlindResult: false,
      currentQuote: ''
    });
    
    // 开盒完成后显示文案
    setTimeout(() => {
      const randomQuote = this.buildBlindResult();
      
      this.setData({
        isBlindBoxOpening: false,
        isFlipping: false,
        showBlindResult: true,
        showQuote: true,
        currentQuote: randomQuote,
        blindBoxResult: randomQuote
      });
    }, 960);
  },

  refreshBlindQuote() {
    if (!this.data.showBlindResult || this.data.isBlindBoxOpening) {
      wx.showToast({
        title: '先拆开盲盒再换一句',
        icon: 'none'
      });
      return;
    }

    const nextQuote = this.buildBlindResult();
    this.setData({
      currentQuote: nextQuote,
      blindBoxResult: nextQuote
    });
  },

  resetBlindBox() {
    this.setData({
      blindBoxInput: '',
      isBlindBoxOpening: false,
      isFlipping: false,
      showQuote: false,
      showBlindResult: false,
      currentQuote: '',
      blindBoxResult: ''
    });
  },

  // 切换页面
  switchPage(e) {
    const page = e.currentTarget.dataset.page;
    
    if (page === 'home') {
      // 跳转到首页
      wx.redirectTo({
        url: '/pages/home/index'
      });
    } else if (page === 'profile') {
      // 已经在我的页面，不做任何操作
      return;
    }
  },

  // 跳转到发布页面
  goToPost() {
    wx.navigateTo({
      url: '/pages/post/index'
    });
  }
});
