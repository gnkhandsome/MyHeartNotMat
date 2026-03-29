// app.js
import { getThemeById, getThemeTypeById, THEME_STYLE_TYPES } from './theme.config.js';

const SCENE_SOUND_PROFILES = {
  sunny: {
    tracks: [
      { src: 'https://assets.mixkit.co/active_storage/sfx/1185/1185-preview.mp3', weight: 0.34, role: 'accent' },
      { src: 'https://assets.mixkit.co/active_storage/sfx/1153/1153-preview.mp3', weight: 0.76, role: 'bed' }
    ]
  },
  cloudy: {
    tracks: [
      { src: 'https://assets.mixkit.co/active_storage/sfx/1153/1153-preview.mp3', weight: 0.7, role: 'bed' },
      { src: 'https://assets.mixkit.co/active_storage/sfx/1736/1736-preview.mp3', weight: 0.22, role: 'accent' }
    ]
  },
  rainy: {
    tracks: [
      { src: 'https://assets.mixkit.co/active_storage/sfx/1199/1199-preview.mp3', weight: 0.88, role: 'bed' },
      { src: 'https://assets.mixkit.co/active_storage/sfx/1248/1248-preview.mp3', weight: 0.28, role: 'accent' }
    ]
  },
  windy: {
    tracks: [
      { src: 'https://assets.mixkit.co/active_storage/sfx/1162/1162-preview.mp3', weight: 0.74, role: 'bed' },
      { src: 'https://assets.mixkit.co/active_storage/sfx/1175/1175-preview.mp3', weight: 0.36, role: 'accent' }
    ]
  },
  snowy: {
    tracks: [
      { src: 'https://assets.mixkit.co/active_storage/sfx/1267/1267-preview.mp3', weight: 0.72, role: 'bed' },
      { src: 'https://assets.mixkit.co/active_storage/sfx/2420/2420-preview.mp3', weight: 0.2, role: 'accent' }
    ]
  },
  stream: {
    tracks: [
      { src: 'https://assets.mixkit.co/active_storage/sfx/1195/1195-preview.mp3', weight: 0.8, role: 'bed' },
      { src: 'https://assets.mixkit.co/active_storage/sfx/1185/1185-preview.mp3', weight: 0.24, role: 'accent' }
    ]
  }
};

const DEFAULT_AMBIENT_AUDIO_SRC = 'https://assets.mixkit.co/active_storage/sfx/1153/1153-preview.mp3';
const AUDIO_CONFIG_CACHE_KEY = 'remoteAudioConfigCache';
const AUDIO_CONFIG_FUNCTION_NAME = 'getAudioConfig';
const AUDIO_SCENE_KEYS = Object.keys(SCENE_SOUND_PROFILES);

function isNonEmptyString(value) {
  return typeof value === 'string' && !!value.trim();
}

function cloneSceneProfiles(source = SCENE_SOUND_PROFILES) {
  return JSON.parse(JSON.stringify(source || {}));
}

function normalizeTrack(track = {}) {
  if (!track || typeof track !== 'object' || !isNonEmptyString(track.src)) {
    return null;
  }

  const weight = Number(track.weight);
  const role = String(track.role || 'balanced').trim();

  return {
    src: track.src.trim(),
    weight: Number.isFinite(weight) ? Math.min(1, Math.max(0, weight)) : 0.5,
    role: ['bed', 'accent', 'balanced'].includes(role) ? role : 'balanced'
  };
}

function normalizeSceneProfiles(sceneProfiles = {}) {
  const normalized = {};
  AUDIO_SCENE_KEYS.forEach((sceneKey) => {
    const scene = sceneProfiles && sceneProfiles[sceneKey];
    const tracks = Array.isArray(scene && scene.tracks)
      ? scene.tracks.map((track) => normalizeTrack(track)).filter(Boolean).slice(0, 2)
      : [];
    if (tracks.length) {
      normalized[sceneKey] = { tracks };
    }
  });
  return normalized;
}

function normalizeRemoteAudioConfig(rawConfig = {}) {
  const payload = rawConfig && typeof rawConfig === 'object' ? rawConfig : {};
  const normalizedProfiles = normalizeSceneProfiles(payload.sceneProfiles || {});

  return {
    defaultAmbientSrc: isNonEmptyString(payload.defaultAmbientSrc)
      ? payload.defaultAmbientSrc.trim()
      : DEFAULT_AMBIENT_AUDIO_SRC,
    sceneProfiles: Object.keys(normalizedProfiles).length
      ? normalizedProfiles
      : cloneSceneProfiles(SCENE_SOUND_PROFILES),
    version: Number(payload.version) || 0,
    updatedAt: payload.updatedAt || null
  };
}

// 随机用户信息生成
const RANDOM_NICKNAMES = [
  '晚风', '星辰', '旧梦', '青柠', '岛屿', '浅唱', '未央', '安然',
  '沐风', '听海', '忘忧', '逐光', '忆梦', '暖夏', '微凉', '清欢',
  '云游', '花语', '月明', '星落', '风吹', '雨落', '雪飘', '雾起'
];

const RANDOM_MOODS = [
  '今天心情不错', '在自己的世界里漫游', '记录当下的美好',
  '与自己对话', '寻找内心的平静', '享受独处时光',
  '被温柔包围着', '在文字里取暖', '让思绪自由飘荡',
  '珍惜每一个瞬间', '生活明朗，万物可爱', '人间值得，未来可期'
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomNickname() {
  const nickname = getRandomItem(RANDOM_NICKNAMES);
  const suffix = Math.floor(Math.random() * 1000);
  const result = nickname + suffix;
  return result.length > 8 ? nickname : result;
}

function generateRandomMood() {
  return getRandomItem(RANDOM_MOODS);
}

function generateRandomUserInfo() {
  return {
    nickname: generateRandomNickname(),
    mood: generateRandomMood()
  };
}

function persistUserInfo(userInfo) {
  try {
    wx.setStorageSync('userInfo', userInfo);
  } catch (e) {
    console.error('持久化用户信息失败:', e);
  }
}

function loadUserInfo() {
  try {
    const stored = wx.getStorageSync('userInfo');
    if (stored && stored.nickname) {
      return stored;
    }
  } catch (e) {
    console.error('加载用户信息失败:', e);
  }
  const newUserInfo = generateRandomUserInfo();
  persistUserInfo(newUserInfo);
  return newUserInfo;
}

function updateUserInfo(newInfo) {
  const app = getApp();
  const currentInfo = app.globalData.userInfo || {};
  const updatedInfo = {
    ...currentInfo,
    ...newInfo
  };
  app.globalData.userInfo = updatedInfo;
  persistUserInfo(updatedInfo);
  
  // 同步更新所有已发布内容中的用户信息
  updatePostsUserInfo(updatedInfo);
  
  return updatedInfo;
}

function updatePostsUserInfo(userInfo) {
  try {
    const app = getApp();
    let myDiaryList = app.globalData.diaryList || [];
    let myPostList = app.globalData.myPostList || [];
    
    // 更新所有发布内容中的用户信息（包括头像和昵称）
    myDiaryList = myDiaryList.map(item => ({
      ...item,
      nickname: userInfo.nickname,
      avatar: userInfo.avatar
    }));
    
    myPostList = myPostList.map(item => ({
      ...item,
      nickname: userInfo.nickname,
      avatar: userInfo.avatar
    }));
    
    // 更新全局数据
    app.globalData.diaryList = myDiaryList;
    app.globalData.myPostList = myPostList;
    
    // 同时更新 squarePostList（从 myDiaryList 中筛选公开内容）
    app.globalData.squarePostList = myDiaryList.filter(item => !item.isPrivate);
    
    // 保存到本地存储
    wx.setStorageSync('myDiaryList', myDiaryList);
    wx.setStorageSync('myPostList', myPostList);
    
    console.log('已同步更新所有发布内容的用户信息');
  } catch (e) {
    console.error('同步更新用户信息失败:', e);
  }
}

function resolveSceneTrackRoleGain(track = {}, intensity = 0.65) {
  const safeIntensity = Math.min(1, Math.max(0.2, Number(intensity) || 0.65));
  const role = track.role || 'balanced';

  if (role === 'bed') {
    // 底噪在低强度下也要可感知，高强度时温和拉升
    return 0.55 + safeIntensity * 0.45;
  }

  if (role === 'accent') {
    // 点缀声在低强度更克制，高强度明显抬升层次
    return 0.12 + Math.pow(safeIntensity, 1.35) * 0.88;
  }

  return 0.35 + safeIntensity * 0.65;
}

App({
  onLaunch() {
    // 小程序启动时执行
    console.log('小程序启动');
    
    // 初始化云开发
    wx.cloud.init({
      env: 'cloud1-9gcsvsv3821dae9b'
    });
    
    // 初始化数据
    this.initData();
    // 初始化主题
    this.initTheme();
    // 初始化音频配置（先本地兜底）
    this.initAudioConfig();
    // 初始化音频管理
    this.initAudioManager();
    this.initSceneAudioManager();

    // 异步拉取云端音频配置，成功后热更新
    this.loadRemoteAudioConfig();
  },

  initData() {
    // 从本地存储加载数据到全局
    console.log('app.js initData 开始初始化数据');
    
    // 初始化用户信息
    const userInfo = loadUserInfo();
    this.globalData.userInfo = userInfo;
    console.log('初始化用户信息成功:', userInfo);
    
    try {
      const myDiaryList = wx.getStorageSync('myDiaryList') || [];
      this.globalData.diaryList = myDiaryList;
      console.log('初始化数据成功 - diaryList:', myDiaryList.length, '条');
      if (myDiaryList.length > 0) {
        console.log('数据详情:', myDiaryList);
      }
    } catch (e) {
      console.error('初始化数据失败:', e);
    }
  },
  
  onShow() {
    // 小程序显示时执行
    console.log('小程序显示');
    // 从存储读取主题ID
    this.loadThemeFromStorage();
  },
  
  onHide() {
    // 小程序隐藏时执行
    console.log('小程序隐藏');
    this.persistAudioState();
  },
  
  // 初始化主题
  initTheme() {
    try {
      const themeId = wx.getStorageSync('themeId') || 1; // 默认使用法式玫瑰奶油主题（ID = 1）
      this.syncThemeState(themeId, {
        persist: false,
        switchAudio: false
      });
    } catch (e) {
      console.error('初始化主题失败:', e);
      this.syncThemeState(1, { // 默认使用法式玫瑰奶油主题（ID = 1）
        persist: false,
        switchAudio: false
      });
    }
  },

  // 获取统一主题状态
  getThemeState() {
    if (!this.globalData.theme) {
      this.syncThemeState(0, {
        persist: false,
        switchAudio: false
      });
    }

    return {
      theme: this.globalData.theme,
      themeId: this.globalData.themeId,
      activeThemeType: this.globalData.activeThemeType
    };
  },

  // 获取统一音频状态
  getAudioState() {
    return {
      isAudioPlaying: !!this.globalData.isAudioPlaying,
      audioVolume: Number(this.globalData.audioVolume ?? 0.5),
      currentAudioSrc: this.globalData.currentAudioSrc || this.getResolvedAudioSrc()
    };
  },

  getSceneAudioState() {
    return {
      sceneKey: this.globalData.sceneAudioProfileKey || 'rainy',
      sceneIntensity: Number(this.globalData.sceneAudioIntensity ?? 0.65),
      sceneEnabled: this.globalData.sceneAudioEnabled !== false
    };
  },

  // 统一同步主题状态
  syncThemeState(themeId, options = {}) {
    const {
      persist = true,
      switchAudio = true
    } = options;

    const resolvedThemeId = Number.isInteger(themeId) ? themeId : 0;
    const theme = getThemeById(resolvedThemeId);

    this.globalData.theme = theme;
    this.globalData.themeId = theme.id;
    this.globalData.activeThemeType = getThemeTypeById(theme.id);

    if (persist) {
      wx.setStorageSync('themeId', theme.id);
    }

    if (switchAudio) {
      this.switchAudio(theme.audioSrc);
    }

    return this.getThemeState();
  },
  
  // 从存储加载主题
  loadThemeFromStorage() {
    const themeId = wx.getStorageSync('themeId') || 0;
    if (themeId !== this.globalData.themeId) {
      this.syncThemeState(themeId, {
        persist: false,
        switchAudio: true
      });
    }
  },
  
  // 切换主题
  switchTheme(themeId) {
    return this.syncThemeState(themeId, {
      persist: true,
      switchAudio: true
    });
  },

  getDefaultAudioConfig() {
    return {
      defaultAmbientSrc: DEFAULT_AMBIENT_AUDIO_SRC,
      sceneProfiles: cloneSceneProfiles(SCENE_SOUND_PROFILES),
      version: 0,
      updatedAt: null,
      source: 'local-default'
    };
  },

  initAudioConfig() {
    let config = this.getDefaultAudioConfig();

    try {
      const cachedConfig = wx.getStorageSync(AUDIO_CONFIG_CACHE_KEY);
      if (cachedConfig && typeof cachedConfig === 'object') {
        const normalized = normalizeRemoteAudioConfig(cachedConfig);
        config = {
          ...normalized,
          source: 'local-cache'
        };
      }
    } catch (e) {
      console.warn('读取音频配置缓存失败，使用本地默认配置:', e);
    }

    this.globalData.audioConfig = config;
    return config;
  },

  applyAudioConfig(nextConfig = {}, options = {}) {
    const { persist = true, source = 'cloud' } = options;
    const normalized = normalizeRemoteAudioConfig(nextConfig);

    this.globalData.audioConfig = {
      ...normalized,
      source
    };

    if (persist) {
      try {
        wx.setStorageSync(AUDIO_CONFIG_CACHE_KEY, normalized);
      } catch (e) {
        console.warn('缓存音频配置失败:', e);
      }
    }

    if (this.globalData.audioContext) {
      const targetAudioSrc = this.getResolvedAudioSrc();
      if (this.globalData.currentAudioSrc !== targetAudioSrc) {
        this.switchAudio(targetAudioSrc);
      }
    }

    if (this.globalData.sceneAudioContexts && this.globalData.sceneAudioContexts.length) {
      this.setSceneSoundscape(this.globalData.sceneAudioProfileKey || 'rainy', {
        autoPlay: this.globalData.isAudioPlaying,
        enabled: this.globalData.sceneAudioEnabled !== false
      });
    }

    return this.globalData.audioConfig;
  },

  async loadRemoteAudioConfig() {
    try {
      const res = await wx.cloud.callFunction({
        name: AUDIO_CONFIG_FUNCTION_NAME,
        data: {}
      });
      const result = (res && res.result) || {};
      if (!result.success) {
        throw new Error(result.message || '云端音频配置获取失败');
      }

      const remoteConfig = normalizeRemoteAudioConfig(result.data && result.data.config);
      this.applyAudioConfig(remoteConfig, {
        persist: true,
        source: 'cloud'
      });

      console.log('已加载云端音频配置:', {
        version: remoteConfig.version,
        updatedAt: remoteConfig.updatedAt
      });
      return remoteConfig;
    } catch (e) {
      console.warn('加载云端音频配置失败，继续使用本地配置:', e);
      return null;
    }
  },
  
  // 初始化音频管理
  initAudioManager() {
    const audioContext = wx.createInnerAudioContext();
    const storedVolume = Number(wx.getStorageSync('audioVolume'));
    const storedAudioPlaying = wx.getStorageSync('audioPlaying');

    this.globalData.audioContext = audioContext;
    this.globalData.audioVolume = Number.isFinite(storedVolume)
      ? Math.min(1, Math.max(0, storedVolume))
      : 0.5;
    this.globalData.isAudioPlaying = typeof storedAudioPlaying === 'boolean'
      ? storedAudioPlaying
      : false;

    audioContext.loop = true;
    audioContext.volume = this.globalData.audioVolume;
    this.globalData.currentAudioSrc = null;

    // 统一使用根目录白噪音（临时 V1 方案）
    const initialThemeState = this.getThemeState();
    const initialAudioSrc = this.getResolvedAudioSrc(initialThemeState.theme?.audioSrc);
    audioContext.src = initialAudioSrc;
    this.globalData.currentAudioSrc = initialAudioSrc;
    if (this.globalData.isAudioPlaying) {
      audioContext.play();
    }
    
    // 音频异常处理
    audioContext.onError((res) => {
      console.error('音频播放错误:', res);
      const hasSceneAudioFallback = Array.isArray(this.globalData.sceneAudioContexts)
        && this.globalData.sceneAudioContexts.some((ctx) => ctx && ctx.src);

      if (hasSceneAudioFallback) {
        return;
      }

      wx.showToast({
        title: '音频播放失败',
        icon: 'none'
      });
    });

    audioContext.onPlay(() => {
      this.setAudioPlayingState(true);
    });

    audioContext.onPause(() => {
      this.setAudioPlayingState(false);
    });

    audioContext.onStop(() => {
      this.setAudioPlayingState(false);
    });
    
    // 音频加载完成
    audioContext.onCanplay(() => {
      console.log('音频加载完成');
    });
    
    // 音频播放结束
    audioContext.onEnded(() => {
      console.log('音频播放结束');
      this.setAudioPlayingState(false);
    });

    this.persistAudioState();
  },

  getResolvedAudioSrc() {
    const runtimeSrc = this.globalData.audioConfig && this.globalData.audioConfig.defaultAmbientSrc;
    return isNonEmptyString(runtimeSrc) ? runtimeSrc : DEFAULT_AMBIENT_AUDIO_SRC;
  },

  getSceneProfile(sceneKey = 'rainy') {
    const profiles = (this.globalData.audioConfig && this.globalData.audioConfig.sceneProfiles) || SCENE_SOUND_PROFILES;
    return profiles[sceneKey] || profiles.rainy || SCENE_SOUND_PROFILES.rainy;
  },

  initSceneAudioManager() {
    const contexts = [];
    for (let i = 0; i < 2; i += 1) {
      const ctx = wx.createInnerAudioContext();
      ctx.loop = true;
      ctx.autoplay = false;
      ctx.obeyMuteSwitch = true;
      ctx.volume = 0;
      ctx.__trackIndex = i;
      ctx.__trackRole = 'balanced';
      ctx.__fallbackApplied = false;
      ctx.onError(() => {
        if (!ctx.__fallbackApplied) {
          ctx.__fallbackApplied = true;
          // 缺素材时避免所有分轨都回退成同一雨声，导致场景听感趋同
          const fallbackSrc = ctx.__trackRole === 'accent' ? '' : DEFAULT_AMBIENT_AUDIO_SRC;

          if (!fallbackSrc) {
            ctx.stop();
            ctx.volume = 0;
            return;
          }

          ctx.src = fallbackSrc;
          if (this.globalData.isAudioPlaying && this.globalData.sceneAudioEnabled !== false) {
            ctx.play();
          }
        }
      });
      contexts.push(ctx);
    }

    this.globalData.sceneAudioContexts = contexts;
    this.globalData.sceneAudioProfileKey = 'rainy';
    const storedIntensity = Number(wx.getStorageSync('homeSceneAudioIntensity'));
    this.globalData.sceneAudioIntensity = Number.isFinite(storedIntensity)
      ? Math.min(1, Math.max(0.2, storedIntensity / 100))
      : 0.65;
    this.globalData.sceneAudioEnabled = true;

    this.setSceneSoundscape('rainy', {
      intensity: this.globalData.sceneAudioIntensity,
      autoPlay: false
    });
  },

  setSceneIntensity(intensity = 0.65, options = {}) {
    const { persist = true } = options;
    const safe = Math.min(1, Math.max(0.2, Number(intensity) || 0.65));
    this.globalData.sceneAudioIntensity = safe;
    this.applySceneAudioVolumes();
    if (persist) {
      wx.setStorageSync('homeSceneAudioIntensity', Math.round(safe * 100));
    }
    return safe;
  },

  applySceneAudioVolumes() {
    const contexts = this.globalData.sceneAudioContexts || [];
    if (!contexts.length) return;

    const profile = this.getSceneProfile(this.globalData.sceneAudioProfileKey);
    const sceneIntensity = Number(this.globalData.sceneAudioIntensity) || 0.65;
    // 避免与 roleGain 内的 intensity 再次叠加，导致滑块体感偏弱
    const baseVolume = Number(this.globalData.audioVolume) || 0.5;
    const enabled = this.globalData.sceneAudioEnabled !== false;

    contexts.forEach((ctx, index) => {
      const track = (profile.tracks && profile.tracks[index]) || {};
      const weight = Number(track.weight || 0);
      const roleGain = resolveSceneTrackRoleGain(track, sceneIntensity);
      const target = enabled ? Math.min(1, Math.max(0, baseVolume * weight * roleGain)) : 0;
      ctx.volume = target;
    });
  },

  setSceneSoundscape(sceneKey = 'rainy', options = {}) {
    const {
      intensity,
      autoPlay = true,
      enabled = true
    } = options;

    const profileKey = SCENE_SOUND_PROFILES[sceneKey] ? sceneKey : 'rainy';
    const profile = this.getSceneProfile(profileKey);
    const contexts = this.globalData.sceneAudioContexts || [];
    if (!contexts.length) return;

    this.globalData.sceneAudioProfileKey = profileKey;
    this.globalData.sceneAudioEnabled = enabled;
    if (typeof intensity === 'number') {
      this.setSceneIntensity(intensity, { persist: true });
    }

    contexts.forEach((ctx, index) => {
      const track = profile.tracks[index];
      if (!track) {
        ctx.__trackRole = 'balanced';
        ctx.stop();
        return;
      }
      ctx.__trackRole = track.role || 'balanced';
      if (ctx.src !== track.src) {
        ctx.__fallbackApplied = false;
        ctx.src = track.src;
      }
    });

    this.applySceneAudioVolumes();

    if (this.globalData.isAudioPlaying && autoPlay && enabled) {
      contexts.forEach((ctx) => ctx.play());
    }
  },

  pauseSceneAudio() {
    const contexts = this.globalData.sceneAudioContexts || [];
    contexts.forEach((ctx) => ctx.pause());
  },

  resumeSceneAudio() {
    const contexts = this.globalData.sceneAudioContexts || [];
    if (!contexts.length || this.globalData.sceneAudioEnabled === false) return;
    this.applySceneAudioVolumes();
    contexts.forEach((ctx) => ctx.play());
  },

  persistAudioState() {
    wx.setStorageSync('audioVolume', this.globalData.audioVolume);
    wx.setStorageSync('audioPlaying', this.globalData.isAudioPlaying);
  },

  setAudioPlayingState(isPlaying) {
    this.globalData.isAudioPlaying = !!isPlaying;
    this.persistAudioState();
  },

  setAudioVolume(volume, options = {}) {
    const { persist = true } = options;
    const safeVolume = Math.min(1, Math.max(0, Number(volume) || 0));
    // 使用感知曲线拉开低中高段差异，提升滑杆可感知度
    const perceivedVolume = Math.pow(safeVolume, 1.4);
    this.globalData.audioVolume = perceivedVolume;

    // 更新主音频上下文音量
    if (this.globalData.audioContext) {
      this.globalData.audioContext.volume = perceivedVolume;
    }

    // 更新场景音频上下文音量
    this.applySceneAudioVolumes();

    if (persist) {
      this.persistAudioState();
    }

    return safeVolume;
  },
  
  // 切换音频
  switchAudio(audioSrc) {
    const targetAudioSrc = this.getResolvedAudioSrc(audioSrc);
    if (!this.globalData.audioContext) return;
    if (this.globalData.currentAudioSrc === targetAudioSrc) {
      if (this.globalData.isAudioPlaying) {
        const audioContext = this.globalData.audioContext;
        const targetVolume = this.globalData.audioVolume;
        if (Math.abs((audioContext.volume ?? 0) - targetVolume) > 0.01) {
          this.clearAudioFadeTimers();
          this.fadeAudioVolume(audioContext.volume, targetVolume);
        }
      }
      return;
    }
    
    const audioContext = this.globalData.audioContext;
    const shouldAutoPlay = this.globalData.isAudioPlaying;
    this.clearAudioFadeTimers();
    
    // 非播放态只切换 source，不触发自动播放
    if (!shouldAutoPlay) {
      audioContext.stop();
      audioContext.src = targetAudioSrc;
      this.globalData.currentAudioSrc = targetAudioSrc;
      return;
    }

    // 淡入淡出切换
    if (this.globalData.currentAudioSrc) {
      let volume = audioContext.volume;
      this.globalData.fadeOutTimer = setInterval(() => {
        volume -= 0.1;
        if (volume <= 0) {
          clearInterval(this.globalData.fadeOutTimer);
          this.globalData.fadeOutTimer = null;
          audioContext.stop();
          this.playAudio(targetAudioSrc);
        } else {
          audioContext.volume = volume;
        }
      }, 100);
    } else {
      this.playAudio(targetAudioSrc);
    }
  },

  clearAudioFadeTimers() {
    if (this.globalData.fadeOutTimer) {
      clearInterval(this.globalData.fadeOutTimer);
      this.globalData.fadeOutTimer = null;
    }

    if (this.globalData.fadeInTimer) {
      clearInterval(this.globalData.fadeInTimer);
      this.globalData.fadeInTimer = null;
    }
  },

  fadeAudioVolume(fromVolume, toVolume, options = {}) {
    const {
      step = 0.08,
      interval = 80,
      onComplete
    } = options;

    const audioContext = this.globalData.audioContext;
    if (!audioContext) {
      if (onComplete) onComplete();
      return;
    }

    let current = Math.min(1, Math.max(0, Number(fromVolume) || 0));
    const target = Math.min(1, Math.max(0, Number(toVolume) || 0));
    const delta = target >= current ? Math.abs(step) : -Math.abs(step);

    this.globalData.fadeInTimer = setInterval(() => {
      current += delta;
      const reachedTarget = delta > 0 ? current >= target : current <= target;
      audioContext.volume = reachedTarget ? target : current;

      if (reachedTarget) {
        clearInterval(this.globalData.fadeInTimer);
        this.globalData.fadeInTimer = null;
        if (onComplete) onComplete();
      }
    }, interval);
  },
  
  // 播放音频
  playAudio(audioSrc) {
    if (!this.globalData.audioContext) return;
    const audioContext = this.globalData.audioContext;
    const targetAudioSrc = this.getResolvedAudioSrc(audioSrc);

    this.clearAudioFadeTimers();
    audioContext.src = targetAudioSrc;
    audioContext.volume = 0;
    audioContext.play();
    
    // 淡入
    this.fadeAudioVolume(0, this.globalData.audioVolume);
    
    this.globalData.currentAudioSrc = targetAudioSrc;
    this.setAudioPlayingState(true);
  },
  
  // 暂停音频
  pauseAudio() {
    if (this.globalData.audioContext) {
      this.clearAudioFadeTimers();
      this.globalData.audioContext.pause();
      this.setAudioPlayingState(false);
    }
    this.pauseSceneAudio();
  },
  
  // 恢复音频
  resumeAudio() {
    if (this.globalData.audioContext) {
      const targetSrc = this.globalData.currentAudioSrc || this.getResolvedAudioSrc();
      if (!this.globalData.currentAudioSrc) {
        this.globalData.audioContext.src = targetSrc;
        this.globalData.currentAudioSrc = targetSrc;
      }
      this.globalData.audioContext.volume = this.globalData.audioVolume;
      this.globalData.audioContext.play();
      this.setAudioPlayingState(true);
    }
    this.resumeSceneAudio();
  },

  // 播放/暂停切换
  toggleAudio() {
    if (this.globalData.isAudioPlaying) {
      this.pauseAudio();
      return false;
    }
    this.resumeAudio();
    return true;
  },

  // 粉碎音效（一次性）
  playShatterSfx(audioSrc = DEFAULT_AMBIENT_AUDIO_SRC) {
    try {
      if (!this.globalData.shatterAudioContext) {
        this.globalData.shatterAudioContext = wx.createInnerAudioContext();
        this.globalData.shatterAudioContext.loop = false;
      }

      const sfx = this.globalData.shatterAudioContext;
      sfx.stop();
      sfx.src = audioSrc;
      sfx.volume = Math.min(1, Math.max(0, this.globalData.audioVolume || 0.5));
      sfx.play();
    } catch (e) {
      console.error('播放粉碎音效失败:', e);
    }
  },

  // 删除接口模拟（后续可替换真实 API）
  deleteContentItem(payload = {}) {
    const { id = '', type = 'post' } = payload;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          id,
          type,
          message: 'deleted'
        });
      }, 240);
    });
  },

  // 用户信息相关
  generateRandomUserInfo,
  loadUserInfo,
  updateUserInfo,
  persistUserInfo,
  updatePostsUserInfo,
  
  globalData: {
    userInfo: null,
    theme: null,
    themeId: 0,
    activeThemeType: THEME_STYLE_TYPES.FEMALE,
    audioContext: null,
    currentAudioSrc: null,
    audioVolume: 0.5,
    isAudioPlaying: false,
    fadeOutTimer: null,
    fadeInTimer: null,
    shatterAudioContext: null,
    audioConfig: null,
    sceneAudioContexts: [],
    sceneAudioProfileKey: 'rainy',
    sceneAudioIntensity: 0.65,
    sceneAudioEnabled: true,
    // 新增：内容数据存储
    myPostList: [],
    diaryList: [],
    squarePostList: []
  }
});