import { THEMES, getThemeTypeById } from '../../theme.config.js';
import { callCloud } from '../../utils/cloud.js';

function getInitialThemeState() {
  try {
    const app = getApp();
    const themeState = app && app.getThemeState
      ? app.getThemeState()
      : { theme: app && app.globalData ? app.globalData.theme : null };
    const theme = themeState && themeState.theme ? themeState.theme : THEMES[0];
    return {
      theme,
      themeType: getThemeTypeById(theme.id)
    };
  } catch (e) {
    return {
      theme: THEMES[0],
      themeType: getThemeTypeById(THEMES[0].id)
    };
  }
}

const INITIAL_THEME_STATE = getInitialThemeState();

function resolveSemanticTextPalette(theme = {}) {
  const isDarkColor = (color = '') => {
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
  data: {
    privateList: [],
    userInfo: {
      nickname: '匿名用户',
      mood: '今天心情不错'
    },
    theme: INITIAL_THEME_STATE.theme,
    textPalette: resolveSemanticTextPalette(INITIAL_THEME_STATE.theme),
    themeType: INITIAL_THEME_STATE.themeType,
    refreshing: false
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

  onLoad() {
    // 先设置页面窗口背景，降低页面切换首帧白闪
    this.updatePageBackgroundColor();
    this.syncThemeFromGlobal();
    this.syncUserInfoFromGlobal();
    this.loadPrivatePosts();
    this.updateNavigationBarColor();
  },

  onShow() {
    this.updatePageBackgroundColor();
    this.syncThemeFromGlobal();
    this.syncUserInfoFromGlobal();
    this.loadPrivatePosts();
  },

  syncThemeFromGlobal() {
    try {
      const app = getApp();
      const themeState = app.getThemeState
        ? app.getThemeState()
        : { theme: app.globalData.theme };
      const currentTheme = themeState.theme;
      if (currentTheme) {
        const themeType = getThemeTypeById(currentTheme.id);
        this.setData({
          theme: currentTheme,
          textPalette: resolveSemanticTextPalette(currentTheme),
          themeType: themeType
        }, () => {
          this.updateNavigationBarColor();
          this.updatePageBackgroundColor();
        });
      }
    } catch (e) {
      console.error('同步主题失败:', e);
    }
  },

  updatePageBackgroundColor() {
    const { theme } = this.data;
    if (!theme || !theme.bgColor || typeof wx.setBackgroundColor !== 'function') {
      return;
    }
    wx.setBackgroundColor({
      backgroundColor: theme.bgColor,
      backgroundColorTop: theme.bgColor,
      backgroundColorBottom: theme.bgColor
    });
  },

  updateNavigationBarColor() {
    const { theme } = this.data;
    if (theme && theme.bgColor) {
      const rgb = (() =>{
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

      if (rgb) {
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        const isDark = luminance< 0.52;
        const frontColor = isDark ? '#ffffff' : '#000000';
        wx.setNavigationBarColor({
          frontColor,
          backgroundColor: theme.bgColor
        });
      }
    }
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

  loadPrivatePosts() {
    try {
      console.log('本地私密页面 loadPrivatePosts 被调用');
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
      
      let myPostList = app.globalData.myPostList || [];
      console.log('从全局数据获取 - myPostList:', myPostList.length, '条');
      
      // 合并两个数据源并格式化时间
      const merged = [...myDiaryList, ...myPostList].map(item => ({
        ...item,
        time: this.formatTimeAgo(item.publishTime || item.writingTime)
      }));
      console.log('合并后共有:', merged.length, '条数据');
      
      const privateList = merged.filter(item => item.isPrivate)
        .sort((a, b) => {
          // 按照发布时间或写作时间倒序排序，最新的在最上面
          const timeA = a.publishTime || a.writingTime || 0;
          const timeB = b.publishTime || b.writingTime || 0;
          return timeB - timeA;
        });
      
      this.setData({ privateList });
      
      // 重新同步主题，确保主题不会被数据影响
      this.syncThemeFromGlobal();
    } catch (e) {
      console.error('加载本地私密失败:', e);
    }
  },

  onRefresh() {
    this.setData({ refreshing: true });
    setTimeout(() => {
      this.loadPrivatePosts();
      this.setData({ refreshing: false });
    }, 500);
  },

  onOpenPostDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    
    const target = this.data.privateList.find(item => item.id === id);
    if (!target) return;
    
    const payload = encodeURIComponent(JSON.stringify({
      ...target,
      sourceTab: 'private',
      isOwner: true
    }));
    
    wx.navigateTo({
      url: `/pages/detail/index?payload=${payload}`
    });
  },

  onEditMyPost(e) {
    console.log('私密页面编辑按钮被点击', e);
    const id = e.currentTarget.dataset.id;
    console.log('要编辑的内容ID:', id);
    if (!id) {
      console.log('ID为空，无法编辑');
      return;
    }
    
    // 从私密列表中找到要编辑的内容
    const target = this.data.privateList.find(item => item.id === id);
    console.log('找到的编辑目标:', target);
    if (!target) {
      console.log('未找到要编辑的内容');
      return;
    }
    
    // 将编辑数据存储到全局数据中，以便 home 页面读取
    const app = getApp();
    app.globalData.editingPost = {
      ...target,
      id
    };
    console.log('已设置全局编辑数据:', app.globalData.editingPost);
    
    // 关闭当前页面并跳转到 home 页面
    wx.redirectTo({
      url: '/pages/home/index',
      success: () => {
        console.log('成功跳转到home页面并关闭当前页面');
      },
      fail: (err) => {
        console.error('跳转到home页面失败:', err);
      }
    });
  },

  onDeleteMyPost(e) {
    console.log('私密页面删除按钮被点击', e);
    const id = e.currentTarget.dataset.id;
    console.log('要删除的内容ID:', id);
    if (!id) {
      console.log('ID为空，无法删除');
      return;
    }

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这篇私密作品吗？',
      success: (res) => {
        console.log('删除确认结果:', res);
        if (res.confirm) {
          this.deletePost(id);
        }
      }
    });
  },

  deletePost(id) {
    console.log('开始删除本地私密，ID:', id);
    try {
      const app = getApp();
      console.log('用户ID:', app.globalData.userInfo?.nickname);

      // 检查是否是本地日记（ID以"my-"开头）
      const isLocalDiary = id.startsWith('my-');
      console.log('是否本地日记:', isLocalDiary);

      // 删除日记列表中的内容
      let diaryList = app.globalData.diaryList || [];
      console.log('删除前日记列表长度:', diaryList.length);
      diaryList = diaryList.filter(item => item.id !== id);
      console.log('删除后日记列表长度:', diaryList.length);
      app.globalData.diaryList = diaryList;

      // 删除帖子列表中的内容
      let myPostList = app.globalData.myPostList || [];
      console.log('删除前帖子列表长度:', myPostList.length);
      myPostList = myPostList.filter(item => item.id !== id);
      console.log('删除后帖子列表长度:', myPostList.length);
      app.globalData.myPostList = myPostList;

      // 保存到本地存储
      try {
        wx.setStorageSync('myDiaryList', diaryList);
        wx.setStorageSync('myPostList', myPostList);
        console.log('成功保存到本地存储');
      } catch (e) {
        console.error('保存到本地存储失败:', e);
      }

      // 只有非本地日记才调用云函数删除云端数据（后台异步执行，不影响本地显示）
      if (!isLocalDiary) {
        setTimeout(() => {
          console.log('调用云函数删除云端数据，ID:', id);
          callCloud('deletePost', { postId: id }, { silent: true })
            .then(({ result }) => {
              console.log('云端删除成功:', result);
            })
            .catch((err) => {
              console.error('调用云函数失败:', err);
            });
        }, 0);
      } else {
        console.log('本地日记，不调用云函数');
      }

      this.loadPrivatePosts();

      wx.showToast({
        title: '删除成功',
        icon: 'success'
      });
      console.log('删除操作完成');
    } catch (e) {
      console.error('删除失败:', e);
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      });
    }
  }
});
