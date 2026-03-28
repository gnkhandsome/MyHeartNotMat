import {
  THEMES,
  THEME_STYLE_TYPES,
  getThemeTypeById,
  getThemesByType
} from '../../theme.config.js';

function parseColorToRgb(color = '') {
  const value = String(color || '').trim();
  if (!value) return null;

  if (value.startsWith('#')) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16)
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
      };
    }
  }

  if (value.startsWith('rgb(') || value.startsWith('rgba(')) {
    const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10)
      };
    }
  }

  return null;
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
  const body = theme.bodyTextColor || theme.textColor || (darkBg ? '#E5E7EB' : '#334155');
  return {
    title: theme.titleTextColor || theme.textColor || (darkBg ? '#F8FAFC' : '#1F2937'),
    body,
    subtitle: theme.subtitleTextColor || (darkBg ? '#CBD5E1' : '#64748B'),
    tertiary: theme.tertiaryTextColor || (darkBg ? '#94A3B8' : '#94A3B8'),
    inverse: theme.inverseTextColor || (darkPrimary ? '#FFFFFF' : '#0F172A')
  };
}

Page({
  moodStorageKey: 'profileMoodCheckins',

  data: {
    userInfo: {
      nickname: '微信用户',
      mood: '热爱生活，热爱AI'
    },
    theme: THEMES[0],
    textPalette: resolveSemanticTextPalette(THEMES[0]),
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
    activePage: 'profile',
    activeTab: 'topics',
    myTopicsList: [],
    likedList: [],
    favoriteList: [],
    topicsRefreshing: false,
    likesRefreshing: false,
    favoritesRefreshing: false,
    
    // 分页相关
    topicsPage: 1,
    topicsPageSize: 10,
    hasMoreTopics: true,
    topicsLoading: false,
    
    favoritesPage: 1,
    favoritesPageSize: 10,
    hasMoreFavorites: true,
    favoritesLoading: false,
    
    // 通知相关
    unreadNotificationCount: 0
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
    this.loadMyTopics(true);
    this.loadLiked();
    this.loadFavorites(true);
    this.updateNotificationCount();
  },

  onShow() {
    this.syncThemeFromGlobal();
    this.syncUserInfoFromGlobal();
    this.loadMyTopics(true);
    this.loadLiked();
    this.loadFavorites(true);
    this.updateNotificationCount();
  },

  syncUserInfoFromGlobal() {
    try {
      const app = getApp();
      const userInfo = app.globalData.userInfo;
      if (userInfo) {
        this.setData({ userInfo });
      }
    } catch (e) {
      console.error('同步用户信息失败:', e);
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
      textPalette: resolveSemanticTextPalette(theme),
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

  generateMoodData(checkins = {}) {
    const moodData = [];
    const today = new Date();
    const todayKey = this.getDateKey(today);
    
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

  switchThemeType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      activeThemeType: type,
      filteredThemes: getThemesByType(type)
    });
  },

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

  openBlindBox() {
    if (this.data.isBlindBoxOpening) {
      return;
    }

    wx.vibrateShort();
    
    this.setData({
      isBlindBoxOpening: true,
      isFlipping: true,
      showQuote: false,
      showBlindResult: false,
      currentQuote: ''
    });
    
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

  switchPage(e) {
    const page = e.currentTarget.dataset.page;
    
    if (page === 'home') {
      wx.redirectTo({
        url: '/pages/home/index'
      });
    } else if (page === 'square') {
      wx.redirectTo({
        url: '/pages/home/index?currentPage=1'
      });
    } else if (page === 'profile') {
      return;
    }
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  loadMyTopics(refresh = false) {
    try {
      const app = getApp();
      const userId = app.globalData.userInfo?.nickname;
      
      if (!userId) {
        console.error('用户未登录');
        return;
      }
      
      const page = refresh ? 1 : this.data.topicsPage;
      const pageSize = this.data.topicsPageSize;
      
      this.setData({ topicsLoading: true });
      
      // 从云端获取我的发布列表
      wx.cloud.callFunction({
        name: 'getMyPosts',
        data: {
          userId: userId,
          page: page,
          limit: pageSize
        },
        success: (res) => {
          if (res.result && res.result.success) {
            const cloudPosts = res.result.posts || [];
            
            // 获取本地日记
            const myDiaryList = app.globalData.diaryList || [];
            
            // 合并本地日记和云端动态
            let mergedList = [];
            if (refresh) {
              mergedList = [...myDiaryList, ...cloudPosts];
            } else {
              mergedList = [...this.data.myTopicsList, ...cloudPosts];
            }
            
            // 去重
            const uniqueList = [];
            const seenIds = new Set();
            mergedList.forEach(post => {
              const id = post.id || post._id;
              if (!seenIds.has(id)) {
                seenIds.add(id);
                uniqueList.push(post);
              }
            });
            
            // 按创建时间排序
            uniqueList.sort((a, b) => {
              const timeA = a.createdAt || a.writingTime || Date.now();
              const timeB = b.createdAt || b.writingTime || Date.now();
              return new Date(timeB) - new Date(timeA);
            });
            
            this.setData({
              myTopicsList: uniqueList,
              topicsPage: refresh ? 2 : page + 1,
              hasMoreTopics: cloudPosts.length >= pageSize,
              topicsLoading: false
            });
            
            // 更新全局数据
            app.globalData.myPostList = cloudPosts;
          } else {
            console.error('获取我的发布列表失败:', res.result?.message);
            this.setData({ topicsLoading: false });
          }
        },
        fail: (err) => {
          console.error('调用云函数失败:', err);
          this.setData({ topicsLoading: false });
        }
      });
    } catch (e) {
      console.error('加载我的话题失败:', e);
      this.setData({ topicsLoading: false });
    }
  },

  loadLiked() {
    try {
      const likedPostIds = wx.getStorageSync('likedPostIds') || [];
      const app = getApp();
      const squarePostList = app.globalData.squarePostList || [];
      
      const likedList = squarePostList.filter(item => 
        likedPostIds.includes(item.id)
      );
      
      this.setData({ likedList });
    } catch (e) {
      console.error('加载点赞列表失败:', e);
    }
  },

  loadFavorites(refresh = false) {
    try {
      const app = getApp();
      const userId = app.globalData.userInfo?.nickname;
      
      if (!userId) {
        console.error('用户未登录');
        return;
      }
      
      const page = refresh ? 1 : this.data.favoritesPage;
      const pageSize = this.data.favoritesPageSize;
      
      this.setData({ favoritesLoading: true });
      
      // 从云端获取收藏列表
      wx.cloud.callFunction({
        name: 'getFavorites',
        data: {
          userId: userId,
          page: page,
          limit: pageSize
        },
        success: (res) => {
          if (res.result && res.result.success) {
            let favoritePosts = res.result.posts || [];
            
            // 处理本地日记，从本地存储获取完整数据
            favoritePosts = favoritePosts.map(post => {
              if (post.isLocalDiary) {
                // 从本地存储获取完整的本地日记数据
                const localDiary = this.getLocalDiaryById(post.id);
                return localDiary || post;
              }
              return post;
            });
            
            // 更新本地存储的收藏状态
            const collectedPostIds = favoritePosts.map(post => post.id || post._id);
            wx.setStorageSync('collectedPostIds', collectedPostIds);
            
            // 更新全局收藏数据
            app.globalData.collectedPosts = favoritePosts;
            
            let newFavoriteList = [];
            if (refresh) {
              newFavoriteList = favoritePosts;
            } else {
              newFavoriteList = [...this.data.favoriteList, ...favoritePosts];
            }
            
            this.setData({
              favoriteList: newFavoriteList,
              favoritesPage: refresh ? 2 : page + 1,
              hasMoreFavorites: favoritePosts.length >= pageSize,
              favoritesLoading: false
            });
          } else {
            console.error('获取收藏列表失败:', res.result?.message);
            this.setData({ favoritesLoading: false });
            // 失败时从本地存储加载
            this.loadFavoritesFromStorage();
          }
        },
        fail: (err) => {
          console.error('调用云函数失败:', err);
          this.setData({ favoritesLoading: false });
          // 失败时从本地存储加载
          this.loadFavoritesFromStorage();
        }
      });
    } catch (e) {
      console.error('加载收藏列表失败:', e);
      this.setData({ favoritesLoading: false });
      // 异常时从本地存储加载
      this.loadFavoritesFromStorage();
    }
  },
  
  loadFavoritesFromStorage() {
    try {
      const collectedPostIds = wx.getStorageSync('collectedPostIds') || [];
      const app = getApp();
      const squarePostList = app.globalData.squarePostList || [];
      const myDiaryList = app.globalData.diaryList || [];
      
      const favoriteList = [];
      
      // 查找广场动态
      squarePostList.forEach(item => {
        if (collectedPostIds.includes(item.id)) {
          favoriteList.push(item);
        }
      });
      
      // 查找本地日记
      myDiaryList.forEach(item => {
        if (collectedPostIds.includes(item.id)) {
          favoriteList.push(item);
        }
      });
      
      this.setData({ favoriteList });
    } catch (e) {
      console.error('从本地存储加载收藏列表失败:', e);
    }
  },
  
  getLocalDiaryById(id) {
    try {
      const app = getApp();
      const myDiaryList = app.globalData.diaryList || [];
      return myDiaryList.find(item => item.id === id);
    } catch (e) {
      console.error('获取本地日记失败:', e);
      return null;
    }
  },

  goToWrite() {
    wx.redirectTo({
      url: '/pages/home/index'
    });
  },

  goToSquare() {
    wx.redirectTo({
      url: '/pages/home/index?currentPage=1'
    });
  },

  onOpenPostDetail(e) {
    const { id, type = 'topic' } = e.currentTarget.dataset || {};
    if (!id) return;
    
    const target = this.data.myTopicsList.find(item => item.id === id);
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

  onOpenSquarePostDetail(e) {
    const { id } = e.currentTarget.dataset;
    if (!id) return;
    
    const app = getApp();
    const { favoriteList, likedList } = this.data;
    
    // 先从收藏列表查找
    let target = favoriteList.find(item => (item.id || item._id) === id);
    
    // 如果收藏列表没有，从点赞列表查找
    if (!target) {
      target = likedList.find(item => (item.id || item._id) === id);
    }
    
    // 如果还没有，从广场列表查找
    if (!target) {
      const squarePostList = app.globalData.squarePostList || [];
      target = squarePostList.find(item => item.id === id);
    }
    
    if (!target) {
      wx.showToast({ title: '找不到内容', icon: 'none' });
      return;
    }
    
    // 统一数据格式
    const postData = {
      ...target,
      id: target.id || target._id,
      sourceTab: 'square',
      isOwner: false,
      isLiked: true, // 点赞列表中的内容肯定是已点赞的
      isCollected: favoriteList.some(item => (item.id || item._id) === id)
    };
    
    const payload = encodeURIComponent(JSON.stringify(postData));
    
    wx.navigateTo({
      url: `/pages/detail/index?payload=${payload}`
    });
  },

  onNotificationTap() {
    wx.navigateTo({
      url: '/pages/notification/index'
    });
  },
  
  updateNotificationCount() {
    const app = getApp();
    const userId = app.globalData.userInfo?.nickname;
    
    if (!userId) return;

    wx.cloud.callFunction({
      name: 'getNotifications',
      data: {
        userId: userId,
        unreadOnly: true,
        pageSize: 1
      },
      success: (res) => {
        if (res.result && res.result.success) {
          const unreadCount = res.result.unreadCount || 0;
          this.setData({ unreadNotificationCount: unreadCount });
          app.globalData.unreadNotificationCount = unreadCount;
        }
      },
      fail: (err) => {
        console.error('更新通知数量失败:', err);
      }
    });
  },

  onTopicsRefresh() {
    this.setData({ topicsRefreshing: true });
    
    setTimeout(() => {
      this.loadMyTopics();
      this.setData({ topicsRefreshing: false });
      wx.showToast({ title: '刷新成功', icon: 'success' });
    }, 1500);
  },

  onLikesRefresh() {
    this.setData({ likesRefreshing: true });
    
    setTimeout(() => {
      this.loadLiked();
      this.setData({ likesRefreshing: false });
      wx.showToast({ title: '刷新成功', icon: 'success' });
    }, 1500);
  },

  onFavoritesRefresh() {
    this.setData({ favoritesRefreshing: true });
    
    setTimeout(() => {
      this.loadFavorites(true);
      this.setData({ favoritesRefreshing: false });
      wx.showToast({ title: '刷新成功', icon: 'success' });
    }, 1500);
  },
  
  // 下拉刷新
  onPullDownRefresh() {
    if (this.data.activeTab === 'topics') {
      this.loadMyTopics(true);
    } else if (this.data.activeTab === 'favorites') {
      this.loadFavorites(true);
    } else if (this.data.activeTab === 'likes') {
      this.loadLiked();
    }
    wx.stopPullDownRefresh();
  },
  
  // 上拉加载更多
  onReachBottom() {
    if (this.data.activeTab === 'topics') {
      if (this.data.hasMoreTopics && !this.data.topicsLoading) {
        this.loadMyTopics();
      }
    } else if (this.data.activeTab === 'favorites') {
      if (this.data.hasMoreFavorites && !this.data.favoritesLoading) {
        this.loadFavorites();
      }
    }
  },

  onDeletePost(e) {
    e.stopPropagation();
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这篇发布吗？',
      success: (res) => {
        if (res.confirm) {
          this.deletePost(id);
        }
      }
    });
  },

  deletePost(id) {
    console.log('开始删除，ID:', id);
    try {
      const app = getApp();
      const userId = app.globalData.userInfo?.nickname;
      
      console.log('用户ID:', userId);
      
      if (!userId) {
        wx.showToast({ title: '用户未登录', icon: 'none' });
        return;
      }
      
      // 检查是否是本地日记（ID以"my-"开头）
      const isLocalDiary = id.startsWith('my-');
      console.log('是否本地日记:', isLocalDiary);
      
      // 删除本地数据
      let diaryList = app.globalData.diaryList || [];
      diaryList = diaryList.filter(item => item.id !== id);
      app.globalData.diaryList = diaryList;
      
      let myPostList = app.globalData.myPostList || [];
      myPostList = myPostList.filter(item => item.id !== id);
      app.globalData.myPostList = myPostList;
      
      // 保存到本地存储
      try {
        wx.setStorageSync('myDiaryList', diaryList);
        wx.setStorageSync('myPostList', myPostList);
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
      
      this.loadMyTopics();
      
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
  }
});
