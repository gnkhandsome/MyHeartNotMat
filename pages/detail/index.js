import {
  THEMES,
  getThemeById
} from '../../theme.config.js';

const SCENE_META = {
  sunny: { label: '晴天', desc: '阳光从窗边落下，心口也亮了起来。' },
  cloudy: { label: '阴天', desc: '云层很轻，情绪也可以慢慢落地。' },
  rainy: { label: '下雨', desc: '雨滴声像背景白噪音，帮你把思绪放慢。' },
  windy: { label: '有风', desc: '风会带走一点闷，让呼吸更顺一点。' },
  snowy: { label: '大雪', desc: '雪很安静，适合把心事写得温柔些。' },
  stream: { label: '水流', desc: '像溪流一样，让堵住的话慢慢流出来。' }
};

const SCENE_OPTIONS = Object.keys(SCENE_META).map((key) => ({
  key,
  label: SCENE_META[key].label
}));

function resolveSemanticTextPalette(theme = {}) {
  const parseColorToRgb = (color = '') => {
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
      if (hex.length >= 6) {
        return {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16)
        };
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
  const body = theme.bodyTextColor || theme.textColor || '#334155';
  return {
    title: theme.titleTextColor || (darkBg ? '#F8FAFC' : '#1F2937'),
    body,
    subtitle: theme.subtitleTextColor || (darkBg ? '#CBD5E1' : '#64748B'),
    tertiary: theme.tertiaryTextColor || '#94A3B8',
    inverse: theme.inverseTextColor || (darkPrimary ? '#FFFFFF' : '#0F172A')
  };
}

Page({
  data: {
    theme: THEMES[0],
    textPalette: resolveSemanticTextPalette(THEMES[0]),
    post: null,
    activeScene: 'rainy',
    sceneLabel: SCENE_META.rainy.label,
    sceneDescription: SCENE_META.rainy.desc,
    sceneIntensity: 65,
    rainDrops: [],
    sceneParticles: [],
    comments: [],
    sceneOptions: SCENE_OPTIONS,
    isOwnerPost: false,
    isEditing: false
  },

  onLoad(options = {}) {
    const post = this.parsePostPayload(options.payload);
    const isOwnerPost = this.resolveIsOwnerPost(post);
    const scenePackage = post.scenePackage || {};
    const themeId = Number(scenePackage.themeId);
    const theme = Number.isFinite(themeId) ? getThemeById(themeId) : this.getThemeFromGlobal();

    this.setData({
      theme,
      textPalette: resolveSemanticTextPalette(theme),
      post,
      isOwnerPost,
      comments: this.buildComments(post)
    });

    this.applySceneFromPackage(scenePackage);
    this.updateNavigationBarColor();
    wx.setNavigationBarTitle({ title: `${post.typeLabel || '内容'}详情` });
  },

  resolveIsOwnerPost(post = {}) {
    if (post.isOwner === true) return true;
    const sourceTab = String(post.sourceTab || '');
    return ['my', 'post', 'diary', 'writing'].includes(sourceTab);
  },

  getThemeFromGlobal() {
    try {
      const app = getApp();
      const state = app.getThemeState ? app.getThemeState() : null;
      return (state && state.theme) || app.globalData.theme || THEMES[0];
    } catch (e) {
      return THEMES[0];
    }
  },

  parsePostPayload(payload) {
    try {
      if (!payload) throw new Error('missing payload');
      const decoded = decodeURIComponent(payload);
      const parsed = JSON.parse(decoded);
      return parsed || {};
    } catch (e) {
      return {
        id: `fallback-${Date.now()}`,
        type: 'diary',
        typeLabel: '日记',
        typeIcon: '📔',
        content: '未找到内容，已为你展示默认详情。',
        time: '刚刚',
        scenePackage: { sceneKey: 'rainy', sceneIntensity: 65 }
      };
    }
  },

  applySceneFromPackage(scenePackage = {}) {
    const sceneKey = SCENE_META[scenePackage.sceneKey] ? scenePackage.sceneKey : 'rainy';
    const sceneIntensity = Math.max(20, Math.min(100, Number(scenePackage.sceneIntensity) || 65));
    const sceneMeta = SCENE_META[sceneKey] || SCENE_META.rainy;
    this.setData({
      activeScene: sceneKey,
      sceneIntensity,
      sceneLabel: sceneMeta.label,
      sceneDescription: sceneMeta.desc,
      rainDrops: sceneKey === 'rainy' ? this.buildRainDrops(sceneIntensity) : [],
      sceneParticles: this.buildSceneParticles(sceneKey, sceneIntensity),
      'post.scenePackage.sceneKey': sceneKey,
      'post.scenePackage.sceneIntensity': sceneIntensity
    });
  },

  onToggleEditMode() {
    if (!this.data.isOwnerPost) return;
    this.setData({
      isEditing: !this.data.isEditing
    });
  },

  onSavePostEdit() {
    if (!this.data.isOwnerPost) return;
    const content = String(this.data.post && this.data.post.content || '').trim();
    if (!content) {
      wx.showToast({ title: '内容不能为空', icon: 'none' });
      return;
    }
    this.setData({
      isEditing: false,
      'post.content': content
    });
    wx.showToast({
      title: '已保存修改',
      icon: 'success'
    });
  },

  onPostContentInput(e) {
    if (!this.data.isOwnerPost || !this.data.isEditing) return;
    this.setData({
      'post.content': e.detail.value
    });
  },

  onLetterSalutationInput(e) {
    if (!this.data.isOwnerPost || !this.data.isEditing) return;
    this.setData({
      'post.letterSalutation': e.detail.value
    });
  },

  onLetterSignatureInput(e) {
    if (!this.data.isOwnerPost || !this.data.isEditing) return;
    this.setData({
      'post.letterSignature': e.detail.value
    });
  },

  onPostcardLocationInput(e) {
    if (!this.data.isOwnerPost || !this.data.isEditing) return;
    this.setData({
      'post.postcardLocation': e.detail.value
    });
  },

  onDiaryWeatherInput(e) {
    if (!this.data.isOwnerPost || !this.data.isEditing) return;
    this.setData({
      'post.diaryWeather': e.detail.value
    });
  },

  onDiaryMoodScoreChange(e) {
    if (!this.data.isOwnerPost || !this.data.isEditing) return;
    const value = Number(e.detail.value);
    this.setData({
      'post.diaryMoodScore': Number.isFinite(value) ? value : 5
    });
  },

  onSceneChange(e) {
    if (!this.data.isOwnerPost || !this.data.isEditing) return;
    const sceneKey = e.currentTarget.dataset.scene;
    if (!SCENE_META[sceneKey]) {
      return;
    }
    this.applySceneFromPackage({
      sceneKey,
      sceneIntensity: this.data.sceneIntensity
    });
  },

  onSceneIntensityChange(e) {
    if (!this.data.isOwnerPost || !this.data.isEditing) return;
    const value = Number(e.detail.value);
    const sceneIntensity = Number.isFinite(value) ? Math.max(20, Math.min(100, value)) : this.data.sceneIntensity;
    this.applySceneFromPackage({
      sceneKey: this.data.activeScene,
      sceneIntensity
    });
  },

  buildRainDrops(intensity = 65) {
    const count = Math.max(8, Math.round(12 + (intensity / 100) * 18));
    return Array.from({ length: count }, (_, index) => ({
      id: `detail-rain-${index}`,
      left: Math.round(Math.random() * 100),
      height: Math.round(16 + Math.random() * 24),
      duration: Math.round(1000 + Math.random() * 900),
      delay: Math.round(Math.random() * 1600),
      opacity: Number((0.2 + Math.random() * 0.28).toFixed(2))
    }));
  },

  buildSceneParticles(sceneKey = 'rainy', intensity = 65) {
    const kindsMap = {
      sunny: ['sun', 'sun', 'cloud'],
      cloudy: ['cloud', 'cloud', 'wind'],
      rainy: ['rain', 'rain', 'cloud'],
      windy: ['wind', 'leaf', 'cloud'],
      snowy: ['snow', 'snow', 'cloud'],
      stream: ['leaf', 'cloud', 'wind']
    };
    const kinds = kindsMap[sceneKey] || kindsMap.rainy;
    const count = Math.max(8, Math.round(10 + (intensity / 100) * 18));
    return Array.from({ length: count }, (_, index) => ({
      id: `detail-scene-${index}`,
      kind: kinds[index % kinds.length],
      left: Math.round(Math.random() * 100),
      top: Math.round(Math.random() * 100),
      size: Math.round(8 + Math.random() * 18),
      opacity: Number((0.16 + Math.random() * 0.36).toFixed(2)),
      duration: Math.round(2200 + Math.random() * 2600),
      delay: Math.round(Math.random() * 1800)
    }));
  },

  buildComments(post = {}) {
    if (Array.isArray(post.comments) && post.comments.length) {
      return post.comments.slice(0, 20);
    }
    const typeLabel = post.typeLabel || '这条内容';
    return [
      {
        id: `comment-${post.id || '1'}-1`,
        nickname: '路过的小耳朵',
        content: `读完 ${typeLabel}，有被温柔接住。`,
        time: '刚刚'
      },
      {
        id: `comment-${post.id || '1'}-2`,
        nickname: '云朵收藏家',
        content: '这段文字很有画面感，感谢分享。',
        time: '2分钟前'
      },
      {
        id: `comment-${post.id || '1'}-3`,
        nickname: '晚风',
        content: '留言打个卡，愿你今天也顺顺利利。',
        time: '5分钟前'
      }
    ];
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
  }
});