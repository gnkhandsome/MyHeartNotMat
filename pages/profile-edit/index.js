import { THEMES, getThemeTypeById } from '../../theme.config.js';

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
  data: {
    userInfo: {
      nickname: '',
      mood: '',
      avatar: ''
    },
    tempNickname: '',
    tempMood: '',
    tempAvatar: '',
    theme: THEMES[0],
    textPalette: resolveSemanticTextPalette(THEMES[0])
  },

  onLoad() {
    this.syncThemeFromGlobal();
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    this.setData({
      userInfo,
      tempNickname: userInfo.nickname || '',
      tempMood: userInfo.mood || '',
      tempAvatar: userInfo.avatar || ''
    });
    
    const theme = this.data.theme;
    const isDark = this.isDarkColor(theme.bgColor);
    wx.setNavigationBarColor({
      frontColor: isDark ? '#ffffff' : '#000000',
      backgroundColor: theme.bgColor || '#ffffff'
    });
  },

  syncThemeFromGlobal() {
    try {
      const app = getApp();
      const themeState = app.getThemeState
        ? app.getThemeState()
        : { theme: app.globalData.theme || THEMES[0] };

      this.setData({
        theme: themeState.theme,
        textPalette: resolveSemanticTextPalette(themeState.theme)
      });
    } catch (e) {
      console.error('同步全局主题失败:', e);
      this.setData({
        theme: THEMES[0],
        textPalette: resolveSemanticTextPalette(THEMES[0])
      });
    }
  },

  isDarkColor(color = '') {
    const rgb = parseColorToRgb(color);
    if (!rgb) return false;
    const { r, g, b } = rgb;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.52;
  },

  onNicknameInput(e) {
    let value = e.detail.value;
    if (value.length > 8) {
      value = value.substring(0, 8);
      wx.showToast({
        title: '昵称不能超过8位',
        icon: 'none'
      });
    }
    this.setData({ tempNickname: value });
  },

  onMoodInput(e) {
    this.setData({ tempMood: e.detail.value });
  },

  onSave() {
    const { tempNickname, tempMood, tempAvatar } = this.data;
    
    if (!tempNickname || !tempNickname.trim()) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    const app = getApp();
    app.updateUserInfo({
      nickname: tempNickname.trim(),
      mood: tempMood || '',
      avatar: tempAvatar
    });

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  },

  onCancel() {
    wx.navigateBack();
  },

  onAvatarTap() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          tempAvatar: tempFilePath
        });
        wx.showToast({
          title: '头像选择成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('选择头像失败:', err);
      }
    });
  }
});
