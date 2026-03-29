import {
  THEMES,
  getThemeById
} from '../../theme.config.js';
import { callCloud } from '../../utils/cloud.js';

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

function formatTimeAgo(timestamp) {
  if (!timestamp) return '刚刚';
  
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}小时前`;
  
  const days = Math.floor(diff / 86400000);
  if (days < 30) return `${days}天前`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}个月前`;
  
  const years = Math.floor(months / 12);
  return `${years}年前`;
}

Page({
  data: {
    theme: THEMES[0],
    textPalette: resolveSemanticTextPalette(THEMES[0]),
    notifications: [],
    refreshing: false,
    page: 1,
    pageSize: 20,
    hasMore: true
  },

  onLoad() {
    this.syncThemeFromGlobal();
    this.loadNotifications();
  },

  onShow() {
    this.syncThemeFromGlobal();
    // 页面显示时刷新通知数量
    this.updateNotificationCount();
  },

  syncThemeFromGlobal() {
    try {
      const app = getApp();
      const themeState = app.getThemeState
        ? app.getThemeState()
        : {
            theme: app.globalData.theme || THEMES[0]
          };

      const resolvedTheme = themeState.theme || THEMES[0];
      this.setData({
        theme: resolvedTheme,
        textPalette: resolveSemanticTextPalette(resolvedTheme)
      });
    } catch (e) {
      console.error('同步主题失败:', e);
    }
  },

  goBack() {
    wx.navigateBack();
  },

  loadNotifications() {
    callCloud('getNotifications', {
      page: this.data.page,
      pageSize: this.data.pageSize
    }, {
      silent: true
    })
      .then(({ data }) => {
        const notifications = data.notifications || [];
        const hasMore = notifications.length >= this.data.pageSize;

        const formattedNotifications = notifications.map(item => ({
          id: item._id,
          ...item,
          time: formatTimeAgo(item.createdAt)
        }));

        this.setData({
          notifications: formattedNotifications,
          hasMore,
          refreshing: false
        });
      })
      .catch((err) => {
        console.error('获取通知失败:', err);
        this.setData({ refreshing: false });
      });
  },

  onRefresh() {
    this.setData({
      page: 1,
      hasMore: true,
      refreshing: true
    });
    this.loadNotifications();
  },

  onReachBottom() {
    if (!this.data.hasMore) return;
    
    this.setData({
      page: this.data.page + 1
    });
    
    callCloud('getNotifications', {
      page: this.data.page,
      pageSize: this.data.pageSize
    }, {
      silent: true
    })
      .then(({ data }) => {
        const notifications = data.notifications || [];
        const hasMore = notifications.length >= this.data.pageSize;

        const formattedNotifications = notifications.map(item => ({
          id: item._id,
          ...item,
          time: formatTimeAgo(item.createdAt)
        }));

        this.setData({
          notifications: [...this.data.notifications, ...formattedNotifications],
          hasMore
        });
      })
      .catch((err) => {
        console.error('加载更多通知失败:', err);
      });
  },

  onMarkAllRead() {
    callCloud('markNotificationRead', { markAll: true })
      .then(() => {
        const updatedNotifications = this.data.notifications.map(item => ({
          ...item,
          read: true
        }));

        this.setData({ notifications: updatedNotifications });
        wx.showToast({ title: '全部已读', icon: 'success' });
        this.updateNotificationCount();
      })
      .catch((err) => {
        console.error('标记全部已读失败:', err);
      });
  },

  onDeleteAll() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有通知吗？',
      success: (res) => {
        if (res.confirm) {
          callCloud('deleteNotification', { deleteAll: true })
            .then(() => {
              this.setData({ notifications: [] });
              wx.showToast({ title: '已清空', icon: 'success' });
              this.updateNotificationCount();
            })
            .catch((err) => {
              console.error('清空通知失败:', err);
            });
        }
      }
    });
  },

  onDeleteNotification(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条通知吗？',
      success: (res) => {
        if (res.confirm) {
          callCloud('deleteNotification', {
            notificationId: id
          })
            .then(() => {
              const updatedNotifications = this.data.notifications.filter(item => item.id !== id);
              this.setData({ notifications: updatedNotifications });
              wx.showToast({ title: '删除成功', icon: 'success' });
              this.updateNotificationCount();
            })
            .catch((err) => {
              console.error('删除通知失败:', err);
            });
        }
      }
    });
  },

  updateNotificationCount() {
    // 更新全局通知数量
    const app = getApp();

    callCloud('getNotifications', {
      unreadOnly: true,
      pageSize: 1
    }, {
      silent: true
    })
      .then(({ data }) => {
        const unreadCount = data.unreadCount || 0;
        app.globalData.unreadNotificationCount = unreadCount;

        if (app.updateNotificationCount) {
          app.updateNotificationCount(unreadCount);
        }
      })
      .catch((err) => {
        console.error('更新通知数量失败:', err);
      });
  }
});
