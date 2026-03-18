import {
  THEMES
} from '../../theme.config.js';
import { createPageShredHelper } from '../../utils/shredder.js';

const postShredHelper = createPageShredHelper({
  canvasSelector: '#postShredCanvas'
});

Page({
  data: {
    theme: THEMES[0],
    postContent: '',
    isAnonymous: true,
    showLocation: false,
    isPostShattering: false,
    isShredCanvasVisible: false,
    shatteringCardIds: [],
    myPostList: [],
    diaryList: []
  },

  onLoad() {
    this.setData({
      myPostList: this.getInitialMyPostList(),
      diaryList: this.getInitialDiaryList()
    });
    this.syncThemeFromGlobal();
  },

  onShow() {
    this.syncThemeFromGlobal();
  },

  syncThemeFromGlobal() {
    try {
      const app = getApp();
      const themeState = app.getThemeState
        ? app.getThemeState()
        : { theme: app.globalData.theme || THEMES[0] };

      this.setData({
        theme: themeState.theme || THEMES[0]
      });
    } catch (e) {
      console.error('同步全局主题失败:', e);
      this.setData({
        theme: THEMES[0]
      });
    }
  },

  getInitialMyPostList() {
    return [
      { id: 'post-1', content: '今天尝试把焦虑写出来，果然轻松了很多。', time: '今天 09:16' },
      { id: 'post-2', content: '雨声真的很治愈，像给脑袋按了暂停键。', time: '昨天 22:41' }
    ];
  },

  getInitialDiaryList() {
    return [
      { id: 'diary-1', content: '把“非做不可”换成“我可以慢慢来”。', time: '3天前' },
      { id: 'diary-2', content: '今天的我也值得被夸奖一下。', time: '5天前' }
    ];
  },

  onPostInput(e) {
    this.setData({ postContent: e.detail.value });
  },

  cancelPost() {
    this.setData({ postContent: '' });
    wx.showToast({
      title: '已清空输入',
      icon: 'none'
    });
  },

  publishPost() {
    const { postContent, myPostList } = this.data;
    if (!postContent.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    const newItem = {
      id: `post-${Date.now()}`,
      content: postContent.trim(),
      time: '刚刚'
    };

    this.setData({
      postContent: '',
      myPostList: [newItem, ...myPostList]
    });

    wx.showToast({
      title: '发布成功',
      icon: 'success'
    });
  },

  togglePrivacy() {
    this.setData({
      isAnonymous: !this.data.isAnonymous
    });
  },

  toggleLocation() {
    this.setData({
      showLocation: !this.data.showLocation
    });
  },

  triggerShatterFeedback() {
    wx.vibrateShort();
    const app = getApp();
    if (app.playShatterSfx) {
      app.playShatterSfx('/raining.mp3');
    }
  },

  async runShredForSelector(targetSelector, particleCount = 180) {
    await postShredHelper.shred(this, {
      targetSelector,
      particleCount
    });
  },

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

    const animPromise = this.runShredForSelector('#postInputField', 220);

    await app.deleteContentItem({ id: 'post-page-draft', type: 'draft' });
    await animPromise;

    setTimeout(() => {
      this.setData({
        postContent: '',
        isPostShattering: false
      });

      wx.showToast({
        title: '已粉碎，不入流',
        icon: 'success'
      });
    }, 420);
  },

  getListKeyByType(type) {
    return type === 'diary' ? 'diaryList' : 'myPostList';
  },

  async onShatterCard(e) {
    const { id, type } = e.currentTarget.dataset;
    if (!id || this.data.shatteringCardIds.includes(id)) {
      return;
    }

    const listKey = this.getListKeyByType(type);
    const app = getApp();

    this.triggerShatterFeedback();
    this.setData({
      shatteringCardIds: [...this.data.shatteringCardIds, id]
    });

    const animPromise = this.runShredForSelector(`#post-card-${id}`, 150);

    await app.deleteContentItem({ id, type });
    await animPromise;

    setTimeout(() => {
      this.setData({
        [listKey]: (this.data[listKey] || []).filter((item) => item.id !== id),
        shatteringCardIds: this.data.shatteringCardIds.filter((itemId) => itemId !== id)
      });

      wx.showToast({
        title: '卡片已粉碎',
        icon: 'success'
      });
    }, 360);
  }
});