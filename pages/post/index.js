import {
  THEMES
} from '../../theme.config.js';
import { createPageShredHelper } from '../../utils/shredder.js';

const postShredHelper = createPageShredHelper({
  canvasSelector: '#postShredCanvas'
});

const POST_TYPE_META = {
  letter: { label: '写信', icon: '✉️', placeholder: '把想说的话写成一封信' },
  postcard: { label: '明信片', icon: '🖼️', placeholder: '写下此刻风景与心情' },
  diary: { label: '日记', icon: '📔', placeholder: '记录今天发生的事情' },
  vlog: { label: 'Vlog', icon: '🎬', placeholder: '用镜头语言记录今天' }
};

const POST_ACTION_META = {
  letter: { cta: '封装信笺', done: '信笺已封装好' },
  postcard: { cta: '寄出明信片', done: '明信片已写好' },
  diary: { cta: '收进日记页', done: '日记已收好' },
  vlog: { cta: '发出片段', done: '片段已整理好' }
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

Page({
  data: {
    theme: THEMES[0],
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
    isPostShattering: false,
    isShredCanvasVisible: false,
    shatteringCardIds: [],
    myPostList: [],
    diaryList: [],
    myPublishTab: 'public',
    publicPostList: [],
    privatePostList: []
  },

  onLoad() {
    this.setData({
      myPostList: this.getInitialMyPostList(),
      diaryList: this.getInitialDiaryList()
    }, () => {
      this.rebuildPublishTabLists();
    });
    this.syncThemeFromGlobal();
  },

  onShow() {
    this.rebuildPublishTabLists();
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
      this.createTypedPostItem({
        id: 'post-1',
        type: 'letter',
        content: '今天尝试把焦虑写出来，果然轻松了很多。',
        time: '今天 09:16',
        visibility: 'public',
        letterSalutation: '亲爱的你',
        letterSignature: '—— 来自今天更坦诚的我'
      }),
      this.createTypedPostItem({
        id: 'post-2',
        type: 'vlog',
        content: '雨声真的很治愈，像给脑袋按了暂停键。',
        time: '昨天 22:41',
        vlogScriptTemplate: '镜头1｜窗外雨滴特写\n镜头2｜手捧热茶和旁白\n镜头3｜拉远到夜色与路灯'
      })
    ];
  },

  getInitialDiaryList() {
    return [
      this.createTypedPostItem({
        id: 'diary-1',
        type: 'diary',
        content: '把“非做不可”换成“我可以慢慢来”。',
        time: '3天前',
        diaryWeather: '小雨',
        diaryMoodScore: 6
      }),
      this.createTypedPostItem({
        id: 'diary-2',
        type: 'postcard',
        content: '今天的我也值得被夸奖一下。',
        time: '5天前',
        postcardLocation: '杭州 · 西湖边'
      })
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
    visibility = 'private',
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
      vlogDuration: type === 'vlog' ? `0${Math.floor(Math.random() * 3) + 1}:${Math.floor(Math.random() * 50 + 10)}` : '',
      letterSalutation: type === 'letter' ? (letterSalutation || '亲爱的你') : '',
      letterSignature: type === 'letter' ? (letterSignature || '—— 今晚的你') : '',
      postcardLocation: type === 'postcard' ? (postcardLocation || '未署名地点') : '',
      diaryWeather: type === 'diary' ? (diaryWeather || '天气未记录') : '',
      diaryMoodScore: type === 'diary' ? moodScore : null,
      vlogScriptTemplate: type === 'vlog' ? safeScriptTemplate : '',
      vlogShots: type === 'vlog' ? this.buildVlogShots(safeScriptTemplate) : [],
      scenePackage: scenePackage || this.buildDefaultScenePackage(),
      visibility,
      content,
      time
    };
  },

  buildDefaultScenePackage() {
    return {
      sceneKey: 'rainy',
      sceneIntensity: 65,
      themeId: Number(this.data.theme && this.data.theme.id),
      capturedAt: Date.now()
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

  onPostInput(e) {
    this.setData({ postContent: e.detail.value });
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

  cancelPost() {
    this.setData({ postContent: '' });
    wx.showToast({
      title: '已清空输入',
      icon: 'none'
    });
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

  publishPost(options = {}) {
    const { visibility = 'private' } = options;
    const {
      postContent,
      myPostList,
      diaryList,
      activePostType,
      letterSalutation,
      letterSignature,
      postcardLocation,
      diaryWeather,
      diaryMoodScore,
      vlogScriptTemplate
    } = this.data;
    if (!postContent.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    const newItem = this.createTypedPostItem({
      id: `post-${Date.now()}`,
      type: activePostType,
      content: postContent.trim(),
      time: '刚刚',
      visibility,
      scenePackage: this.buildDefaultScenePackage(),
      letterSalutation,
      letterSignature,
      postcardLocation,
      diaryWeather,
      diaryMoodScore,
      vlogScriptTemplate
    });

    this.setData({
      postContent: '',
      myPostList: activePostType === 'diary' ? myPostList : [newItem, ...myPostList],
      diaryList: activePostType === 'diary' ? [newItem, ...diaryList] : diaryList
    }, () => {
      this.rebuildPublishTabLists();
    });

    const actionMeta = this.getPostActionMeta(activePostType);
    const visibilityText = visibility === 'public' ? '并标记为公开' : '仅自己可见';
    wx.showToast({
      title: `${actionMeta.done}，${visibilityText}`,
      icon: 'none'
    });
  },

  togglePrivacy() {
    this.setData({
      isAnonymous: !this.data.isAnonymous
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

  rebuildPublishTabLists() {
    const postList = (this.data.myPostList || []).map((item) => ({
      ...item,
      sourceType: 'post'
    }));
    const diaryList = (this.data.diaryList || []).map((item) => ({
      ...item,
      sourceType: 'diary'
    }));
    const merged = [...postList, ...diaryList];
    const publicPostList = merged.filter((item) => item.visibility === 'public');
    const privatePostList = merged.filter((item) => item.visibility !== 'public');
    this.setData({ publicPostList, privatePostList });
  },

  switchMyPublishTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (!['public', 'private'].includes(tab) || tab === this.data.myPublishTab) {
      return;
    }
    this.setData({ myPublishTab: tab });
  },

  navigateToPostDetail(post = {}, sourceTab = 'post') {
    if (!post || !post.id) {
      return;
    }
    const isOwner = true;
    const payload = encodeURIComponent(JSON.stringify({
      ...post,
      sourceTab,
      isOwner
    }));
    wx.navigateTo({
      url: `/pages/detail/index?payload=${payload}`
    });
  },

  onOpenPostDetail(e) {
    const { id, type = 'post' } = e.currentTarget.dataset || {};
    if (!id) {
      return;
    }
    const listKey = this.getListKeyByType(type);
    const target = (this.data[listKey] || []).find((item) => item.id === id);
    if (!target) {
      return;
    }
    this.navigateToPostDetail(target, type);
  },

  async onShatterCard(e) {
    const { id, type } = e.currentTarget.dataset;
    if (!id || this.data.shatteringCardIds.includes(id)) {
      return;
    }

    const listKey = this.getListKeyByType(type);
    const target = (this.data[listKey] || []).find((item) => item.id === id);
    if (!target) {
      return;
    }

    if (target.visibility === 'public') {
      wx.showToast({
        title: '公开内容请先撤回为私密',
        icon: 'none'
      });
      return;
    }

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
      }, () => {
        this.rebuildPublishTabLists();
      });

      wx.showToast({
        title: '卡片已粉碎',
        icon: 'success'
      });
    }, 360);
  },

  onSetPrivate(e) {
    const { id, type } = e.currentTarget.dataset || {};
    if (!id) {
      return;
    }
    const listKey = this.getListKeyByType(type);
    const nextList = (this.data[listKey] || []).map((item) => {
      if (item.id !== id) {
        return item;
      }
      return {
        ...item,
        visibility: 'private'
      };
    });

    this.setData({
      [listKey]: nextList
    }, () => {
      this.rebuildPublishTabLists();
    });

    wx.showToast({
      title: '已撤回到本地私密',
      icon: 'success'
    });
  }
});